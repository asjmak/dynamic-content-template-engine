// Jalankan schema.sql via Supabase Management API (butuh SUPABASE_ACCESS_TOKEN di .env.local)
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

const TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!TOKEN) {
  console.error("✗ SUPABASE_ACCESS_TOKEN tidak ditemukan di .env.local");
  process.exit(1);
}
if (!URL) {
  console.error("✗ NEXT_PUBLIC_SUPABASE_URL tidak ditemukan");
  process.exit(1);
}
const ref = URL.replace("https://", "").split(".")[0];
const sql = fs.readFileSync("supabase/schema.sql", "utf8");

console.log("→ project ref:", ref);

const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query: sql }),
});

const text = await res.text();
console.log("→ HTTP", res.status);
try {
  const json = JSON.parse(text);
  if (Array.isArray(json)) {
    console.log(`✓ ${json.length} statement dijalankan.`);
  } else if (json.error) {
    console.error("✗ Error:", json.error);
    process.exit(1);
  } else {
    console.log("✓ OK:", JSON.stringify(json).slice(0, 300));
  }
} catch {
  console.log(text.slice(0, 500));
}
