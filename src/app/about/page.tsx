import type { Metadata } from "next";
import AboutContent from "@/components/about/AboutContent";

export const metadata: Metadata = {
  title: "About — Hikmatyar",
  description:
    "Brand identity designer and growth strategist. I build identity systems, campaigns, and growth infrastructure — three disciplines that compound each other.",
};

export default function AboutPage() {
  return <AboutContent />;
}
