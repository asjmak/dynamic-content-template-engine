import "./globals.css";
import type { Metadata } from "next";
import CookieConsent from "@/components/CookieConsent";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-US">
      <body>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
