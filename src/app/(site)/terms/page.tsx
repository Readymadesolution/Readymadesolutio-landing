import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service — ReadyMade Solution",
  description:
    "The terms and conditions governing your use of the ReadyMade Solution website and services.",
};

const sections: LegalSection[] = [
  {
    heading: "1. Acceptance of these terms",
    body: (
      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and
        use of the website and services provided by ReadyMade Solution
        (&ldquo;ReadyMade Solution&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or
        &ldquo;our&rdquo;). By accessing or using our website or services, you
        agree to be bound by these Terms. If you do not agree, please do not use
        the website or services.
      </p>
    ),
  },
  {
    heading: "2. Our services",
    body: (
      <p>
        ReadyMade Solution provides software development, AI automation, and
        related consulting and engineering services. The scope, deliverables,
        fees, and timelines for any engagement are set out in a separate written
        agreement, statement of work, or proposal between you and us. In the
        event of a conflict, that agreement governs over these Terms with
        respect to the specific engagement.
      </p>
    ),
  },
  {
    heading: "3. Consultations and enquiries",
    body: (
      <p>
        Booking a consultation or submitting an enquiry does not create a
        binding engagement or obligation on either party. Any information or
        recommendations shared during a consultation are provided for general
        discussion purposes and do not constitute professional, legal, or
        financial advice.
      </p>
    ),
  },
  {
    heading: "4. Acceptable use",
    body: (
      <>
        <p>You agree not to:</p>
        <ul>
          <li>Use the website or services for any unlawful, fraudulent, or harmful purpose.</li>
          <li>Attempt to gain unauthorized access to, disrupt, or interfere with the website, our systems, or other users.</li>
          <li>Introduce malware or any code intended to damage or impair the website or services.</li>
          <li>Reproduce, copy, or resell any part of the website or services without our prior written permission.</li>
        </ul>
      </>
    ),
  },
  {
    heading: "5. Intellectual property",
    body: (
      <p>
        Unless otherwise agreed in writing, all content on this website —
        including text, graphics, logos, and software — is owned by or licensed
        to ReadyMade Solution and is protected by applicable intellectual
        property laws. Ownership of deliverables created during a paid
        engagement is governed by the applicable engagement agreement.
      </p>
    ),
  },
  {
    heading: "6. Third-party links and tools",
    body: (
      <p>
        Our website may contain links to, or integrate with, third-party
        websites and tools (for example, scheduling providers). We are not
        responsible for the content, policies, or practices of any third party.
        Your use of third-party services is subject to their own terms.
      </p>
    ),
  },
  {
    heading: "7. Disclaimers",
    body: (
      <p>
        The website and any general information provided through it are made
        available on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis
        without warranties of any kind, whether express or implied, to the
        fullest extent permitted by law. We do not warrant that the website will
        be uninterrupted, error-free, or free of harmful components.
      </p>
    ),
  },
  {
    heading: "8. Limitation of liability",
    body: (
      <p>
        To the maximum extent permitted by applicable law, ReadyMade Solution
        will not be liable for any indirect, incidental, special, consequential,
        or punitive damages, or any loss of profits or revenues, arising out of
        or related to your use of the website. Nothing in these Terms limits
        liability that cannot be excluded or limited under applicable law.
      </p>
    ),
  },
  {
    heading: "9. Indemnification",
    body: (
      <p>
        You agree to indemnify and hold harmless ReadyMade Solution and its
        directors, officers, employees, and agents from any claims, damages, and
        expenses (including reasonable legal fees) arising from your misuse of
        the website or breach of these Terms.
      </p>
    ),
  },
  {
    heading: "10. Governing law",
    body: (
      <p>
        These Terms are governed by and construed in accordance with the laws of
        the Province of Alberta and the federal laws of Canada applicable
        therein, without regard to conflict-of-law principles. You agree to the
        exclusive jurisdiction of the courts located in Alberta, Canada.
      </p>
    ),
  },
  {
    heading: "11. Changes to these terms",
    body: (
      <p>
        We may update these Terms from time to time. When we do, we will revise
        the &ldquo;Last updated&rdquo; date above. Your continued use of the
        website after changes take effect constitutes acceptance of the updated
        Terms.
      </p>
    ),
  },
  {
    heading: "12. Contact us",
    body: (
      <p>
        Questions about these Terms can be sent to{" "}
        <a href="mailto:info@readymadesolution.com">info@readymadesolution.com</a>{" "}
        or by mail at 330 5th Avenue SW, Suite 1800, Calgary, Alberta, T2P 0L4,
        Canada.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="July 8, 2026"
      intro={
        <p>
          These Terms of Service set out the rules for using the ReadyMade
          Solution website and services. Please read them carefully before using
          the site.
        </p>
      }
      sections={sections}
    />
  );
}
