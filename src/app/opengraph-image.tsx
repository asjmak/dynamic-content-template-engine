import { getPageData } from "@/lib/data";

export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Fallback SVG bila next/og gagal (mis. di Windows dev: @vercel/og bug path font).
function fallbackSvg(title: string, sub: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4f46e5"/>
      <stop offset="100%" stop-color="#0ea5e9"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <text x="80" y="300" fill="#ffffff" font-family="Arial, sans-serif" font-size="64" font-weight="700">${esc(
    title
  ).slice(0, 60)}</text>
  <text x="80" y="360" fill="#ffffff" font-family="Arial, sans-serif" font-size="30" opacity="0.9">${esc(
    sub
  ).slice(0, 110)}</text>
</svg>`;
}

// Thumbnail Open Graph dinamis (otomatis dipakai sebagai og:image / twitter:image).
export default async function OG() {
  const { sections, settings } = await getPageData();
  const hero = sections.find((s) => s.block_type === "hero")?.contents[0];

  const title =
    hero?.og_title || hero?.title || settings?.default_title || "Dynamic Template";
  const sub =
    hero?.og_description || hero?.body || settings?.default_description || "";

  // next/og (@vercel/og) GAGAL dimuat di Windows karena bug path font:
  // modulnya memanggil fileURLToPath(join(import.meta.url, "../noto-sans...ttf"))
  // dan di Windows import.meta.url = "file:///C:/..." sehingga path jadi invalid.
  // Error-nya muncul tertunda di dalam ReadableStream, sehingga tidak bisa di-try/catch.
  // Solusi: di Windows langsung pakai fallback SVG (tanpa import next/og sama sekali).
  // Di Linux/Vercel (target deploy) tetap pakai next/og untuk menghasilkan PNG asli.
  if (process.platform === "win32") {
    return new Response(fallbackSvg(title, sub), {
      headers: {
        "content-type": "image/svg+xml",
        "cache-control": "no-cache, no-store",
      },
    });
  }

  const { ImageResponse } = await import("next/og");
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
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>{title}</div>
        <div style={{ fontSize: 32, marginTop: 24, opacity: 0.9 }}>
          {sub.slice(0, 140)}
        </div>
      </div>
    ),
    { ...size }
  );
}
