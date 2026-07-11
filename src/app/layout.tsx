import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import CookieConsent from "@/components/CookieConsent";
import TopBar from "@/components/TopBar";
import StickyOfferBar from "@/components/StickyOfferBar";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "VigRX Plus – Doctor-Endorsed Male Vitality Supplement",
  description: "Clinically studied herbal formula for stronger, longer-lasting performance — backed by a 67-day money-back guarantee.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "VigRX Plus – Doctor-Endorsed Male Vitality",
    description: "Clinically studied herbal male enhancement supplement with 67-day money-back guarantee.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "VigRX Plus – Doctor-Endorsed Male Vitality",
    description: "Clinically studied herbal formula for stronger, longer-lasting performance.",
  },
};

// Inline script: set tema sebelum paint untuk mencegah flash white (FOUC).
const themeInitScript = `
(function() {
  try {
    var t = localStorage.getItem('theme') || 'system';
    var dark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-US">
      <body>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800;900&family=Open+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <TopBar />
        <div className="theme-toggle-wrap">
          <ThemeToggle />
        </div>
        {children}
        <StickyOfferBar />
        <CookieConsent />
      </body>
    </html>
  );
}
