import type { Metadata } from "next";
import { getCaseStudies, getServicePillars, getSiteSettings } from "@/lib/sanity";
import { getClientLogos } from "@/lib/logos";
import HeroSection from "@/components/home/HeroSection";
import FeaturedWork from "@/components/home/FeaturedWork";
import ServicesSection from "@/components/home/ServicesSection";
import AboutSection from "@/components/home/AboutSection";
import ScrollNavDots from "@/components/ui/ScrollNavDots";

export const metadata: Metadata = {
  title: "Hikmatyar — Brand Identity & Campaign Designer",
  description:
    "Independent brand identity designer and campaign strategist working with founders, studios, and creators. Brand systems built with intent, not templates.",
};

// ISR: revalidate every 60 s — matches sanityFetch default
export const revalidate = 60;

const HOME_SECTIONS = [
  { id: "hero", label: "Intro" },
  { id: "featured-work", label: "Work" },
  { id: "services", label: "Services" },
  { id: "about", label: "About" },
];

export default async function Home() {
  // Parallel data fetching — all queries fired simultaneously
  const [caseStudies, pillars, siteSettings] = await Promise.all([
    getCaseStudies(),
    getServicePillars(),
    getSiteSettings(),
  ]);

  // Load client logos dynamically from folder
  const clientLogos = getClientLogos();

  // 3 most recent case studies for Featured Work
  const featuredStudies = caseStudies?.slice(0, 3) ?? [];

  const headline =
    siteSettings?.heroHeadline ?? "Brand identity, built with intent.";

  // Only pass subline if it has real content (not placeholder)
  const subline =
    siteSettings?.heroSubline &&
    siteSettings.heroSubline !== "[PLACEHOLDER COPY]"
      ? siteSettings.heroSubline
      : undefined;

  return (
    <>
      {/* Scroll-synced vertical navigation dots on desktop (A7) */}
      <ScrollNavDots sections={HOME_SECTIONS} />

      {/* Section 1 — Hero */}
      <HeroSection headline={headline} subline={subline} />

      {/* Section 2 — Featured Work (3 most recent case studies from Sanity) */}
      {featuredStudies.length > 0 && (
        <FeaturedWork studies={featuredStudies} />
      )}

      {/* Section 3 — Services (three pillars, editorial masthead style) */}
      {pillars && pillars.length > 0 && (
        <ServicesSection pillars={pillars} />
      )}

      {/* Section 4 — About with dynamic client logo marquee */}
      <AboutSection
        copy={siteSettings?.aboutShortCopy}
        logos={clientLogos}
      />

      {/* Section 5 — Contact Strip is the shared Footer in layout.tsx */}
    </>
  );
}
