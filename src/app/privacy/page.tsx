import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — VigRX Plus Affiliate",
  description: "How we collect, use, and protect your information.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>Last updated: 2026-07-10</p>

      <h2>1. Information We Collect</h2>
      <p>
        When you submit our lead form, we collect your name, email address, and
        optionally your phone number. We also collect standard technical data
        (such as IP address, browser type, and pages visited) through server logs
        and cookies.
      </p>

      <h2>2. How We Use Your Information</h2>
      <p>
        We use your information to: (a) send you the free guide and discount code
        you requested; (b) respond to your inquiries; and (c) operate and improve
        our website. We do not sell your personal information.
      </p>

      <h2>3. Sharing</h2>
      <p>
        We may share your information with service providers who help us operate
        the site (for example, email delivery and hosting). If you request the
        guide or discount, your email may be shared with the product partner
        solely to fulfill your request. We may also disclose information when
        required by law.
      </p>

      <h2>4. Cookies &amp; Tracking</h2>
      <p>
        We use cookies for site functionality and, where you consent, analytics.
        You can manage your choice through the cookie banner and your browser
        settings.
      </p>

      <h2>5. Your Rights (GDPR / CCPA)</h2>
      <p>
        Depending on your location, you may have the right to access, correct,
        delete, or port your personal data, and to opt out of certain processing.
        To exercise these rights, email{" "}
        <a href="mailto:privacy@example.com">privacy@example.com</a>. You may also
        unsubscribe from our emails at any time using the link in each email.
      </p>

      <h2>6. Data Retention</h2>
      <p>
        We retain your information only as long as necessary for the purposes
        above or as required by applicable law.
      </p>

      <h2>7. Children</h2>
      <p>
        This site is not directed to individuals under 18, and we do not
        knowingly collect data from minors.
      </p>

      <h2>8. Contact</h2>
      <p>
        Questions about this policy? Email{" "}
        <a href="mailto:privacy@example.com">privacy@example.com</a>.
      </p>

      <p className="legal-note">
        This Privacy Policy is provided as a template and should be reviewed by a
        qualified professional before use. Replace the contact email and any
        business details with your own.
      </p>
    </LegalPage>
  );
}
