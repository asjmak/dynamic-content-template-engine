// =====================================================================
//  Diagnostic Supabase — jalankan:  node scripts/check-supabase.mjs
//
//  Membaca kredensial dari .env / .env.local (jangan commit file itu!).
//  Tanpa service role: hanya cek baca (tables, jumlah & sample data).
//  Dengan service role: bisa juga cek status RLS tiap tabel.
// =====================================================================
import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  const txt = fs.readFileSync(file, "utf8");
  for (const line of txt.split("\n")) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let val = m[2].trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    )
      val = val.slice(1, -1);
    if (!(m[1] in process.env)) process.env[m[1]] = val;
  }
}
loadEnv(".env");
loadEnv(".env.local");

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !ANON) {
  console.error(
    "✗ Kredensial kurang. Isi NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local"
  );
  process.exit(1);
}

const anon = createClient(URL, ANON, { auth: { persistSession: false } });
const admin = SERVICE
  ? createClient(URL, SERVICE, { auth: { persistSession: false } })
  : null;

const TABLES = ["site_settings", "sections", "contents", "links", "content_links"];

async function main() {
  console.log("→ URL :", URL);
  console.log("→ Mode:", admin ? "anon + service_role" : "anon saja");

  // 1) Tes koneksi
  const { data: conn, error: connErr } = await anon
    .from("site_settings")
    .select("id")
    .limit(1);
  if (connErr && connErr.code === "42P01") {
    console.log("\n✗ Tabel belum ada. Jalankan supabase/schema.sql di SQL Editor Supabase.");
    return;
  }
  if (connErr) {
    console.log("\n✗ Gagal koneksi:", connErr.message);
    return;
  }
  console.log("✓ Koneksi berhasil.");

  // 2) Cek tiap tabel: ada/tidak + jumlah baris
  console.log("\n=== Tabel & jumlah baris ===");
  for (const t of TABLES) {
    const { count, error } = await anon
      .from(t)
      .select("*", { count: "exact", head: true });
    if (error && error.code === "42P01") {
      console.log(`  ${t.padEnd(16)} : TIDAK ADA`);
    } else if (error) {
      console.log(`  ${t.padEnd(16)} : error ${error.message}`);
    } else {
      console.log(`  ${t.padEnd(16)} : ${count} baris`);
    }
  }

  // 3) Sample data (section + konten + link)
  console.log("\n=== Sample: sections ===");
  const { data: secs } = await anon
    .from("sections")
    .select("id, block_type, title, ordering, is_active")
    .order("ordering");
  console.table(secs ?? []);

  console.log("=== Sample: contents ===");
  const { data: conts } = await anon
    .from("contents")
    .select("id, section_id, title, ordering, is_active")
    .order("ordering");
  console.table(conts ?? []);

  console.log("=== Sample: links ===");
  const { data: lks } = await anon.from("links").select("id, label, url, tracking_id");
  console.table(lks ?? []);

  // 4) Verifikasi RLS via anon: publik boleh baca, tapi TIDAK boleh tulis
  console.log("\n=== Row Level Security (tes via anon) ===");
  const { error: readErr } = await anon.from("sections").select("id").limit(1);
  console.log(
    `  baca  (anon select) : ${readErr ? "GAGAL - " + readErr.message : "diizinkan (publik) ✓"}`
  );

  const { error: writeErr } = await anon
    .from("sections")
    .insert({ block_type: "grid", title: "RLS_TEST", ordering: 999 });
  if (writeErr) {
    console.log(`  tulis (anon insert) : ditolak ✓ (${writeErr.code || "blocked"})`);
  } else {
    console.log(
      "  tulis (anon insert) : TERBUKA ✗  -> nyalakan RLS & tambahkan policy auth write"
    );
    await anon.from("sections").delete().eq("title", "RLS_TEST");
  }
  if (!admin) {
    console.log("  (Isi SUPABASE_SERVICE_ROLE_KEY untuk cek lebih dalam di dashboard.)");
  }

  console.log("\nSelesai.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
