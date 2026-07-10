import Link from "next/link";
import { SectionWithContents } from "@/lib/types";

// Ganti dengan identitas bisnis ASLI Anda sebelum menjalankan iklan berbayar.
const BUSINESS = {
  name: "Your Business Name",
  email: "privacy@example.com",
  address: "123 Main Street, Suite 100, Your City, ST 00000, Country",
};

export default function Footer({ section }: { section: SectionWithContents }) {
  return (
    <footer className="footer">
      <div className="container">
        <p>
          {section.settings?.text ||
            section.title ||
            "© Dynamic Content Template Engine"}
        </p>
        <div className="footer-legal">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
        </div>
        <p className="footer-biz">
          {BUSINESS.name} &middot; {BUSINESS.address}
        </p>
      </div>
    </footer>
  );
}
