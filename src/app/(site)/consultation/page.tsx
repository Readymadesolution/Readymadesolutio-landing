import type { Metadata } from "next";
import ConsultationWizard from "@/components/consultation/ConsultationWizard";

export const metadata: Metadata = {
  title: "Book a Consultation — ReadyMade Solution",
  description:
    "A free 30-minute call with our team. Tell us a bit about what you need and pick a time that works for you.",
};

export default function ConsultationPage() {
  return <ConsultationWizard />;
}
