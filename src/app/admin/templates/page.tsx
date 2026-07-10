import { requireAdmin } from "@/lib/guard";
import { createServerClient } from "@/lib/supabase/server";
import { setActiveTemplate } from "@/lib/actions";

const TEMPLATES = [
  {
    id: "classic-sales",
    name: "Classic Sales",
    desc: "Halaman jualan produk klasik: Hero → Manfaat → Testimoni → Cara Kerja → Penawaran → FAQ. Fokus konversi langsung.",
  },
  {
    id: "lead-gen",
    name: "Lead Generation",
    desc: "Fokus menangkap prospek: Hero → Masalah → Manfaat → Form Lead → Testimoni. Cocok untuk mengumpulkan lead/WA.",
  },
  {
    id: "modern-review",
    name: "Modern Review",
    desc: "Gaya review: Rating → Pro & Kontra → Cara Kerja → Statistik → Garansi → FAQ. Bangun trust sebelum jual.",
  },
  {
    id: "long-form",
    name: "Long-form Sales",
    desc: "Surat penjualan bertutur: Hero → Cerita → Manfaat → Testimoni → Penawaran → FAQ. Bangun trust lewat narasi.",
  },
  {
    id: "comparison",
    name: "Comparison (VS)",
    desc: "Gaya perbandingan: Hero → VigRX vs Lainnya → Verdict → FAQ. Untuk pengunjung yang sedang membandingkan.",
  },
];

export default async function TemplatesPage() {
  await requireAdmin();
  const supabase = createServerClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("active_template")
    .eq("id", 1)
    .maybeSingle();
  const active = settings?.active_template || "classic-sales";

  return (
    <div>
      <h1>Template Landing Page</h1>
      <p>Pilih template yang aktif. Perubahan langsung terlihat di halaman depan.</p>
      <div className="dash-cards">
        {TEMPLATES.map((t) => (
          <div className="dash-card" key={t.id}>
            <div className="num" style={{ fontSize: 22 }}>
              {t.name}
            </div>
            <p style={{ fontSize: 14, color: "#64748b", minHeight: 60 }}>
              {t.desc}
            </p>
            {active === t.id ? (
              <strong style={{ color: "#16a34a" }}>✓ Aktif</strong>
            ) : (
              <form action={setActiveTemplate}>
                <input type="hidden" name="template" value={t.id} />
                <button className="btn" type="submit">
                  Gunakan
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
      <p style={{ marginTop: 24 }}>
        <a className="btn" href="/">
          Lihat website →
        </a>
      </p>
    </div>
  );
}
