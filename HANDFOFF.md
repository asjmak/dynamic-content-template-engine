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
- ✅ 7 tabel: `site_settings`, `sections`, `contents`, `links`, `content_links`, `leads`, `ab_tests`
- ✅ Kolom `template` di `sections`, `active_template` di `site_settings`
- ✅ Block type `lead_form` (untuk form lead capture)
- ✅ RLS: publik SELECT saja, authenticated INSERT/UPDATE/DELETE, service role bypass
- ✅ Seed demo VigRX Plus untuk 5 template

---

## 🧪 A/B Test Variasi Copy (Lightweight)
Admin bisa menguji variasi heading/body/CTA dari satu content item dengan traffic split 50/50 otomatis.

### Cara Kerja
1. Admin membuat **A/B Test** via `/admin/ab-tests/new` → pilih `template` → pilih `section` → pilih `Content A` (kontrol) & `Content B` (variasi).
2. Traffic split **server-side** via cookie `ab-variant` (JSON `{testId: "A|B"}`), max-age 30 hari.
3. Saat lead submit form, `ab_test_id` & `ab_variant` tersimpan di tabel `leads`.
4. Dashboard `/admin/ab-tests` menampilkan statistik lead per varian (A vs B).

### Arsitektur
- `page.tsx` (`src/app/page.tsx`): baca cookie → assign variant baru (random 50/50) → panggil `getPageData(abMap)` → render sections yang sudah swap.
- `getPageData`: menerima `abVariant?: Record<string,"A"|"B">` → query `ab_tests` aktif → cari index `content_a_id` → ganti dengan `content_b_id` kalau variant B.
- `src/app/api/leads/route.ts`: parse cookie → cari `ab_test` aktif dengan section_id=source → simpan `ab_test_id` + `ab_variant` saat insert lead.

### Script & File Baru
| File | Fungsi |
|---|---|
| `scripts/run-ab-test-schema.mjs` | Migration DDL tabel `ab_tests` + kolom leads |
| `src/lib/types.ts` | Type `AbTest` |
| `src/lib/data.ts` | `getPageData(abVariant)` + `getActiveAbTests()` |
| `src/app/page.tsx` | Server-side cookie split + AbVariantSetter inline script |
| `src/app/api/leads/route.ts` | Simpan `ab_test_id` & `ab_variant` di lead |
| `src/lib/actions.ts` | `upsertAbTest`, `deleteAbTest`, `toggleAbTest` |
| `src/app/admin/ab-tests/page.tsx` | List A/B tests + statistik lead per varian |
| `src/app/admin/ab-tests/new/page.tsx` | Form create A/B test |
| `src/app/admin/ab-tests/new/AbTestForm.tsx` | Form component (server) |
| `src/app/admin/page.tsx` | Card "A/B Tests" di dashboard admin |

### Limitasi
- Hanya bisa swap **1 content item** per test (konsep lightweight).
- Untuk test multi-content bersamaan, admin bisa buat beberapa A/B test aktif sekaligus.
- Tidak ada tracking impressions/pageviews — hanya **lead capture** (conversion events). Untuk full funnel analytics perlu analytics eksternal (GA4/Plausible).

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
| `run-ab-test-schema.mjs` | Migration DDL untuk A/B test (tabel `ab_tests` + kolom leads) | `node scripts/run-ab-test-schema.mjs` |
| `run-pages-schema.mjs` | Migration tabel `pages` (multi-slug) + RLS + seed demo `vigrx-plus` | `node scripts/run-pages-schema.mjs` |
| `run-palette-schema.mjs` | Migration kolom `palette` (warna) di `pages` & `site_settings` | `node scripts/run-palette-schema.mjs` |

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

**Dark Mode (toggle tema):** Tambahan fitur theme switcher (light / dark / system):
- **CSS variables** di `src/app/globals.css`: semua warna diubah ke token `--bg`, `--surface`, `--ink`, `--muted`, `--border`, dst. Blok `[data-theme="dark"]` override token tersebut ke palet gelap.
- **Inline init script** di `src/app/layout.tsx` (via `next/script` `beforeInteractive`): baca `localStorage.theme` (default `system`) → set `data-theme` di `<html>` SEBELUM paint → mencegah flash white (FOUC).
- **`src/components/ThemeToggle.tsx`** (client): tombol floating bottom-right, siklus `light → dark → system → light`. Simpan pilihan di `localStorage.theme`, listen `prefers-color-scheme` kalau mode `system`.
- **`src/app/admin/layout.tsx`**: juga render `<ThemeToggle />`.
- **Style `.theme-toggle`** di `globals.css` (floating, responsive: label disembunyikan di mobile).
- Override dark sudah ditambah untuk: section genap, card (quote/pro/con/offer/problem), table, form input focus, hero-img, legal-note, lead-urgency, lead-trust-badge, template-filter select, guarantee-seal.

**File berubah (dark mode):** `src/app/globals.css`, `src/app/layout.tsx`, `src/components/ThemeToggle.tsx` (baru), `src/app/admin/layout.tsx`.

**Marketing overhaul — 4 template lainnya** (classic-sales, modern-review, long-form, comparison): setara dengan lead-gen, terapkan via `scripts/seed-templates.mjs`:
- **Urgency** (`⏳ For a limited time…`) pada tiap section offer/CTA (classic-sales "Limited-Time Offer", modern-review "Guarantee & Where to Buy", long-form "Your Turn", comparison "The Verdict").
- **Testimoni diperkuat** (outcome spesifik) untuk classic-sales & long-form; **modern-review dapat section testimonials baru** ("What Buyers Are Saying", slider) — sebelumnya tidak punya.
- **FAQ diperluas** (penanganan keberatan): modern-review 2→4 (tambah "How fast will I see results?", "Is it FDA approved?"), long-form 2→3, comparison 1→3 (tambah "Is VigRX Plus® safe?", "How fast will I see results?"). classic-sales sudah 3.
- Verifikasi: ke-5 template HTTP 200, `lang=en`, urgency/FAQ/testimoni muncul. Catatan: testimoni masih **fiksi** (template) — ganti dengan asli sebelum iklan berbayar (aturan FTC).

**File berubah:** `scripts/seed-templates.mjs` (4 template di atas).

---

## Sesi 2026-07-11 (Admin UX + Multi-Slug + Palette Warna)

Tiga penyempurnaan admin & rendering, semua tanpa mengubah struktur data section/content (tetap diikat `template`).

### 1. Grouped Content per Section (admin)
- `src/app/admin/contents/page.tsx` dirombak: saat 1 `template` dipilih (`?template=...`), konten dikelompokkan di bawah header **Section** (mengikuti urutan halaman: Hero → … → Footer) via `<details>` collapsible.
- Tiap section: chip `block_type`, dot aktif, tombol **Edit section** + **＋ Add** (langsung prefill `?section=<id>` di form new content).
- Reorder ↑/↓ per section: `src/components/ContentReorder.tsx` (client) + action `reorderContent` di `actions.ts` (tukar & nomori ulang `ordering` dalam section, lalu `router.refresh()`).
- `src/app/admin/contents/new/page.tsx` + `ContentForm.tsx`: terima `?section=` → select section ter-pilih.
- CSS: `.section-group`, `.section-head`, `.block-chip`, `.reorder-btn`, `.count-link`, `.section-cell-title` (+ dark mode).
- Tab **Sections** juga dirapihkan: kolom `Type`+`Title` digabung jadi satu kolom "Section" (chip), dan ditambah **kolom "Contents"** berisi jumlah content per section (link ke grouped view).

### 2. Multi-Slug (banyak landing page sekaligus)
- Tabel baru `pages` (slug unik, template, title, meta_description, status, **palette**). RLS: publik hanya SELECT `status='active'`; admin ALL.
- Route publik `src/app/[slug]/page.tsx`: render sections+contents template yang dirujuk, metadata per-slug (canonical/og:url=/slug), JSON-LD, A/B split, `?preview=1` untuk admin melihat draft (RLS mengamankan).
- `src/lib/data.ts`: `getPageData(template?)` & `getActiveAbTests(template?)` diparameteri; tambah `getPageBySlug`. Helper A/B diekstrak ke `src/lib/ab.ts`.
- Admin **Pages** CRUD: `src/app/admin/pages/{page,new,[id],PageForm}.tsx` + link di `Navbar.tsx`.
- `src/app/sitemap.ts`: sertakan URL slug aktif. Homepage `/` tetap pakai `site_settings.active_template`.
- Migration: `supabase/schema_pages.sql` + `scripts/run-pages-schema.mjs` (seed demo `vigrx-plus` → `vigrx-official`).

### 3. Palette Warna (template bisa ganti nada warna)
- Kolom `palette` di `pages` & `site_settings` (default `red`). Migration: `supabase/schema_palette.sql` + `scripts/run-palette-schema.mjs`.
- `data-palette` dipasang di `<main>` (homepage dari `site_settings.palette`, `/[slug]` dari `page.palette`) → memisahkan **warna** dari **template**.
- 4 preset: `red` (gaya vigrx lama), `green` (hijau tua), `blue`, `violet` — blok `[data-palette=...]` di `globals.css` (+ varian dark mode per palette).
- `vigrx-official` di-refactor: warna merah/emas hardcode (`--maroon`/`--red-dark`) diganti variable palette agar bisa berganti warna.
- Admin: dropdown **Color Palette** di form Pages + form **Default Color Palette** (global) di admin Templates (`setDefaultPalette`).

**Status:** semua render & verifikasi lolos (`verify-site.mjs` 34/34, + cek slug/404/preview/draft-RLS/palette). **Belum di-commit** (termasuk fitur sesi sebelumnya: dark mode, A/B test).

**File baru:** `src/app/[slug]/page.tsx`, `src/lib/ab.ts`, `src/components/ContentReorder.tsx`, `src/app/admin/pages/{page,new/[id],PageForm}.tsx`, `supabase/schema_pages.sql`, `supabase/schema_palette.sql`, `scripts/run-pages-schema.mjs`, `scripts/run-palette-schema.mjs`.
**File berubah:** `src/app/admin/contents/page.tsx`, `src/app/admin/contents/new/page.tsx`, `src/app/admin/contents/ContentForm.tsx`, `src/app/admin/sections/page.tsx`, `src/lib/data.ts`, `src/lib/types.ts`, `src/lib/templates.ts`, `src/lib/actions.ts`, `src/app/page.tsx`, `src/app/[slug]/page.tsx`, `src/app/sitemap.ts`, `src/components/Navbar.tsx`, `src/app/admin/templates/page.tsx`, `src/app/globals.css`.

---

## Catatan Environment (Windows dev)

- `next/og` tidak bisa dipakai di Windows (Next 14.2.x + `@vercel/og` bug path). OG image di lokal = SVG fallback; di Vercel/Linux = PNG asli. Ini wajar, bukan error.
- Selalu hapus folder `.next` sebelum ganti antara `next build` ↔ `next dev` untuk menghindari error `Cannot read properties of undefined (reading 'clientModules')`.

---

## Yang Bisa Dilanjutkan
- [x] **Grouped Content per Section** (admin) — kelompokkan konten di bawah header section + reorder ↑/↓ + prefill section
- [x] **Kolom "Contents" di tab Sections** — jumlah content per section (link ke grouped view)
- [x] **Multi-Slug** — banyak landing page sekaligus (`/slug` → template), admin Pages CRUD, sitemap
- [x] **Palette Warna** — template bisa ganti nada (red/green/blue/violet) per page + default global
- [x] **Dark Mode toggle** — theme switcher (light/dark/system), `data-theme` + CSS variables, tanpa FOUC
- [x] **A/B Test Variasi Copy (Lightweight)** — server-side split, lead tracking per variant
- [x] Export leads ke CSV
- [x] Security headers + robots.txt + sitemap.xml
- [x] Optimasi gambar (`next/image`)
- [ ] **Commit + push** semua perubahan (masih di working tree — lihat Catatan di bawah)
- [ ] **Deploy ke Vercel** (production readiness utama)
- [ ] **Ganti password admin Supabase Auth** (`admin@local.dev` / `Admin12345!` — jangan dipakai di produksi)
- [ ] **Ganti link afiliasi placeholder** (`https://example.com/vigrx-plus` → URL afiliasi asli) di `scripts/seed-templates.mjs` (LINKS) lalu re-seed
- [ ] **Tambah HMAC signature untuk webhook** (`/api/webhook`) — keamanan
- [ ] **Pasang analytics** (GA4 / Plausible) untuk ukur konversi & lead
- [ ] **Tambah canonical URL + hreflang** (saat multi-bahasa)
- [ ] Test A/B template (end-to-end)

### Rekomendasi Produksi (update 2026-07-11)
- ✅ **Sudah lengkap secara fitur**: 5 template EN murni, `lang=en-US`, disclaimer FDA, OG/Twitter tags, lead capture `POST /api/leads` OK, responsif, security headers, robots/sitemap, **dark mode**, **A/B test**, **multi-slug** (banyak URL), **palette warna**, **grouped content admin + reorder ↑/↓**.
- ⚠️ **Wajib sebelum live**: (1) **commit + push** semua perubahan (masih di working tree!), (2) ganti password admin, (3) ganti URL afiliasi placeholder, (4) deploy via Vercel (HTTPS otomatis), (5) HMAC webhook.
- 💡 **Nice-to-have**: analytics, canonical/hreflang (multi-bahasa), test A/B end-to-end, lebih banyak testimoni/stat ASLI (aturan FTC), deploy Vercel.

> **⚠️ Catatan penting — belum di-commit:** seluruh fitur sesi ini (grouped content, count column, multi-slug, palette) **plus** fitur sesi sebelumnya (dark mode, A/B test, privacy/terms, dll.) masih ada di working tree, belum `git commit`/`push`. `HEAD == origin/main`. Segera commit agar tidak hilang.

---

## Cara Lanjut di Sesi Baru
Di sesi chat baru, cukup kirimkan:
> "Lanjutkan proyek Dynamic Content Template Engine. Baca `HANDFOFF.md` di `C:\Users\cox\ZCodeProject\dynamic-content-template-engine`."