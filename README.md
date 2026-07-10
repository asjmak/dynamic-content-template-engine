# Dynamic Content Template Engine

Website dinamis yang **tampilan (layout) dan isinya dikelola sepenuhnya dari database**.
Cocok untuk landing page affiliate, microsite, atau halaman promosi yang sering berubah —
tanpa perlu deploy ulang setiap kali ganti konten/link.

Tech stack (semua ada **free tier**, biaya Rp 0):
- **Supabase** (Postgres) — database + auth
- **Next.js (App Router)** — SSR + Open Graph dinamis
- **Vercel** — hosting & auto-deploy dari GitHub

---

## Fitur

- **3 entitas database**: `sections` (struktur), `contents` (isi), `links` (link affiliate) + junction `content_links`.
- **Rendering dinamis**: halaman disusun dari DB → Section → Content → Link.
- **Open Graph dinamis**: `generateMetadata` + `opengraph-image.tsx` (thumbnail otomatis) untuk preview WhatsApp/FB/Twitter.
- **Panel Admin** dengan **Supabase Auth** (email/password) untuk CRUD.
- **Webhook eksternal** (`/api/webhook`) + contoh client Node.js, sehingga aplikasi manajemen **lain** bisa mengubah data (termasuk update massal URL via `tracking_id`).

---

## Struktur Project

```
supabase/schema.sql          # skema DB + RLS + seed data
src/lib/
  types.ts                   # tipe TS
  supabase/{client,server,admin}.ts
  guard.ts                   # proteksi halaman admin
  data.ts                    # query untuk template publik
  actions.ts                 # server actions (CRUD admin)
src/lib/blocks/*             # renderer per tipe blok (hero/grid/slider/...)
src/components/*             # BlockRenderer, ContentCard, Navbar, AuthForm
src/app/
  page.tsx                   # template publik (SSR)
  opengraph-image.tsx        # OG image dinamis
  admin/*                    # panel admin (login, dashboard, CRUD)
  api/webhook/route.ts       # endpoint update eksternal
scripts/external-app-example.mjs  # contoh aplikasi manajemen eksternal
```

---

## 1. Setup Supabase (gratis)

1. Buat project di https://supabase.com.
2. Buka **SQL Editor** → jalankan isi file `supabase/schema.sql` (membuat tabel, RLS, dan seed).
3. **Authentication → Users** → tambahkan 1 user (email + password). Inilah admin panel Anda.
4. Di **Project Settings → API** ambil:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (**rahasia, jangan commit**)

---

## 2. Konfigurasi Environment

Salin `.env.example` menjadi `.env.local` dan isi:

```
NEXT_PUBLIC_SUPABASE_URL=https://XXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...
SUPABASE_SERVICE_ROLE_KEY=ey...
WEBHOOK_SECRET=string-acak-yang-kuat
NEXT_PUBLIC_SITE_URL=https://nama.vercel.app
```

---

## 3. Jalankan Lokal

```bash
npm install
npm run dev
```

- Website: http://localhost:3000
- Admin: http://localhost:3000/admin (login dengan user Supabase tadi)

---

## 4. Update via Aplikasi Eksternal (Webhook)

Aplikasi manajemen terpisah dapat mengirim `POST` ke `/api/webhook`:

```bash
# isi WEBHOOK_URL & WEBHOOK_SECRET di environment, lalu:
node scripts/external-app-example.mjs
```

Contoh payload (update massal URL affiliate via `tracking_id`, tanpa ubah konten):

```json
{
  "links": [
    { "tracking_id": "AFF_MAIN", "url": "https://example.com/affiliate-baru", "label": "Affiliate Utama", "is_active": true }
  ]
}
```

Header wajib: `x-webhook-secret: <WEBHOOK_SECRET>`.

---

## 5. Deploy ke Vercel (gratis)

1. Push project ini ke GitHub.
2. Di Vercel: **New Project** → import repo → **Deploy**.
3. Masukkan environment variables (dari langkah 2) di Vercel → Project → Settings → Environment Variables.
4. Selesai — setiap `git push` otomatis deploy.

---

## Tipe Blok (block_type)

| block_type     | Keterangan                              | settings (JSON) contoh |
| -------------- | --------------------------------------- | ---------------------- |
| `hero`         | Judul besar + CTA                       | `{"heading":"","subheading":"","cta_label":""}` |
| `grid`         | Kartu berbentuk grid                    | `{"columns":3}`        |
| `slider`       | Kartu horizontal bisa di-scroll         | `{}`                   |
| `single_column`| Tumpukan vertikal                       | `{}`                   |
| `footer`       | Catatan kaki                           | `{"text":"© 2026 ..."}`|

Setiap `content` menunjuk ke satu `section` dan bisa dihubungkan ke banyak `link`
melalui `content_links`. Tombol CTA pada kartu akan mengarah ke link pertama yang terhubung.

---

## 6. Template Landing Page (pilih di admin)

Sistem dilengkapi **3 template landing page** yang sudah efektif untuk jualan & generate lead.
Setiap template = kumpulan `sections` (dengan `template` = nama template). Halaman depan hanya
menampilkan section dari template yang **aktif** (`site_settings.active_template`).

| Template | Gaya | Alur section |
| -------- | ---- | ------------ |
| `classic-sales` | Jualan langsung | Hero → Manfaat → Testimoni → Cara Kerja → Penawaran → FAQ |
| `lead-gen` | Ambil prospek | Hero → Masalah → Manfaat → **Form Lead** → Testimoni |
| `modern-review` | Review/trust | Hero → Pro/Kontra → Cara Kerja → Statistik → Garansi → FAQ |

**Cara pakai:**
1. Jalankan `scripts/seed-templates.mjs` (mengisi konten demo — lihat langkah 7) **setelah** `schema.sql` dijalankan.
2. Buka `/admin/templates` → klik **Gunakan** pada template pilihan.
3. Halaman depan (`/`) langsung berubah.

### Block `lead_form` (capture lead)
Template `lead-gen` memakai block `lead_form` yang menampilkan form Nama/Email/WA.
Submit mengirim ke `POST /api/leads` (disimpan ke tabel `leads` via service role).
Jika `settings.redirect_url` diisi, pengunjung diarahkan ke link affiliate setelah submit.
Prospek tertangkap bisa dilihat di `/admin/leads`.

---

## 7. Seed konten demo (VigRX Plus)

Isi `.env.local` dulu, lalu jalankan:

```bash
node scripts/seed-templates.mjs
```

Script ini (idempoten) mengisi 3 template dengan konten demo produk **VigRX Plus**
(heading, manfaat, testimoni, FAQ, link affiliate, dll). Jalankan ulang kapan saja
untuk me-reset ke demo.

> Catatan: `schema.sql` sudah diperbarui dengan kolom `template` (sections),
> `active_template` (site_settings), tabel `leads`, dan block `lead_form`.
> **Jalankan ulang `schema.sql` di SQL Editor** setelah menarik update ini.

