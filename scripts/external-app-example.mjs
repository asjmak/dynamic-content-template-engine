// =====================================================================
//  Contoh "Aplikasi Manajemen Eksternal"
//  Cara menjalankan:
//    1. Salin .env.example -> .env dan isi WEBHOOK_URL + WEBHOOK_SECRET
//    2. Jalankan:  node scripts/external-app-example.mjs
//
//  Skrip ini mensimulasikan sistem eksternal yang mengirim update
//  (mis. mengganti URL affiliate secara massal via tracking_id)
//  ke endpoint /api/webhook milik Dynamic Content Template Engine.
// =====================================================================

const WEBHOOK_URL =
  process.env.WEBHOOK_URL || "http://localhost:3000/api/webhook";
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "ganti-dengan-secret-anda";

// Payload yang dikirim. Semua field opsional; kirim hanya yang berubah.
const payload = {
  // Update massal URL affiliate berdasarkan tracking_id (tanpa sentuh konten).
  links: [
    {
      tracking_id: "AFF_MAIN",
      url: "https://example.com/affiliate-baru",
      label: "Affiliate Utama",
      is_active: true,
    },
    {
      tracking_id: "AFF_PROMO",
      url: "https://example.com/promo-2026",
      label: "Promo",
      is_active: true,
    },
  ],

  // Contoh update struktur section (butuh id yang valid).
  // sections: [
  //   { id: "11111111-1111-1111-1111-111111111111", block_type: "hero",
  //     title: "Hero", ordering: 1,
  //     settings: { heading: "Judul Baru", subheading: "Subtitle baru", cta_label: "Mulai" },
  //     is_active: true },
  // ],

  // Contoh update konten (butuh id + section_id yang valid).
  // contents: [
  //   { id: "c1111111-1111-1111-1111-111111111111", section_id: "22222222-2222-2222-2222-222222222222",
  //     title: "Cepat", body: "Deskripsi baru", cta_text: "Coba", ordering: 1, is_active: true },
  // ],
};

async function main() {
  const res = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-webhook-secret": WEBHOOK_SECRET,
    },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  console.log("HTTP", res.status);
  console.log(JSON.stringify(json, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
