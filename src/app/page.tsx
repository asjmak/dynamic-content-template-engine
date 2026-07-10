import type { Metadata } from "next";
import { getPageData } from "@/lib/data";
import BlockRenderer from "@/components/BlockRenderer";

// Selalu render di server (konten bisa berubah kapan saja dari DB).
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { sections, settings } = await getPageData();
  const hero = sections.find((s) => s.block_type === "hero")?.contents[0];

  const title =
    hero?.og_title || hero?.title || settings?.default_title || "Dynamic Template";
  const description =
    hero?.og_description || hero?.body || settings?.default_description || "";
  const url = settings?.site_url || undefined;

  return {
    title,
    description,
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
  const { sections } = await getPageData();
  return (
    <main>
      {sections.map((s) => (
        <BlockRenderer key={s.id} section={s} />
      ))}
    </main>
  );
}
