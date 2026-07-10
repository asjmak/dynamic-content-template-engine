import { ImageResponse } from "next/og";
import { getPageData } from "@/lib/data";

export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Thumbnail Open Graph dinamis (otomatis dipakai sebagai og:image / twitter:image).
export default async function OG() {
  const { sections, settings } = await getPageData();
  const hero = sections.find((s) => s.block_type === "hero")?.contents[0];

  const title =
    hero?.og_title || hero?.title || settings?.default_title || "Dynamic Template";
  const sub =
    hero?.og_description || hero?.body || settings?.default_description || "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg,#4f46e5,#0ea5e9)",
          color: "white",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>
          {title}
        </div>
        <div style={{ fontSize: 32, marginTop: 24, opacity: 0.9 }}>
          {sub.slice(0, 140)}
        </div>
      </div>
    ),
    { ...size }
  );
}
