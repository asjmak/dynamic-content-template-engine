import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getPageData, getActiveAbTests, getPageBySlug } from "@/lib/data";
import { pickVariant, parseAbVariant } from "@/lib/ab";
import BlockRenderer from "@/components/BlockRenderer";

export const revalidate = 300;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { preview?: string };
}): Promise<Metadata> {
  const preview = searchParams?.preview === "1";
  const page = await getPageBySlug(params.slug, { includeDrafts: preview });
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const url = `${base}/${params.slug}`;

  if (!page) {
    return {
      title: "Not found",
      robots: { index: false, follow: false },
      alternates: { canonical: url },
    };
  }

  const { sections, settings } = await getPageData(page.template);
  const hero = sections.find((s) => s.block_type === "hero")?.contents[0];

  const title =
    page.title ||
    hero?.og_title ||
    hero?.title ||
    settings?.default_title ||
    "VigRX Plus® — Male Vitality";
  const description =
    page.meta_description ||
    hero?.og_description ||
    hero?.body ||
    settings?.default_description ||
    "Clinically studied herbal male vitality supplement.";

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function SlugPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { preview?: string };
}) {
  const preview = searchParams?.preview === "1";
  const page = await getPageBySlug(params.slug, { includeDrafts: preview });
  if (!page) notFound();

  const { sections, settings } = await getPageData(page.template);
  const hero = sections.find((s) => s.block_type === "hero")?.contents[0];

  // A/B variant split (server-side) — sama seperti homepage.
  const abTests = await getActiveAbTests(page.template);
  const cookieStore = cookies();
  const rawCookie = cookieStore.get("ab-variant")?.value || "{}";
  let abMap = parseAbVariant(rawCookie);
  let changed = false;

  for (const test of abTests) {
    if (!abMap[test.id]) {
      abMap[test.id] = pickVariant();
      changed = true;
    }
  }
  for (const key of Object.keys(abMap)) {
    if (!abTests.find((t) => t.id === key)) {
      delete abMap[key];
      changed = true;
    }
  }

  const { sections: sectionsAb } = await getPageData(abMap, page.template);

  const allLinks = sectionsAb.flatMap((s) => (s.contents ?? []).flatMap((c) => c.links ?? []));
  const officialUrl =
    allLinks.find((l) => typeof l.url === "string" && /^https?:/i.test(l.url))?.url ||
    "https://example.com/vigrx-plus";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: page.title || "VigRX Plus",
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
    <main data-template={page.template} data-palette={page.palette ?? "red"}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AbVariantSetter variantMap={changed ? abMap : null} />
      {sectionsAb.map((s) => (
        <BlockRenderer key={s.id} section={s} />
      ))}
    </main>
  );
}

// Komponen client untuk menyetel cookie A/B (hanya bila variant baru dipilih).
function AbVariantSetter({ variantMap }: { variantMap: Record<string, "A" | "B"> | null }) {
  if (!variantMap) return null;
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          document.cookie = 'ab-variant=' + encodeURIComponent(${JSON.stringify(
            JSON.stringify(variantMap)
          )}) + '; path=/; max-age=' + (60 * 60 * 24 * 30) + '; SameSite=Lax';
        `,
      }}
    />
  );
}
