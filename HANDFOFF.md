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

## Sesi 2026-07-10 (Lanjutan: Produksi & Makeover)

**Tugas yang diselesaikan:**
1. **Stop & restart local web server** — hentikan proses lama di port 3000 (PID 10516), lalu `npm run dev` instance bersih di `http://localhost:3000` (background).
2. **Analisis produksi 5 template** (script baru `scripts/analyze-templates.mjs`) — semua render HTTP 200, 100% Bahasa Inggris, `lang="en-US"`, disclaimer FDA ada, OG tags ada.
3. **Fix `lang` & metadata** — `src/app/layout.tsx`: `lang="id"` → `lang="en-US"`; title/description/OG/Twitter diubah ke Inggris (tadinya deskripsi masih "Website dinamis...").
4. **Visual makeover penuh** — `src/app/globals.css` ditulis ulang: palet gradient (indigo→violet), shadow tokens, hero dengan radial overlay + hover, badge glassmorphism, card dengan top-border animasi + hover lift, stat gradient text, quote mark dekoratif, button gradient + shadow, smooth scroll, selection highlight, responsif diperkuat.
5. **English content overhaul** — `scripts/seed-templates.mjs` disempurnakan (heading/CTA/subcopy lebih konversi-oriented, contoh "double-blind study, 62%/71%"), lalu dijalankan (`node scripts/seed-templates.mjs`). Semua 5 template sekarang EN murni, unik per template.
6. **Production hardening:**
   - `next.config.mjs`: tambah **security headers** (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, X-XSS-Protection, Permissions-Policy, Content-Security-Policy).
   - `src/app/robots.ts` (baru) — allow `/`, disallow `/admin/` & `/api/`, sitemap.
   - `src/app/sitemap.ts` (baru) — sitemap.xml.
   - `src/lib/blocks/Hero.tsx` & `src/components/ContentCard.tsx`: `<img>` → **`next/image`** (optimasi gambar/LCP, `priority` di hero).

**File yang diubah:** `src/app/layout.tsx`, `src/app/globals.css`, `scripts/seed-templates.mjs`, `next.config.mjs`, `src/lib/blocks/Hero.tsx`, `src/components/ContentCard.tsx`, + baru `src/app/robots.ts`, `src/app/sitemap.ts`, `scripts/analyze-templates.mjs`.

**Verdict produksi:** Web app **LAYAK** untuk produksi dari sisi struktur/konten/SEO dasar, tapi ada beberapa hal wajib sebelum live (lihat "Yang Bisa Dilanjutkan" baru di bawah).

**Catatan error yang diperbaiki:** `globals.css` sempat error `Unclosed string` di `.quote::before { content: """; }` → diperbaiki jadi `content: "\201C";`.

**Bug fix lanjutan (button tidak terlihat):** Ditemukan 2 akar masalah yang membuat button (termasuk hero & seluruh CTA) tidak punya background → teks putih di atas putih = tidak terlihat:
1. **Nama variabel CSS tidak cocok** — di `:root` didefinisikan `--primary-gradient` (kebab), tapi seluruh rule memanggil `var(--primaryGradient)` (camelCase) → `var(--primaryGradient)` undefined. Diperbaiki dengan menyamakan ke `--primaryGradient` (termasuk `.hero { background }` di baris 62 yang sempat terlewat).
2. **Data link DB masih Indonesia & URL salah** — link `aaaaaaaa…` berlabel "Affiliate Utama" / `example.com/affiliate` (data lama). Seed `links` upsert **gagal diam-diam** karena bentrok constraint `UNIQUE(tracking_id)` dengan row orphan `cccccccc…` ("VigRX Official"). Solusi: hapus orphan `cccccccc…`, lalu link jadi "VigRX Official" / "VigRX Discount" → `example.com/vigrx-plus`. Seed `scripts/seed-templates.mjs` kini membersihkan orphan link dulu sebelum upsert agar tidak gagal lagi.
3. **Visibilitas button ditingkatkan** — `.card-cta` diubah jadi **lebar penuh** + `::after` panah `→` + hover geser. 3 kartu "Why VigRX Plus® Stands Out" (classic-sales) diberi `cta_text: "Get VigRX Plus®"` (sebelumnya memakai label link berulang).

**File berubah (fix ini):** `src/app/globals.css` (var rename + `.card-cta`), `scripts/seed-templates.mjs` (orphan cleanup + cta_text), DB `links` (diperbaiki via script).

**Overhaul template Lead Generation (marketing):** Template ini tadinya kurang efektif menangkap lead — CTA hero malah mengirim ke affiliate (membocorkan pengunjung), form terkubur, tanpa urgency/trust/FAQ. Perbaikan:
- **Hero CTA kini scroll ke form** (`#lead-form`), bukan ke affiliate. Tambah link anchor `scroll` (`#lead-form`) di DB + `LINKS.scroll` di seed (masuk `KEEP` orphan-cleanup). `Hero.tsx` diubah agar link ber-awalan `#`/`/` tidak membuka tab baru.
- **Section baru "What's Inside Your Free Guide"** (grid 2 kolom) — bangun *value & curiosity* dengan deliverable konkret (7-Day Protocol, 3 Ingredients, Discount Code, Avoid Counterfeits).
- **Lead form** (`lead_form`): tambah `settings.anchor` → `<section id>` (target scroll), `urgency` (badge "Discount slots limited"), `trust` (3 badge: Privacy/Free/Instant), dan privacy note "🔒 We never share your email" di bawah tombol. Diperkuat di `LeadForm.tsx` + CSS `.lead-urgency/.form-trust/.lead-trust/.lead-trust-badge`.
- **Testimoni** dirombak jadi lebih spesifik & outcome-oriented (3 testimoni).
- **Section baru "Frequently Asked Questions"** — tangani keberatan (gratis?, spam?, cepat?, legit?).
- Urutan section: Hero → What's Inside → Problem → Benefits → FORM → Testimonials → FAQ → Footer.
- Setelah submit, `redirect_url` ke affiliate (lead tertangkap dulu, baru diarahkan) — alur lead-gen yang benar.
- Verifikasi: HTTP 200, hero CTA → `#lead-form`, urgency/trust badges/privacy note muncul, `POST /api/leads` OK.

**File berubah (lead-gen):** `src/lib/blocks/Hero.tsx`, `src/lib/blocks/LeadForm.tsx`, `src/app/globals.css` (lead-form styles), `scripts/seed-templates.mjs` (lead-gen rewrite + LINKS.scroll + KEEP).

**SEO improvements (P0 + P1):**
- **`.env.local` / `.env.example`**: `NEXT_PUBLIC_SITE_URL` diisi placeholder `https://your-domain.vercel.app` → memperbaiki kebocoran URL `localhost` pada `metadataBase` (canonical/og:url/sitemap). **Wajib ganti dengan domain Vercel asli saat deploy** (atau set di Environment Variables Vercel).
- **`src/app/layout.tsx`**: tambah `alternates.canonical: "/"` + `robots: { index: true, follow: true }` + `openGraph.url: "/"`.
- **`src/app/page.tsx`**:
  - `export const dynamic="force-dynamic"` → **`export const revalidate = 300`** (ISR): halaman di-cache 5 menit, TTFB & Core Web Vitals membaik. Admin edit memicu `revalidatePath("/")` (sudah ada di `actions.ts`) sehingga konten tetap segar. Catatan: bila seed dijalankan langsung di produksi, butuh hingga 5 menit atau trigger revalidate agar tampil.
  - `generateMetadata`: tambah `alternates.canonical`, `robots`, dan `og:url` absolut (dari `settings.site_url || NEXT_PUBLIC_SITE_URL`).
  - Tambah **JSON-LD `Product` + `Offer`** (`<script type="application/ld+json">`) untuk rich results. `name` "VigRX Plus", `offers.url` diambil dari link afiliasi http(s) pertama di konten (bukan anchor `#lead-form`). `AggregateRating` **sengaja tidak disertakan** karena rating masih demo — jangan fabrikasi (melanggar kebijakan Google).
- Verifikasi: canonical/og:url = domain terkonfigurasi (bukan localhost), meta robots `index,follow`, JSON-LD valid di lead-gen/classic-sales/modern-review (HTTP 200).

**File berubah (SEO):** `src/app/layout.tsx`, `src/app/page.tsx`, `.env.local`, `.env.example`.

**Komponen compliance iklan (Meta/Google Ads):** Template lead-gen & lainnya masih kurang komponen wajib agar bisa diterima iklan berbayar. Yang bisa dikerjakan sekarang (tanpa migrasi DB):
- **Halaman Privacy Policy** (`src/app/privacy/page.tsx`) + **Terms of Service** (`src/app/terms/page.tsx`) — konten default (template) di file, bisa diedit lawyer. Masing-masing punya `metadata` (title, canonical `/privacy`·`/terms`, robots index/follow). Dibungkus `src/components/LegalPage.tsx` (back-link + style `.legal`).
- **Cookie consent banner** (`src/components/CookieConsent.tsx`, client) — muncul jika belum ada `localStorage["cookie-consent"]`; tombol Accept/Decline menyimpan pilihan. Dipasang di `src/app/layout.tsx` (dalam `<body>`). Analytics/pihak-3 sebaiknya dimuat hanya setelah "Accept" (TODO di komponen).
- **Footer diperkaya** (`src/lib/blocks/Footer.tsx`) — tambah baris link `Privacy Policy` / `Terms of Service` + identitas bisnis (`BUSINESS` konstanta: name/email/address, **wajib ganti ke data ASLI**). Berlaku untuk semua template (footer ada di tiap template).
- Style: `.legal*`, `.footer-legal`, `.footer-biz`, `.cookie-banner*` di `globals.css`.
- Verifikasi: `/`, `/privacy`, `/terms` → HTTP 200; footer menampilkan link legal + bisnis; canonical `/privacy` & `/terms` absolut; tanpa error kompilasi.

**Catatan penting (belum bisa diselesaikan di engine, perlu manusia/legal):**
- Konten privacy/terms masih **template** → ganti dengan teks legal ASLI + identitas bisnis nyata.
- Testimoni masih **fiksi** → FTC mewajibkan testimoni asli & terbukti sebelum iklan berbayar.
- Kategori *male enhancement* **terbatas** di Meta & Google Ads → bisa butuh sertifikat healthcare / dokumentasi; risiko ditolak meski komponen lengkap.
- Klaim kesehatan di copy perlu audit (hindari klaim obat); FDA disclaimer sudah ada & dipertahankan.

**File berubah (compliance):** `src/app/privacy/page.tsx` (baru), `src/app/terms/page.tsx` (baru), `src/components/LegalPage.tsx` (baru), `src/components/CookieConsent.tsx` (baru), `src/lib/blocks/Footer.tsx`, `src/app/layout.tsx`, `src/app/globals.css`.

**Marketing overhaul — 4 template lainnya** (classic-sales, modern-review, long-form, comparison): setara dengan lead-gen, terapkan via `scripts/seed-templates.mjs`:
- **Urgency** (`⏳ For a limited time…`) pada tiap section offer/CTA (classic-sales "Limited-Time Offer", modern-review "Guarantee & Where to Buy", long-form "Your Turn", comparison "The Verdict").
- **Testimoni diperkuat** (outcome spesifik) untuk classic-sales & long-form; **modern-review dapat section testimonials baru** ("What Buyers Are Saying", slider) — sebelumnya tidak punya.
- **FAQ diperluas** (penanganan keberatan): modern-review 2→4 (tambah "How fast will I see results?", "Is it FDA approved?"), long-form 2→3, comparison 1→3 (tambah "Is VigRX Plus® safe?", "How fast will I see results?"). classic-sales sudah 3.
- Verifikasi: ke-5 template HTTP 200, `lang=en`, urgency/FAQ/testimoni muncul. Catatan: testimoni masih **fiksi** (template) — ganti dengan asli sebelum iklan berbayar (aturan FTC).

**File berubah:** `scripts/seed-templates.mjs` (4 template di atas).

---

## Catatan Environment (Windows dev)

- `next/og` tidak bisa dipakai di Windows (Next 14.2.x + `@vercel/og` bug path). OG image di lokal = SVG fallback; di Vercel/Linux = PNG asli. Ini wajar, bukan error.
- Selalu hapus folder `.next` sebelum ganti antara `next build` ↔ `next dev` untuk menghindari error `Cannot read properties of undefined (reading 'clientModules')`.

---

## Yang Bisa Dilanjutkan
- [ ] **Deploy ke Vercel** (production readiness utama)
- [ ] **Ganti password admin Supabase Auth** (`admin@local.dev` / `Admin12345!` — jangan dipakai di produksi)
- [ ] **Ganti link afiliasi placeholder** (`https://example.com/vigrx-plus` → URL afiliasi asli) di `scripts/seed-templates.mjs` (LINKS) lalu re-seed
- [ ] **Tambah HMAC signature untuk webhook** (`/api/webhook`) — keamanan
- [ ] **Pasang analytics** (GA4 / Plausible) untuk ukur konversi & lead
- [ ] **Tambah canonical URL + hreflang** (saat multi-bahasa)
- [ ] Test A/B template
- [ ] Multi-slug (banyak landing page sekaligus)
- [ ] Dark mode / tema
- [x] Export leads ke CSV
- [x] Security headers + robots.txt + sitemap.xml
- [x] Optimasi gambar (`next/image`)

### Rekomendasi Produksi (ringkasan analisis 2026-07-10)
- ✅ **Sudah layak**: 5 template render EN murni, `lang=en-US`, disclaimer FDA, OG/Twitter tags, lead capture `POST /api/leads` OK, responsif, security headers & SEO dasar (robots/sitemap) sudah ada.
- ⚠️ **Wajib sebelum live**: (1) ganti password admin, (2) ganti URL afiliasi placeholder, (3) deploy via Vercel (HTTPS otomatis), (4) HMAC webhook.
- 💡 **Nice-to-have**: analytics, canonical/hreflang, A/B test, multi-slug, dark mode, tambah lebih banyak testimoni/stat agar konten makin meyakinkan.

---

## Cara Lanjut di Sesi Baru
Di sesi chat baru, cukup kirimkan:
> "Lanjutkan proyek Dynamic Content Template Engine. Baca `HANDFOFF.md` di `C:\Users\cox\ZCodeProject\dynamic-content-template-engine`."