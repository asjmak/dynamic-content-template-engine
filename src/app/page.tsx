import type { Metadata } from "next";
import { getPageData } from "@/lib/data";
import BlockRenderer from "@/components/BlockRenderer";

// ISR: halaman di-cache 5 menit, tapi admin edit memicu revalidatePath("/")
// sehingga konten tetap segar. Lebih cepat (TTFB/Core Web Vitals) dari force-dynamic.
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { sections, settings } = await getPageData();
  const hero = sections.find((s) => s.block_type === "hero")?.contents[0];

  const title =
    hero?.og_title || hero?.title || settings?.default_title || "VigRX Plus® — Male Vitality";
  const description =
    hero?.og_description || hero?.body || settings?.default_description || "Clinically studied herbal male vitality supplement.";
  const url = settings?.site_url || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    title,
    description,
    alternates: { canonical: "/" },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function Home() {
  const { sections, settings } = await getPageData();
  const hero = sections.find((s) => s.block_type === "hero")?.contents[0];

  // Cari link afiliasi ASLI (http/https) dari seluruh konten — jangan pakai
  // link anchor (#lead-form) yang dipakai hero di template lead-gen.
  const allLinks = sections.flatMap((s) => (s.contents ?? []).flatMap((c) => c.links ?? []));
  const officialUrl =
    allLinks.find((l) => typeof l.url === "string" && /^https?:/i.test(l.url))?.url ||
    "https://example.com/vigrx-plus";

  // Structured data (JSON-LD) — Product + Offer.
  // Catatan: AggregateRating sengaja TIDAK disertakan karena data rating di sini
  // masih demo. Tambahkan hanya bila sudah ada data review ASLI (hindari pelanggaran
  // kebijakan structured data Google).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "VigRX Plus",
    description: hero?.body || settings?.default_description || "Clinically studied herbal male vitality supplement.",
    brand: { "@type": "Brand", name: "VigRX Plus" },
    offers: {
      "@type": "Offer",
      url: officialUrl,
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {sections.map((s) => (
        <BlockRenderer key={s.id} section={s} />
      ))}
    </main>
  );
}
