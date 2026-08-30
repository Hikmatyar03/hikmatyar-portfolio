"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ServicePillar } from "@/lib/types";
import SectionLabel from "@/components/ui/SectionLabel";
import CategoryTag from "@/components/ui/CategoryTag";

interface ServicesSectionProps {
  pillars: ServicePillar[];
}

export default function ServicesSection({ pillars }: ServicesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    const items = section.querySelectorAll<HTMLElement>("[data-pillar]");

    gsap.fromTo(
      items,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        // UX reason: reveals each service pillar one by one so the reader absorbs each before the next arrives
        duration: 0.65,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          once: true,
        },
      },
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  if (!pillars.length) return null;

  return (
    <section
      id="services"
      ref={sectionRef}
      className="container py-24 md:py-32 border-t border-text/10"
      aria-label="Services"
    >
      {/* Section Header with SectionLabel & bold short sentence */}
      <div className="mb-16 md:mb-20">
        <SectionLabel className="mb-4">Services &amp; Capabilities</SectionLabel>
        <h2
          className="font-display text-text text-3xl md:text-5xl"
          style={{ lineHeight: 1, letterSpacing: "-0.02em" }}
        >
          Three disciplines. One system.
        </h2>
      </div>

      <div className="grid grid-cols-mobile gap-y-8 gap-x-grid-mobile md:grid-cols-tablet md:gap-grid-tablet lg:grid-cols-desktop lg:gap-grid-laptop xl:gap-grid-desktop">
        {pillars.map((pillar) => (
          <div
            key={pillar._id}
            data-pillar
            style={{ opacity: 0 }}
            className="col-span-4 md:col-span-2 lg:col-span-4 flex flex-col justify-between p-7 md:p-9 rounded-3xl bg-white/[0.02] hover:bg-white/[0.045] border border-white/[0.08] hover:border-white/[0.18] backdrop-blur-xl transition-all duration-ui shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
          >
            <div>
              {/* Pillar name as eyebrow label */}
              <p className="font-body text-eyebrow uppercase tracking-widest text-accent mb-4">
                {pillar.name}
              </p>

              {/* One-line description — body-lg for reading weight */}
              <p className="font-body text-body-lg text-text/90 leading-relaxed mb-8">
                {pillar.oneLineDescription}
              </p>
            </div>

            {/* Capability chips using CategoryTag */}
            {pillar.capabilityWords && pillar.capabilityWords.length > 0 && (
              <div
                className="flex flex-wrap gap-2 pt-4 border-t border-white/[0.06]"
                aria-label={`${pillar.name} capabilities`}
              >
                {pillar.capabilityWords.map((word) => (
                  <CategoryTag key={word}>
                    {word}
                  </CategoryTag>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
