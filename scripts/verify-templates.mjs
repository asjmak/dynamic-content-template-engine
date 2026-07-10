// Verifikasi render tiap template + capture lead (butuh dev server jalan di port VERIFY_SITE)
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
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SITE = process.env.VERIFY_SITE || "http://localhost:3000";
const admin = createClient(URL, SERVICE, { auth: { persistSession: false } });

const checks = {
  "classic-sales": ["VigRX Plus™", "Mengapa VigRX Plus?"],
  "lead-gen": ["Klaim Diskon Eksklusif", "Dapatkan Panduan Gratis"],
  "modern-review": ["Review Jujur VigRX Plus™", "Kontra"],
  "long-form": ["Cerita di Balik VigRX Plus™", "Manfaat Nyata"],
  "comparison": ["VigRX Plus™ vs Lainnya", "Pemenangnya Jelas"],
};

async function fetchWithRetry(path, tries = 4) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(SITE + path);
      return r;
    } catch {
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
  return null;
}

let allOk = true;
for (const [tpl, keywords] of Object.entries(checks)) {
  await admin.from("site_settings").update({ active_template: tpl }).eq("id", 1);
  const res = await fetchWithRetry("/");
  const html = res ? await res.text() : "";
  const missing = keywords.filter((k) => !html.includes(k));
  const ok = res && res.status === 200 && missing.length === 0;
  if (!ok) allOk = false;
  console.log(
    `[${tpl}] HTTP ${res ? res.status : "ERR"} -> ${ok ? "OK ✓" : "MISSING: " + missing.join(", ")}`
  );
}

// Admin route reachable (gated -> 307 to login)
const login = await fetchWithRetry("/admin/login");
console.log(`[/admin/login] HTTP ${login ? login.status : "ERR"} (200=form login)`);
const adminRoot = await fetchWithRetry("/admin");
console.log(`[/admin] HTTP ${adminRoot ? adminRoot.status : "ERR"} (307=redirect ke login, wajar)`);

// Capture lead
const before = (await admin.from("leads").select("*", { count: "exact", head: true })).count;
const lr = await fetch(SITE + "/api/leads", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ name: "Test Lead", email: "test@example.com", phone: "08123", source: "verify" }),
});
const after = (await admin.from("leads").select("*", { count: "exact", head: true })).count;
console.log(`POST /api/leads => ${lr.status}; leads ${before} -> ${after}`);

// Reset state agar rapi
await admin.from("site_settings").update({ active_template: "classic-sales" }).eq("id", 1);
await admin.from("leads").delete().gte("created_at", "2000-01-01");

console.log(allOk && lr.status === 200 ? "\n✅ SEMUA TEMPLATE OK" : "\n⚠️ ada yang perlu dicek");
