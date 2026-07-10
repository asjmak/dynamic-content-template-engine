import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service — VigRX Plus Affiliate",
  description: "Terms and conditions governing use of this website.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <p>Last updated: 2026-07-10</p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using this website, you agree to be bound by these Terms
        of Service and our Privacy Policy. If you do not agree, please do not use
        the site.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least 18 years old to use this site. By using the site,
        you represent that you meet this requirement.
      </p>

      <h2>3. Not Medical Advice</h2>
      <p>
        The content on this site is for general informational purposes only and is
        not intended to diagnose, treat, cure, or prevent any disease. Always
        consult a qualified healthcare professional before using any supplement
        or making health-related decisions.
      </p>

      <h2>4. Affiliate Disclosure</h2>
      <p>
        This site is an affiliate property. We may earn a commission from
        qualifying purchases made through links on this site, at no extra cost to
        you. Such links are identified where appropriate.
      </p>

      <h2>5. Intellectual Property</h2>
      <p>
        All text, graphics, and other content on this site are the property of
        their respective owners and are protected by applicable intellectual
        property laws. You may not reproduce or redistribute content without
        prior written permission.
      </p>

      <h2>6. Limitation of Liability</h2>
      <p>
        The site and its content are provided "as is" without warranties of any
        kind. To the fullest extent permitted by law, we are not liable for any
        indirect, incidental, or consequential damages arising from your use of
        the site or any linked third-party site.
      </p>

      <h2>7. Third-Party Links</h2>
      <p>
        We are not responsible for the content, policies, or practices of any
        third-party websites linked from this site. Your interactions with those
        sites are governed by their own terms.
      </p>

      <h2>8. Governing Law</h2>
      <p>
        These Terms are governed by the laws of the jurisdiction in which the site
        operator is established, without regard to conflict-of-law principles.
      </p>

      <h2>9. Contact</h2>
      <p>
        Questions about these Terms? Email{" "}
        <a href="mailto:legal@example.com">legal@example.com</a>.
      </p>

      <p className="legal-note">
        These Terms are provided as a template and should be reviewed by a
        qualified professional before use. Replace the contact email and any
        business details with your own.
      </p>
    </LegalPage>
  );
}
