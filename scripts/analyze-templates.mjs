// Analisis produksi: untuk tiap template, ganti active_template, fetch /,
// ekstrak konten & cek isu produksi.
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
const SITE = "http://localhost:3000";
const admin = createClient(URL, SERVICE, { auth: { persistSession: false } });

const TEMPLATES = ["classic-sales", "lead-gen", "modern-review", "long-form", "comparison"];

// kata/indikator Indonesia yang tidak boleh muncul di konten produksi (EN)
const ID_MARKERS = ["mengapa", "manfaat", "testimoni", "penawaran", "klaim", "gratis", "resmi", "ulasan", "cara kerja", "bandingkan", "keuntungan", "masalah", "panduan", "diskon", "garansi"];

function stripTags(html) {
  return html.replace(/<[^>]*>/g, " ");
}
function wordCount(s) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

async function fetchWithRetry(path, tries = 5) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(SITE + path);
      return r;
    } catch {
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
  return null;
}

const report = {};

for (const tpl of TEMPLATES) {
  await admin.from("site_settings").update({ active_template: tpl }).eq("id", 1);
  await new Promise((r) => setTimeout(r, 800)); // tunggu revalidate
  const res = await fetchWithRetry("/");
  const html = res ? await res.text() : "";
  const text = stripTags(html);

  const h1 = (html.match(/<h1[^>]*>([^<]*)<\/h1>/) || [])[1] || "(none)";
  const h2s = [...html.matchAll(/<h2[^>]*>([^<]*)<\/h2>/g)].map((m) => m[1]);
  const imgCount = (html.match(/<img /g) || []).length;
  const ctaCount = (html.match(/class="[^"]*btn/g) || []).length;
  const idHits = ID_MARKERS.filter((w) => text.toLowerCase().includes(w));
  const hasLang = /lang="en/i.test(html);
  const hasFda = /FDA/i.test(html);
  const hasOg = /og:title/i.test(html);

  report[tpl] = {
    status: res ? res.status : "ERR",
    h1,
    sections: h2s.length,
    sectionTitles: h2s,
    wordCount: wordCount(text),
    imgCount,
    ctaCount,
    indonesianMarkers: idHits,
    hasLangEn: hasLang,
    hasFdaDisclaimer: hasFda,
    hasOpenGraph: hasOg,
  };
}

// restore
await admin.from("site_settings").update({ active_template: "classic-sales" }).eq("id", 1);

console.log("\n================ PRODUCTION ANALYSIS ================\n");
for (const [tpl, r] of Object.entries(report)) {
  console.log(`■ ${tpl.toUpperCase()}  [HTTP ${r.status}]`);
  console.log(`   H1: ${r.h1}`);
  console.log(`   Sections: ${r.sections} | Words: ${r.wordCount} | Imgs: ${r.imgCount} | CTAs: ${r.ctaCount}`);
  console.log(`   lang=en: ${r.hasLangEn ? "✓" : "✗"} | FDA disclaimer: ${r.hasFdaDisclaimer ? "✓" : "✗"} | OG tags: ${r.hasOpenGraph ? "✓" : "✗"}`);
  if (r.indonesianMarkers.length) console.log(`   ⚠ Indonesian leftovers: ${r.indonesianMarkers.join(", ")}`);
  console.log("");
}
console.log("====================================================\n");
