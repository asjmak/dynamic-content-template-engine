// Buat user admin Supabase Auth (langsung terkonfirmasi) agar /admin bisa diakses.
// Jalankan: node scripts/create-admin.mjs
// Override email/password via env: ADMIN_EMAIL, ADMIN_PASSWORD
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

const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const email = process.env.ADMIN_EMAIL || "admin@local.dev";
const password = process.env.ADMIN_PASSWORD || "Admin12345!";

// Cek dulu sudah ada?
const { data: existing } = await admin.auth.admin.listUsers();
const found = existing?.users?.find((u) => u.email === email);
if (found) {
  console.log(`ℹ️ User ${email} sudah ada (id: ${found.id}). Tidak dibuat ulang.`);
  process.exit(0);
}

const { data, error } = await admin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: { full_name: "Admin" },
});
if (error) {
  console.error("✗ Gagal membuat user:", error.message);
  process.exit(1);
}
console.log(`✓ Admin dibuat: ${email}  /  password: ${password}`);
console.log("  (Silakan ganti password setelah login, dan revoke SUPABASE_ACCESS_TOKEN.)");
