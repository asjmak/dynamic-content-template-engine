// =====================================================================
//  Seed 3 template landing page (demo produk: VigRX Plus)
//  Jalankan:  node scripts/seed-templates.mjs
//  Butuh: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY di .env.local
//  Idempoten: pakai upsert berdasarkan id tetap.
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
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !SERVICE) {
  console.error("✗ Butuh NEXT_PUBLIC_SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY di .env.local");
  process.exit(1);
}
const admin = createClient(URL, SERVICE, { auth: { persistSession: false } });

const LINKS = {
  official: "cccccccc-cccc-cccc-cccc-cccccccccccc",
  promo: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  main: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
};

const IMG = {
  product: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600",
  man: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600",
  herbs: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600",
};

// ---------------------- TEMPLATES ----------------------
const TEMPLATES = {
  "classic-sales": {
    sections: [
      {
        id: "11111111-1111-1111-1111-111111111111",
        block_type: "hero",
        title: "Hero",
        ordering: 10,
        settings: {
          heading: "VigRX Plus™ — Vitalitas Pria #1 Dunia",
          subheading:
            "Formula alami teruji klinis untuk performa & stamina lebih baik dalam 60 hari.",
          cta_label: "Pesan Sekarang",
        },
        contents: [
          {
            id: "61111111-1111-1111-1111-111111111111",
            title: "VigRX Plus™",
            body: "Dapatkan hasil nyata dengan garansi uang kembali 67 hari.",
            image_url: IMG.product,
            cta_text: "Pesan Sekarang",
            ordering: 1,
            links: ["official"],
          },
        ],
      },
      {
        id: "22222222-2222-2222-2222-222222222222",
        block_type: "grid",
        title: "Mengapa VigRX Plus?",
        ordering: 20,
        settings: { columns: 3 },
        contents: [
          { id: "c1111111-1111-1111-1111-111111111111", title: "Alami & Aman", body: "Terdiri dari ekstrak herbal berkualitas tinggi, tanpa resep.", ordering: 1, links: ["official"] },
          { id: "c2222222-1111-1111-1111-111111111111", title: "Teruji Klinis", body: "Studi menunjukkan peningkatan performa yang signifikan.", ordering: 2, links: ["official"] },
          { id: "c3333333-1111-1111-1111-111111111111", title: "Hasil 60 Hari", body: "Ribuan pria merasakan perbedaan nyata.", ordering: 3, links: ["official"] },
        ],
      },
      {
        id: "d1111111-1111-1111-1111-111111111111",
        block_type: "slider",
        title: "Apa Kata Mereka",
        ordering: 30,
        settings: {},
        contents: [
          { id: "t1111111-1111-1111-1111-111111111111", title: "★★★★★", body: '"Stamina saya kembali seperti 10 tahun lalu." — Budi, 42', ordering: 1, links: [] },
          { id: "t2222222-1111-1111-1111-111111111111", title: "★★★★★", body: '"Sangat puas dengan hasilnya." — Andre, 38', ordering: 2, links: [] },
          { id: "t3333333-1111-1111-1111-111111111111", title: "★★★★★", body: '"Garansi membuat saya berani mencoba." — Rian, 45', ordering: 3, links: [] },
        ],
      },
      {
        id: "d2222222-1111-1111-1111-111111111111",
        block_type: "single_column",
        title: "Cara Kerja",
        ordering: 40,
        settings: {},
        contents: [
          { id: "w1111111-1111-1111-1111-111111111111", title: "3 Langkah Mudah", body: "1) Konsumsi 2 kapsul/hari. 2) Perbanyak air & olahraga rutin. 3) Nikmati hasil dalam 60 hari.", ordering: 1, links: [] },
        ],
      },
      {
        id: "d3333333-1111-1111-1111-111111111111",
        block_type: "single_column",
        title: "Penawaran & Garansi",
        ordering: 50,
        settings: {},
        contents: [
          { id: "o1111111-1111-1111-1111-111111111111", title: "Diskon 25% + Garansi 67 Hari", body: "Pesan hari ini dan dapatkan garansi uang kembali 67 hari, tanpa pertanyaan.", cta_text: "Klaim Diskon", ordering: 1, links: ["promo"] },
        ],
      },
      {
        id: "d4444444-1111-1111-1111-111111111111",
        block_type: "single_column",
        title: "Pertanyaan Umum",
        ordering: 60,
        settings: {},
        contents: [
          { id: "q1111111-1111-1111-1111-111111111111", title: "Apakah aman?", body: "Terdiri dari bahan alami; konsultasikan dokter jika punya kondisi medis tertentu.", ordering: 1, links: [] },
          { id: "q2222222-1111-1111-1111-111111111111", title: "Berapa lama sampai hasil?", body: "Biasanya terasa dalam 30–60 hari pemakaian rutin.", ordering: 2, links: [] },
        ],
      },
      {
        id: "33333333-3333-3333-3333-333333333333",
        block_type: "footer",
        title: "Footer",
        ordering: 100,
        settings: { text: "© 2026 Demo VigRX Plus — Promosi afiliasi. Bukan nasihat medis." },
        contents: [],
      },
    ],
  },

  "lead-gen": {
    sections: [
      {
        id: "e1111111-1111-1111-1111-111111111111",
        block_type: "hero",
        title: "Hero",
        ordering: 10,
        settings: {
          heading: "Dapatkan Panduan Gratis VigRX Plus™",
          subheading: "Pelajari cara meningkatkan vitalitas secara alami — langsung dari ahlinya.",
          cta_label: "Klaim Panduan",
        },
        contents: [
          { id: "5a111111-1111-1111-1111-111111111111", title: "Panduan Gratis", body: "Isi data untuk menerima panduan & penawaran terbatas.", image_url: IMG.man, cta_text: "Klaim Sekarang", ordering: 1, links: ["official"] },
        ],
      },
      {
        id: "e2222222-1111-1111-1111-111111111111",
        block_type: "single_column",
        title: "Apakah Anda Mengalami?",
        ordering: 20,
        settings: {},
        contents: [
          { id: "lp111111-1111-1111-1111-111111111111", title: "Tanda-tanda umum", body: "• Energi menurun • Kurang percaya diri • Performa tidak konsisten", ordering: 1, links: [] },
        ],
      },
      {
        id: "e3333333-1111-1111-1111-111111111111",
        block_type: "grid",
        title: "Manfaat Utama",
        ordering: 30,
        settings: { columns: 3 },
        contents: [
          { id: "5c111111-1111-1111-1111-111111111111", title: "Stamina", body: "Daya tahan lebih prima sepanjang hari.", ordering: 1, links: [] },
          { id: "5c222222-1111-1111-1111-111111111111", title: "Kenyamanan", body: "Komposisi alami, mudah dikonsumsi.", ordering: 2, links: [] },
          { id: "5c333333-1111-1111-1111-111111111111", title: "Terbukti", body: "Didukung ulasan pengguna nyata.", ordering: 3, links: [] },
        ],
      },
      {
        id: "e4444444-1111-1111-1111-111111111111",
        block_type: "lead_form",
        title: "Klaim Diskon Eksklusif",
        ordering: 40,
        settings: {
          title: "Klaim Diskon Eksklusif",
          subtitle: "Isi data, dapatkan panduan & penawaran terbatas langsung ke WA Anda.",
          cta_label: "Dapatkan Sekarang",
          redirect_url: "https://example.com/vigrx-plus",
        },
        contents: [],
      },
      {
        id: "e5555555-1111-1111-1111-111111111111",
        block_type: "slider",
        title: "Testimoni",
        ordering: 50,
        settings: {},
        contents: [
          { id: "5d111111-1111-1111-1111-111111111111", title: "★★★★★", body: '"Akhirnya nemu solusi yang works." — Sandi, 40', ordering: 1, links: [] },
          { id: "5d222222-1111-1111-1111-111111111111", title: "★★★★★", body: '"CS ramah & proses mudah." — Tono, 37', ordering: 2, links: [] },
        ],
      },
      {
        id: "e6666666-1111-1111-1111-111111111111",
        block_type: "footer",
        title: "Footer",
        ordering: 100,
        settings: { text: "© 2026 Demo VigRX Plus — Promosi afiliasi." },
        contents: [],
      },
    ],
  },

  "modern-review": {
    sections: [
      {
        id: "f1111111-1111-1111-1111-111111111111",
        block_type: "hero",
        title: "Hero",
        ordering: 10,
        settings: {
          heading: "Review Jujur VigRX Plus™",
          subheading: "Rating 4.8/5 dari ribuan pengguna. Simak pro, kontra, & cara kerjanya.",
          cta_label: "Cek Penawaran",
        },
        contents: [
          { id: "mh111111-1111-1111-1111-111111111111", title: "Rating 4.8/5", body: "Berdasarkan ulasan pengguna terverifikasi.", image_url: IMG.product, cta_text: "Cek Penawaran", ordering: 1, links: ["official"] },
        ],
      },
      {
        id: "f2222222-1111-1111-1111-111111111111",
        block_type: "grid",
        title: "Pro & Kontra",
        ordering: 20,
        settings: { columns: 2 },
        contents: [
          { id: "mp111111-1111-1111-1111-111111111111", title: "Pro", body: "✓ Bahan alami ✓ Teruji klinis ✓ Garansi 67 hari", ordering: 1, links: [] },
          { id: "mp222222-1111-1111-1111-111111111111", title: "Kontra", body: "✗ Butuh konsistensi ✓ Hanya resmi ✓ Hasil bervariasi", ordering: 2, links: [] },
        ],
      },
      {
        id: "f3333333-1111-1111-1111-111111111111",
        block_type: "single_column",
        title: "Cara Kerja & Komposisi",
        ordering: 30,
        settings: {},
        contents: [
          { id: "mw111111-1111-1111-1111-111111111111", title: "Komposisi", body: "Ekstrak tanaman tradisional yang mendukung aliran darah & hormon sehat.", ordering: 1, links: [] },
        ],
      },
      {
        id: "f4444444-1111-1111-1111-111111111111",
        block_type: "grid",
        title: "Hasil Survei",
        ordering: 40,
        settings: { columns: 3 },
        contents: [
          { id: "ms111111-1111-1111-1111-111111111111", title: "62%", body: "melaporkan peningkatan stamina", ordering: 1, links: [] },
          { id: "ms222222-1111-1111-1111-111111111111", title: "71%", body: "puas dengan kualitas ereksi", ordering: 2, links: [] },
          { id: "ms333333-1111-1111-1111-111111111111", title: "67 hr", body: "garansi uang kembali", ordering: 3, links: [] },
        ],
      },
      {
        id: "f5555555-1111-1111-1111-111111111111",
        block_type: "single_column",
        title: "Garansi & Penawaran",
        ordering: 50,
        settings: {},
        contents: [
          { id: "mo111111-1111-1111-1111-111111111111", title: "Garansi 67 Hari", body: "Pesan dari sumber resmi untuk garansi penuh.", cta_text: "Pesan Resmi", ordering: 1, links: ["official"] },
        ],
      },
      {
        id: "f6666666-1111-1111-1111-111111111111",
        block_type: "single_column",
        title: "Pertanyaan Umum",
        ordering: 60,
        settings: {},
        contents: [
          { id: "mq111111-1111-1111-1111-111111111111", title: "Asli dari mana?", body: "Gunakan link resmi untuk menghindari produk palsu.", ordering: 1, links: [] },
          { id: "mq222222-1111-1111-1111-111111111111", title: "Efek samping?", body: "Bahan alami umumnya aman; hentikan jika tidak nyaman.", ordering: 2, links: [] },
        ],
      },
      {
        id: "f7777777-1111-1111-1111-111111111111",
        block_type: "footer",
        title: "Footer",
        ordering: 100,
        settings: { text: "© 2026 Demo VigRX Plus — Promosi afiliasi. Bukan nasihat medis." },
        contents: [],
      },
    ],
  },

  "long-form": {
    sections: [
      {
        id: "51111111-1111-1111-1111-111111111111",
        block_type: "hero",
        title: "Hero",
        ordering: 10,
        settings: {
          heading: "Cerita di Balik VigRX Plus™",
          subheading: "Dari keraguan menjadi percaya diri — inilah perjalanan ribuan pria.",
          cta_label: "Baca Cerita",
        },
        contents: [
          { id: "5a111111-1111-1111-1111-111111111111", title: "Cerita", body: "Kenali bagaimana VigRX Plus™ membantu.", image_url: IMG.man, cta_text: "Baca Cerita", ordering: 1, links: ["official"] },
        ],
      },
      {
        id: "52222222-1111-1111-1111-111111111111",
        block_type: "single_column",
        title: "Awal Mula",
        ordering: 20,
        settings: {},
        contents: [
          { id: "5b111111-1111-1111-1111-111111111111", title: "Awal Mula", body: "Banyak pria merasa malu membicarakan performa. Padahal ini wajar dan ada solusinya. VigRX Plus™ hadir sebagai jawaban alami yang bisa dipercaya.", ordering: 1, links: [] },
        ],
      },
      {
        id: "53333333-1111-1111-1111-111111111111",
        block_type: "grid",
        title: "Manfaat Nyata",
        ordering: 30,
        settings: { columns: 3 },
        contents: [
          { id: "5c111111-1111-1111-1111-111111111111", title: "Lebih Bergairah", body: "Aliran darah lebih lancar ke area vital.", ordering: 1, links: [] },
          { id: "5c222222-1111-1111-1111-111111111111", title: "Tahan Lama", body: "Stamina & durasi meningkat.", ordering: 2, links: [] },
          { id: "5c333333-1111-1111-1111-111111111111", title: "Lebih Percaya Diri", body: "Dampaknya terasa pada keintiman.", ordering: 3, links: [] },
        ],
      },
      {
        id: "54444444-1111-1111-1111-111111111111",
        block_type: "slider",
        title: "Testimoni",
        ordering: 40,
        settings: {},
        contents: [
          { id: "5d111111-1111-1111-1111-111111111111", title: "★★★★★", body: '"Cerita saya mirip dengan banyak testimoni di sini." — Joko, 44', ordering: 1, links: [] },
          { id: "5d222222-1111-1111-1111-111111111111", title: "★★★★★", body: '"Akhirnya berani jujur pada pasangan." — Herman, 39', ordering: 2, links: [] },
        ],
      },
      {
        id: "55555555-1111-1111-1111-111111111111",
        block_type: "single_column",
        title: "Penawaran Spesial",
        ordering: 50,
        settings: {},
        contents: [
          { id: "5e111111-1111-1111-1111-111111111111", title: "Diskon Terbatas", body: "Klaim penawaran khusus bulan ini.", cta_text: "Klaim Diskon", ordering: 1, links: ["promo"] },
        ],
      },
      {
        id: "56666666-1111-1111-1111-111111111111",
        block_type: "single_column",
        title: "Pertanyaan Umum",
        ordering: 60,
        settings: {},
        contents: [
          { id: "5f111111-1111-1111-1111-111111111111", title: "Apakah aman?", body: "Bahan alami; konsultasikan dokter bila punya kondisi medis tertentu.", ordering: 1, links: [] },
        ],
      },
      {
        id: "57777777-1111-1111-1111-111111111111",
        block_type: "footer",
        title: "Footer",
        ordering: 100,
        settings: { text: "© 2026 Demo VigRX Plus — Promosi afiliasi." },
        contents: [],
      },
    ],
  },

  "comparison": {
    sections: [
      {
        id: "61111111-1111-1111-1111-111111111111",
        block_type: "hero",
        title: "Hero",
        ordering: 10,
        settings: {
          heading: "VigRX Plus™ vs Lainnya",
          subheading: "Bandingkan sebelum memutuskan — ketahui mana yang layak.",
          cta_label: "Lihat Perbandingan",
        },
        contents: [
          { id: "6a111111-1111-1111-1111-111111111111", title: "Perbandingan", body: "Yuk, bandingkan secara objektif.", image_url: IMG.product, cta_text: "Lihat Perbandingan", ordering: 1, links: ["official"] },
        ],
      },
      {
        id: "62222222-1111-1111-1111-111111111111",
        block_type: "grid",
        title: "Perbandingan",
        ordering: 20,
        settings: { columns: 2 },
        contents: [
          { id: "6b111111-1111-1111-1111-111111111111", title: "VigRX Plus™", body: "✓ Teruji klinis ✓ Garansi 67 hari ✓ Bahan alami", ordering: 1, links: ["official"] },
          { id: "6b222222-1111-1111-1111-111111111111", title: "Produk Lain", body: "✗ Klaim belum terbukti ✗ Garansi minim ✗ Campuran tidak jelas", ordering: 2, links: [] },
        ],
      },
      {
        id: "63333333-1111-1111-1111-111111111111",
        block_type: "single_column",
        title: "Verdict",
        ordering: 30,
        settings: {},
        contents: [
          { id: "6c111111-1111-1111-1111-111111111111", title: "Pemenangnya Jelas", body: "Untuk hasil yang dapat dipertanggungjawabkan, pilih sumber resmi.", cta_text: "Pesan Resmi", ordering: 1, links: ["official"] },
        ],
      },
      {
        id: "64444444-1111-1111-1111-111111111111",
        block_type: "single_column",
        title: "Pertanyaan Umum",
        ordering: 40,
        settings: {},
        contents: [
          { id: "6d111111-1111-1111-1111-111111111111", title: "Mana yang asli?", body: "Gunakan link resmi untuk menghindari produk palsu.", ordering: 1, links: [] },
        ],
      },
      {
        id: "65555555-1111-1111-1111-111111111111",
        block_type: "footer",
        title: "Footer",
        ordering: 100,
        settings: { text: "© 2026 Demo VigRX Plus — Promosi afiliasi." },
        contents: [],
      },
    ],
  },
};

async function main() {
  // pastikan link affiliate VigRX ada
  await admin
    .from("links")
    .upsert(
      [{ id: LINKS.official, label: "VigRX Official", url: "https://example.com/vigrx-plus", tracking_id: "VGRX_OFFICIAL" }],
      { onConflict: "id" }
    );

  for (const [tpl, def] of Object.entries(TEMPLATES)) {
    console.log(`  ─ ${tpl}: ${def.sections?.length || 0} sections, ${(def.sections || []).reduce((a, s) => a + (s.contents || []).length, 0)} contents`);
    for (const sec of def.sections) {
      await admin.from("sections").upsert({
        id: sec.id,
        block_type: sec.block_type,
        title: sec.title,
        ordering: sec.ordering,
        settings: sec.settings || {},
        template: tpl,
        is_active: true,
      });
      for (const c of sec.contents || []) {
        await admin.from("contents").upsert({
          id: c.id,
          section_id: sec.id,
          title: c.title || null,
          body: c.body || null,
          image_url: c.image_url || null,
          cta_text: c.cta_text || null,
          ordering: c.ordering || 1,
          is_active: true,
        });
        for (const lk of c.links || []) {
          await admin
            .from("content_links")
            .upsert({ content_id: c.id, link_id: LINKS[lk] }, { onConflict: "content_id,link_id" });
        }
      }
    }
    console.log("✓ template:", tpl);
  }

  await admin.from("site_settings").update({ active_template: "classic-sales" }).eq("id", 1);
  console.log("✓ Selesai. Template aktif = classic-sales");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
