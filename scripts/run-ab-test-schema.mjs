// Jalankan DDL A/B test via Supabase Management API.
// Butuh SUPABASE_ACCESS_TOKEN + NEXT_PUBLIC_SUPABASE_URL di .env.local
// Jalankan: node scripts/run-ab-test-schema.mjs
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
CREATE TABLE IF NOT EXISTS ab_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  template TEXT NOT NULL,
  section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  content_a_id UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
  content_b_id UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'ab_tests' AND policyname = 'ab_tests_admin_all'
  ) THEN
    CREATE POLICY ab_tests_admin_all ON ab_tests
      USING (auth.role() = 'authenticated')
      WITH CHECK (auth.role() = 'authenticated');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'ab_test_id'
  ) THEN
    ALTER TABLE leads ADD COLUMN ab_test_id UUID REFERENCES ab_tests(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'ab_variant'
  ) THEN
    ALTER TABLE leads ADD COLUMN ab_variant TEXT;
  END IF;
END$$;
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
fs.writeFileSync("supabase/schema_ab_tests.sql", DDL);
console.log("✓ DDL disimpan ke supabase/schema_ab_tests.sql");
