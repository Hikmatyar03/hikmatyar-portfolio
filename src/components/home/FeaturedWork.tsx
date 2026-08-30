"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CaseStudy } from "@/lib/types";
import ProjectCard from "@/components/work/ProjectCard";
import SectionLabel from "@/components/ui/SectionLabel";

interface FeaturedWorkProps {
  studies: CaseStudy[];
}

// Alternating ratios for visual rhythm across the row
const RATIOS = ["portrait", "landscape", "portrait"] as const;

export default function FeaturedWork({ studies }: FeaturedWorkProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    const cards = section.querySelectorAll<HTMLElement>("[data-reveal-card]");
    const header = section.querySelector<HTMLElement>("[data-reveal-header]");

    // Reveal section header first
    if (header) {
      gsap.fromTo(
        header,
        { opacity: 0 },
        {
          opacity: 1,
          // UX reason: header fade-in frames the work section before the cards stagger in
          duration: 0.65,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            once: true,
          },
        },
      );
    }

    // Cards stagger in with a vertical settle
    gsap.fromTo(
      cards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        // UX reason: staggered card reveal lets each project land independently, giving the work room to breathe
        duration: 0.65,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          once: true,
        },
      },
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  if (!studies.length) return null;

  return (
    <section id="featured-work" ref={sectionRef} className="container py-24 md:py-32">
      {/* Section header with SectionLabel & bold short sentence */}
      <div
        data-reveal-header
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16 border-t border-text/10 pt-10"
        style={{ opacity: 0 }}
      >
        <div>
          <SectionLabel className="mb-4">Selected work</SectionLabel>
          <h2
            className="font-display text-text text-3xl md:text-5xl"
            style={{ lineHeight: 1, letterSpacing: "-0.02em" }}
          >
            Built with intent.
          </h2>
        </div>

        <Link
          href="/work"
          id="featured-work-all-link"
          data-cursor="true"
          data-cursor-text="View All"
          className="font-body text-eyebrow uppercase tracking-widest text-text/50 hover:text-accent transition-colors duration-micro ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          All work (4) →
        </Link>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-mobile gap-y-12 gap-x-grid-mobile md:grid-cols-tablet md:gap-grid-tablet lg:grid-cols-desktop lg:gap-grid-laptop xl:gap-grid-desktop">
        {studies.map((study, i) => (
          <div
            key={study._id}
            data-reveal-card
            style={{ opacity: 0 }}
            className={[
              "col-span-4 md:col-span-3 lg:col-span-4",
              // Centre card is offset vertically on desktop to break the rigid row rhythm
              i === 1 ? "lg:mt-20" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <ProjectCard study={study} ratio={RATIOS[i % 3]} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
