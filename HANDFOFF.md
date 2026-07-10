# Handoff Document — Dynamic Content Template Engine

> Baca file ini di sesi baru untuk melanjutkan proyek.

---

## Lokasi Proyek
```
C:\Users\cox\ZCodeProject\dynamic-content-template-engine
```

## GitHub
```
https://github.com/asjmak/dynamic-content-template-engine
```
Branch: `main` (default branch di GitHub masih `master` — bisa diubah di Settings)

---

## Tech Stack
- **Frontend:** Next.js 14 (App Router, TypeScript)
- **Database:** Supabase (Postgres) — project ref: `vhdwwvswqgmujffnpisd`
- **Hosting:** Vercel (siap deploy)

---

## Status Database (Sudah Jalan)
- ✅ 5 tabel: `site_settings`, `sections`, `contents`, `links`, `content_links`, `leads`
- ✅ Kolom `template` di `sections`, `active_template` di `site_settings`
- ✅ Block type `lead_form` (untuk form lead capture)
- ✅ RLS: publik SELECT saja, authenticated INSERT/UPDATE/DELETE, service role bypass
- ✅ Seed demo VigRX Plus untuk 5 template

---

## 5 Template Landing Page
Pilih di `/admin/templates`:

| Template | Alur |
|---|---|
| `classic-sales` | Hero → Manfaat → Testimoni → Cara Kerja → Penawaran → FAQ |
| `lead-gen` | Hero → Masalah → Manfaat → **Form Lead** → Testimoni |
| `modern-review` | Rating → Pro/Kontra → Cara Kerja → Statistik → Garansi → FAQ |
| `long-form` | Cerita → Manfaat → Testimoni → Penawaran → FAQ |
| `comparison` | VS → Perbandingan → Verdict → FAQ |

---

## Akun Admin Supabase Auth
- **Email:** `admin@local.dev`
- **Password:** `Admin12345!`
- Login di `/admin`

---

## Environment Variables (`.env.local`)
Isi dari `.env.example` — lihat file tersebut untuk daftar variabel yang dibutuhkan.
Kunci asli hanya ada di `.env.local` (tidak ikut ter-commit).

---

## Script Utilitas (`scripts/`)

| Script | Fungsi | Cara Jalankan |
|---|---|---|
| `run-schema.mjs` | DDL via Management API (butuh PAT baru) | `node scripts/run-schema.mjs` |
| `seed-templates.mjs` | Seed 5 template demo (idempoten) | `node scripts/seed-templates.mjs` |
| `create-admin.mjs` | Buat user admin Supabase Auth | `node scripts/create-admin.mjs` |
| `verify-templates.mjs` | Verifikasi render + lead capture | `VERIFY_SITE=http://localhost:3000 node scripts/verify-templates.mjs` |
| `verify-site.mjs` | Verifikasi MENYELURUH: semua route publik + admin (login otomatis) + API | `node scripts/verify-site.mjs` |
| `external-app-example.mjs` | Contoh client webhook eksternal | `node scripts/external-app-example.mjs` |
| `check-supabase.mjs` | Diagnostic koneksi & tabel | `node scripts/check-supabase.mjs` |

---

## Cara Jalankan

```bash
cd C:\Users\cox\ZCodeProject\dynamic-content-template-engine
npm install       # sudah, tinggal jalankan
npm run dev       # http://localhost:3000
```

---

## Yang Sudah Dikerjakan di Sesi Sebelumnya
- [x] Build aplikasi dari awal (Next.js + Supabase)
- [x] 3 template awal (classic-sales, lead-gen, modern-review)
- [x] Kolom template + active_template + tabel leads
- [x] Form lead capture + API `/api/leads`
- [x] Admin templates + leads viewer
- [x] Responsive CSS (Grid collapse, mobile padding)
- [x] 2 template tambahan (long-form, comparison)
- [x] Perbaiki UUID invalid di seed script
- [x] User admin dibuat
- [x] GitHub repo dibuat & push
- [x] Verifikasi 5 template render + lead capture OK
- [x] Export leads ke CSV (`GET /api/leads/export`, terlindungi auth) + tombol di `/admin/leads`
- [x] **Verifikasi menyeluruh** (`node scripts/verify-site.mjs`) — 32/32 cek lolos: semua route publik + admin (dengan & tanpa auth) + API + 5 template.
- [x] **Bug fix `opengraph-image` di Windows**: `next/og`/`@vercel/og` gagal dimuat di Windows (bug path font `fileURLToPath(join(import.meta.url,...))`). Route sekarang guard `process.platform==="win32"` → fallback SVG; di Linux/Vercel tetap PNG asli via `next/og`. (Jangan jalankan `next build` lalu `next dev` tanpa hapus `.next` — bisa memicu error `clientModules` undefined.)
- [x] **Rewrite konten → Bahasa Inggris (USA) & unik per template** + **visual makeover**. Hero jadi split (teks + gambar + guarantee seal + rating + trust badges), card lebih kaya (icon/stat/testimoni/pro-con/offer), CTA menarik. Seed pakai UUID deterministik per template — memperbaiki bug id konten kembar lintas template (sebelumnya `lead-gen` & `long-form` berbagi id, sehingga saling menimpa).

---

## Catatan Environment (Windows dev)

- `next/og` tidak bisa dipakai di Windows (Next 14.2.x + `@vercel/og` bug path). OG image di lokal = SVG fallback; di Vercel/Linux = PNG asli. Ini wajar, bukan error.
- Selalu hapus folder `.next` sebelum ganti antara `next build` ↔ `next dev` untuk menghindari error `Cannot read properties of undefined (reading 'clientModules')`.

---

## Yang Bisa Dilanjutkan
- [ ] Deploy ke Vercel
- [ ] Ganti password admin Supabase Auth
- [ ] Ubah default branch GitHub ke `main` (via repo Settings → Branches)
- [ ] Tambah HMAC signature untuk webhook (keamanan)
- [x] Export leads ke CSV
- [ ] Test A/B template
- [ ] Multi-slug (banyak landing page sekaligus)
- [ ] Dark mode / tema

---

## Cara Lanjut di Sesi Baru
Di sesi chat baru, cukup kirimkan:
> "Lanjutkan proyek Dynamic Content Template Engine. Baca `HANDFOFF.md` di `C:\Users\cox\ZCodeProject\dynamic-content-template-engine`."