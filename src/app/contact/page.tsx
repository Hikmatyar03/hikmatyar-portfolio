import type { Metadata } from "next";
import ContactFlow from "@/components/contact/ContactFlow";

export const metadata: Metadata = {
  title: "Contact — Hikmatyar",
  description:
    "Start a brand identity, campaign, or growth project. Tell me what you're working on.",
};

export default function ContactPage() {
  return <ContactFlow />;
}
