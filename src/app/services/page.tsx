import type { Metadata } from "next";
import Link from "next/link";
import { getServicePillars } from "@/lib/sanity";
import SectionLabel from "@/components/ui/SectionLabel";
import CategoryTag from "@/components/ui/CategoryTag";

export const metadata: Metadata = {
  title: "Services — Hikmatyar",
  description:
    "Three core discipline pillars: Brand & Identity, Campaign & Content, and Growth & Automation. Systems built to scale businesses with intent.",
};

// ISR: 60s revalidation matching Sanity fetch defaults
export const revalidate = 60;

export default async function ServicesPage() {
  const pillars = await getServicePillars();

  // Fallback data matching AGENTS.md canonical pillar spec
  const defaultPillars = [
    {
      _id: "pillar-brand-identity",
      name: "Brand & Identity",
      slug: { _type: "slug" as const, current: "brand-identity" },
      oneLineDescription:
        "Brand strategy, identity systems, logo design, and comprehensive brand guidelines built for long-term equity.",
      capabilityWords: ["Brand Strategy", "Visual Identity", "Logo Design", "Guidelines"],
    },
    {
      _id: "pillar-campaign-content",
      name: "Campaign & Content",
      slug: { _type: "slug" as const, current: "campaign-content" },
      oneLineDescription:
        "High-impact campaign design, art direction, motion graphics, and strategic social launch content.",
      capabilityWords: ["Campaign Design", "Art Direction", "Motion Graphics", "Launch Systems"],
    },
    {
      _id: "pillar-growth-automation",
      name: "Growth & Automation",
      slug: { _type: "slug" as const, current: "growth-automation" },
      oneLineDescription:
        "AI automation workflows, B2B lead generation architecture, and high-converting outreach systems.",
      capabilityWords: ["AI Automation", "B2B Lead Gen", "Outreach Systems", "Growth Pipelines"],
    },
  ];

  const displayPillars = pillars && pillars.length > 0 ? pillars : defaultPillars;

  return (
    <div className="min-h-screen pt-32 pb-24 md:pt-40 md:pb-32">
      {/* Header section */}
      <div className="container mb-16 md:mb-24">
        <div className="grid grid-cols-mobile gap-grid-mobile md:grid-cols-tablet md:gap-grid-tablet lg:grid-cols-desktop lg:gap-grid-laptop xl:gap-grid-desktop">
          <div className="col-span-4 md:col-span-6 lg:col-span-10">
            <SectionLabel className="mb-4">
              Services &amp; Capabilities
            </SectionLabel>
            <h1
              className="font-display text-display text-text max-w-4xl"
              style={{ lineHeight: 0.9 }}
            >
              Three pillars engineered for compounding growth.
            </h1>
            <p className="font-body text-body-lg text-text/60 mt-8 max-w-2xl">
              I operate across identity design, campaign narrative, and growth automation — ensuring your brand is visually unmistakable and operationally built to scale.
            </p>
          </div>
        </div>
      </div>

      {/* Pillars Grid — Editorial masthead style */}
      <div className="container mb-24">
        <div className="grid grid-cols-mobile gap-grid-mobile md:grid-cols-tablet md:gap-grid-tablet lg:grid-cols-desktop lg:gap-grid-laptop xl:gap-grid-desktop border-t border-text/15 pt-12">
          {displayPillars.map((pillar, idx) => {
            const numLabel = `0${idx + 1}`;
            const slugStr = typeof pillar.slug === "string" ? pillar.slug : pillar.slug?.current || "";
            return (
              <div
                key={pillar._id}
                className="col-span-4 md:col-span-6 lg:col-span-4 flex flex-col justify-between p-8 md:p-10 bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] hover:border-white/[0.2] transition-all duration-ui"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-body text-eyebrow uppercase tracking-widest text-accent">
                      Pillar {numLabel}
                    </span>
                    <span className="font-body text-eyebrow uppercase tracking-widest text-text/30">
                      Hikmatyar Studio
                    </span>
                  </div>

                  <h2
                    className="font-display text-text mb-4"
                    style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", lineHeight: 1 }}
                  >
                    {pillar.name}
                  </h2>

                  <p className="font-body text-body text-text/65 mb-8">
                    {pillar.oneLineDescription}
                  </p>
                </div>

                <div>
                  {pillar.capabilityWords && pillar.capabilityWords.length > 0 && (
                    <div className="border-t border-white/[0.06] pt-6">
                      <p className="font-body text-eyebrow uppercase tracking-widest text-text/40 mb-3">
                        Capabilities
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {pillar.capabilityWords.map((cap) => (
                          <CategoryTag key={cap}>
                            {cap}
                          </CategoryTag>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-8 pt-4">
                    <Link
                      href={`/work?pillar=${slugStr}`}
                      data-cursor="true"
                      data-cursor-text="Explore"
                      className="inline-flex items-center gap-2 font-body text-eyebrow uppercase tracking-widest text-text hover:text-accent transition-colors duration-micro ease-micro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      View related work &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Process / Mindset Section */}
      <div className="container mb-24">
        <div className="border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl rounded-3xl p-10 md:p-14">
          <div className="grid grid-cols-mobile gap-grid-mobile md:grid-cols-tablet md:gap-grid-tablet lg:grid-cols-desktop lg:gap-grid-laptop xl:gap-grid-desktop">
            <div className="col-span-4 md:col-span-6 lg:col-span-4">
              <SectionLabel className="mb-3">Working Model</SectionLabel>
              <h3 className="font-display text-text text-3xl">
                Direct engagement. Zero layers.
              </h3>
            </div>
            <div className="col-span-4 md:col-span-6 lg:col-span-8">
              <p className="font-body text-body-lg text-text/70 mb-6">
                You work directly with me. No account managers, no junior hand-offs, no bloated retainers. Every strategic decision and design asset is crafted personally with clarity and speed.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
                <div>
                  <h4 className="font-body text-eyebrow uppercase tracking-widest text-text mb-2">
                    01 / Strategy First
                  </h4>
                  <p className="font-body text-body text-text/55">
                    We clarify position, audience, and commercial objective before generating visual concepts.
                  </p>
                </div>
                <div>
                  <h4 className="font-body text-eyebrow uppercase tracking-widest text-text mb-2">
                    02 / High-Velocity Execution
                  </h4>
                  <p className="font-body text-body text-text/55">
                    Focused sprints that move from alignment to final delivery without endless revisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="container text-center py-12">
        <h3 className="font-display text-text text-4xl md:text-5xl mb-6">
          Have a project in mind?
        </h3>
        <p className="font-body text-body-lg text-text/60 max-w-xl mx-auto mb-8">
          Let&apos;s build an identity or growth pipeline tailored to your next growth phase.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/contact"
            data-cursor="true"
            data-cursor-text="Let's Go"
            className="w-full sm:w-auto inline-flex items-center justify-center font-body text-eyebrow uppercase tracking-widest px-8 py-4 bg-accent text-bg hover:bg-accent/90 transition-colors duration-micro ease-micro rounded-full shadow-[0_0_24px_rgba(255,74,74,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Start a project
          </Link>
          <a
            href="mailto:hikmodesiner03@gmail.com"
            data-cursor="true"
            data-cursor-text="Contact"
            className="w-full sm:w-auto inline-flex items-center justify-center font-body text-eyebrow uppercase tracking-widest px-8 py-4 border border-white/[0.15] bg-white/[0.03] backdrop-blur-md text-text hover:border-white/[0.3] hover:text-accent transition-all duration-micro ease-micro rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Book a call
          </a>
        </div>
      </div>
    </div>
  );
}
