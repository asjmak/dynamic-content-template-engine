// Jalankan DDL tabel `pages` via Supabase Management API.
// Butuh SUPABASE_ACCESS_TOKEN + NEXT_PUBLIC_SUPABASE_URL di .env.local
// Jalankan: node scripts/run-pages-schema.mjs
import fs from "node:fs";

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

const DDL = `
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  template TEXT NOT NULL,
  title TEXT,
  meta_description TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pages' AND policyname = 'pages_public_select') THEN
    CREATE POLICY pages_public_select ON pages
      FOR SELECT
      USING (status = 'active');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pages' AND policyname = 'pages_admin_all') THEN
    CREATE POLICY pages_admin_all ON pages
      FOR ALL
      USING (auth.role() = 'authenticated')
      WITH CHECK (auth.role() = 'authenticated');
  END IF;
END$$;

INSERT INTO pages (slug, template, title, meta_description, status)
VALUES ('vigrx-plus', 'vigrx-official', 'VigRX Plus® — Official', 'Clinically studied herbal male vitality supplement.', 'active')
ON CONFLICT (slug) DO NOTHING;
`;

console.log("→ project ref:", ref);

const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query: DDL }),
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
  console.log(text.slice(0, 800));
}

// Simpan juga ke file untuk referensi manual
fs.writeFileSync("supabase/schema_pages.sql", DDL);
console.log("✓ DDL disimpan ke supabase/schema_pages.sql");
