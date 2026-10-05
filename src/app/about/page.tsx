import type { Metadata } from "next";
import AboutContent from "@/components/about/AboutContent";

export const metadata: Metadata = {
  title: "About",
  description:
    "I design the systems that make a brand recognizable and the campaigns that make it heard. Direct engagement, zero account managers, zero junior hand-offs.",
};

export default function AboutPage() {
  return <AboutContent />;
}
