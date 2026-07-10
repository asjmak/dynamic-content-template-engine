// Verifikasi menyeluruh: semua route publik + admin (dengan auth) + API.
// Jalankan saat dev server jalan: node scripts/verify-site.mjs
import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  const txt = fs.readFileSync(file, "utf8");
  for (const line of txt.split("\n")) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let val = m[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
      val = val.slice(1, -1);
    if (!(m[1] in process.env)) process.env[m[1]] = val;
  }
}
loadEnv(".env");
loadEnv(".env.local");

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SITE = process.env.VERIFY_SITE || "http://localhost:3000";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@local.dev";
const ADMIN_PASS = process.env.ADMIN_PASS || "Admin12345!";
const ref = URL.match(/https:\/\/([^.]+)\.supabase/)[1];
const COOKIE_NAME = `sb-${ref}-auth-token`;

const anon = createClient(URL, ANON, { auth: { persistSession: false } });
const admin = createClient(URL, SERVICE, { auth: { persistSession: false } });

let pass = 0,
  fail = 0;
const fails = [];
function rec(name, ok, detail = "") {
  if (ok) pass++;
  else {
    fail++;
    fails.push(`${name} -> ${detail}`);
  }
  console.log(`${ok ? "✓" : "✗"} ${name}${detail ? "  (" + detail + ")" : ""}`);
}

// ---------- login ----------
const { data: authData, error: authErr } = await anon.auth.signInWithPassword({
  email: ADMIN_EMAIL,
  password: ADMIN_PASS,
});
if (authErr || !authData.session) {
  console.error("LOGIN GAGAL:", authErr?.message);
  process.exit(1);
}
const cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(authData.session))}`;
console.log("✓ login admin ok\n");

async function get(path, { auth = false, method = "GET", body } = {}) {
  const headers = {};
  if (auth) headers.cookie = cookie;
  if (body) headers["content-type"] = "application/json";
  try {
    const res = await fetch(SITE + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      redirect: "manual",
    });
    let text = "";
    try { text = method === "GET" ? await res.text() : ""; } catch {}
    return { res, text, err: null };
  } catch (e) {
    return { res: { status: 0, headers: { get: () => null } }, text: "", err: e.message };
  }
}

// ---------- public routes ----------
console.log("== PUBLIC ==");
const home = await get("/");
rec("GET / (200)", home.res.status === 200, "HTTP " + home.res.status);
rec("  contain 'VigRX'", home.text.includes("VigRX"));

const login = await get("/admin/login");
rec("GET /admin/login (200)", login.res.status === 200, "HTTP " + login.res.status);

const og = await get("/opengraph-image");
rec("GET /opengraph-image (200 image)", og.res.status === 200 && (og.res.headers.get("content-type") || "").startsWith("image"), "HTTP " + og.res.status + " " + (og.res.headers.get("content-type") || "") + (og.err ? " err=" + og.err : ""));

const whGet = await get("/api/webhook");
rec("GET /api/webhook (200)", whGet.res.status === 200, "HTTP " + whGet.res.status);

// ---------- admin WITHOUT auth (harus redirect ke login) ----------
console.log("\n== ADMIN TANPA AUTH (expect 307 -> /admin/login) ==");
for (const p of ["/admin", "/admin/contents", "/admin/sections", "/admin/links", "/admin/templates", "/admin/leads"]) {
  const r = await get(p);
  const loc = r.res.headers.get("location") || "";
  rec(`GET ${p} (307->login)`, r.res.status === 307 && loc.includes("/admin/login"), "HTTP " + r.res.status + " -> " + loc);
}

// ---------- admin WITH auth ----------
console.log("\n== ADMIN DENGAN AUTH ==");
const dash = await get("/admin", { auth: true });
rec("GET /admin (200 Dashboard)", dash.res.status === 200 && dash.text.includes("Dashboard"), "HTTP " + dash.res.status);

const tpl = await get("/admin/templates", { auth: true });
rec("GET /admin/templates (200)", tpl.res.status === 200 && tpl.text.includes("Template Landing Page"), "HTTP " + tpl.res.status);

const leads = await get("/admin/leads", { auth: true });
rec("GET /admin/leads (200 + Export CSV)", leads.res.status === 200 && leads.text.includes("Export CSV"), "HTTP " + leads.res.status);

// list pages + ambil satu id untuk halaman detail
async function checkCrud(base, keyword) {
  const list = await get(`/admin/${base}`, { auth: true });
  rec(`GET /admin/${base} (200)`, list.res.status === 200 && list.text.includes(keyword), "HTTP " + list.res.status);
  const neu = await get(`/admin/${base}/new`, { auth: true });
  rec(`GET /admin/${base}/new (200 form)`, neu.res.status === 200, "HTTP " + neu.res.status);
  const idMatch = list.text.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
  if (idMatch) {
    const det = await get(`/admin/${base}/${idMatch[0]}`, { auth: true });
    rec(`GET /admin/${base}/${idMatch[0]} (200 detail)`, det.res.status === 200, "HTTP " + det.res.status);
  } else {
    rec(`GET /admin/${base}/<id> (punya id?)`, false, "tidak ada uuid di list");
  }
}
await checkCrud("contents", "Contents");
await checkCrud("sections", "Sections");
await checkCrud("links", "Links");

// ---------- API leads ----------
console.log("\n== API ==");
const expNo = await get("/api/leads/export");
rec("GET /api/leads/export tanpa auth (401)", expNo.res.status === 401, "HTTP " + expNo.res.status);

const exp = await get("/api/leads/export", { auth: true });
const ct = exp.res.headers.get("content-type") || "";
rec("GET /api/leads/export dgn auth (200 csv)", exp.res.status === 200 && ct.includes("text/csv"), "HTTP " + exp.res.status + " " + ct);

const leadBefore = (await admin.from("leads").select("*", { count: "exact", head: true })).count;
const lr = await fetch(SITE + "/api/leads", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ name: "Verify Bot", email: "verify@example.com", phone: "08123", source: "verify-site" }),
});
rec("POST /api/leads (200)", lr.status === 200, "HTTP " + lr.status);
const leadAfter = (await admin.from("leads").select("*", { count: "exact", head: true })).count;
rec("  lead tersimpan", leadAfter === leadBefore + 1, `${leadBefore} -> ${leadAfter}`);
// cleanup
await admin.from("leads").delete().eq("email", "verify@example.com");

// ---------- 5 template render ----------
console.log("\n== 5 TEMPLATE RENDER (/ + switch active_template) ==");
const checks = {
  "classic-sales": ["VigRX Plus", "Why Men Choose"],
  "lead-gen": ["Free VigRX Plus", "Experiencing"],
  "modern-review": ["Honest VigRX", "Cons"],
  "long-form": ["60-Day VigRX", "Where It Started"],
  "comparison": ["vs The Rest", "Head to Head"],
};
let allTpl = true;
for (const [tpl, kws] of Object.entries(checks)) {
  await admin.from("site_settings").update({ active_template: tpl }).eq("id", 1);
  await new Promise((r) => setTimeout(r, 400));
  const r = await get("/");
  const miss = kws.filter((k) => !r.text.includes(k));
  const ok = r.res.status === 200 && miss.length === 0;
  if (!ok) allTpl = false;
  rec(`template ${tpl}`, ok, ok ? "" : "missing: " + miss.join(", "));
}
await admin.from("site_settings").update({ active_template: "classic-sales" }).eq("id", 1);

console.log(`\n=== HASIL: ${pass} ok, ${fail} gagal ===`);
if (fail) {
  console.log("DETAIL GAGAL:");
  for (const f of fails) console.log(" - " + f);
  process.exit(1);
} else {
  console.log("✅ SEMUA BERFUNGSI");
}
