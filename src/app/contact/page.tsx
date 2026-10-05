import type { Metadata } from "next";
import ContactFlow from "@/components/contact/ContactFlow";

export const metadata: Metadata = {
  title: "Start a Project",
  description:
    "Tell me about your brand identity or campaign project. Direct response within 48 hours, no middle layers.",
};

export default function ContactPage() {
  return <ContactFlow />;
}
