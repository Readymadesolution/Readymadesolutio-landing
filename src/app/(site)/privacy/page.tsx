import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — ReadyMade Solution",
  description:
    "How ReadyMade Solution collects, uses, discloses, and protects your personal information.",
};

const sections: LegalSection[] = [
  {
    heading: "1. Who we are",
    body: (
      <p>
        ReadyMade Solution (&ldquo;ReadyMade Solution&rdquo;, &ldquo;we&rdquo;,
        &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is an enterprise software
        development company located at 330 5th Avenue SW, Suite 1800, Calgary,
        Alberta, T2P 0L4, Canada. We are responsible for the personal
        information we collect and handle in the course of operating this
        website and providing our services.
      </p>
    ),
  },
  {
    heading: "2. Information we collect",
    body: (
      <>
        <p>We collect personal information that you provide to us directly, including when you book a consultation, contact us, or otherwise communicate with us. This may include:</p>
        <ul>
          <li>Contact details such as your name, email address, phone number, and company name.</li>
          <li>Information about your project, requirements, and the message content you send us.</li>
          <li>Scheduling information when you book a meeting through our booking tools.</li>
        </ul>
        <p>We also automatically collect limited technical information when you visit our website, such as your IP address, browser type, device information, and pages viewed, through cookies and similar technologies.</p>
      </>
    ),
  },
  {
    heading: "3. How we use your information",
    body: (
      <>
        <p>We use your personal information to:</p>
        <ul>
          <li>Respond to your enquiries and schedule and conduct consultations.</li>
          <li>Provide, maintain, and improve our services and website.</li>
          <li>Communicate with you about your project, proposals, and our services.</li>
          <li>Comply with legal obligations and protect our legal rights.</li>
        </ul>
        <p>We only use your information for the purposes for which it was collected, or for a consistent purpose, unless you consent otherwise or we are permitted or required by law.</p>
      </>
    ),
  },
  {
    heading: "4. Legal basis and consent",
    body: (
      <p>
        We collect, use, and disclose personal information with your consent,
        which may be express or implied depending on the circumstances and the
        sensitivity of the information. By submitting your information through
        our forms, you consent to the handling of your personal information as
        described in this policy. You may withdraw your consent at any time,
        subject to legal or contractual restrictions and reasonable notice.
      </p>
    ),
  },
  {
    heading: "5. How we share information",
    body: (
      <>
        <p>We do not sell your personal information. We may share it with:</p>
        <ul>
          <li>Service providers who process information on our behalf (for example, scheduling, email, hosting, and analytics providers), under agreements that require them to protect your information.</li>
          <li>Professional advisors, and authorities where required by law, regulation, legal process, or governmental request.</li>
          <li>A successor entity in connection with a merger, acquisition, or sale of assets.</li>
        </ul>
        <p>Some of our service providers may store or process information outside of Canada. Where information is transferred to another jurisdiction, it may be subject to the laws of that jurisdiction.</p>
      </>
    ),
  },
  {
    heading: "6. Cookies and analytics",
    body: (
      <p>
        We use cookies and similar technologies to operate the website,
        remember your preferences, and understand how the site is used. You can
        control cookies through your browser settings. Disabling cookies may
        affect the functionality of the website.
      </p>
    ),
  },
  {
    heading: "7. How we protect your information",
    body: (
      <p>
        We maintain reasonable administrative, technical, and physical
        safeguards designed to protect personal information against loss, theft,
        and unauthorized access, use, or disclosure, appropriate to the
        sensitivity of the information. No method of transmission or storage is
        completely secure, and we cannot guarantee absolute security.
      </p>
    ),
  },
  {
    heading: "8. Retention",
    body: (
      <p>
        We retain personal information only as long as necessary to fulfil the
        purposes for which it was collected, including to satisfy any legal,
        accounting, or reporting requirements, after which it is securely
        destroyed, erased, or anonymized.
      </p>
    ),
  },
  {
    heading: "9. Your rights",
    body: (
      <p>
        Subject to applicable law, you have the right to access and request
        correction of your personal information, to withdraw consent, and to ask
        questions about our handling of your information. To exercise these
        rights, contact us using the details below. We may need to verify your
        identity before responding.
      </p>
    ),
  },
  {
    heading: "10. Changes to this policy",
    body: (
      <p>
        We may update this Privacy Policy from time to time. When we do, we will
        revise the &ldquo;Last updated&rdquo; date above. Your continued use of
        the website after changes take effect constitutes acceptance of the
        updated policy.
      </p>
    ),
  },
  {
    heading: "11. Contact us",
    body: (
      <p>
        If you have questions or concerns about this policy or our handling of
        your personal information, contact us at{" "}
        <a href="mailto:info@readymadesolution.com">info@readymadesolution.com</a>{" "}
        or by mail at 330 5th Avenue SW, Suite 1800, Calgary, Alberta, T2P 0L4,
        Canada.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="July 8, 2026"
      intro={
        <p>
          This Privacy Policy explains how ReadyMade Solution collects, uses,
          discloses, and protects your personal information when you visit our
          website or use our services. We are committed to handling your
          personal information in accordance with Canada&rsquo;s Personal
          Information Protection and Electronic Documents Act (PIPEDA) and
          Alberta&rsquo;s Personal Information Protection Act (PIPA).
        </p>
      }
      sections={sections}
    />
  );
}
