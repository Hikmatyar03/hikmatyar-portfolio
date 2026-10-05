"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CaseStudy } from "@/lib/types";
import ProjectCard from "@/components/work/ProjectCard";
import SectionLabel from "@/components/ui/SectionLabel";

const RotundaCarousel = dynamic(
  () => import("@/components/originkit/ui/rotunda-carousel"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-bg">
        <span className="font-body text-eyebrow uppercase tracking-widest text-text/30 animate-pulse">
          Loading 3D Archive...
        </span>
      </div>
    ),
  },
);

interface FeaturedWorkProps {
  studies: CaseStudy[];
}

// Alternating ratios for visual rhythm across the row
const RATIOS = ["portrait", "landscape", "portrait"] as const;

const FALLBACK_SHOWCASE_IMAGES = [
  { image: "/placeholder-media/studio-buntu/01.png" },
  { image: "/placeholder-media/shawls-and-soul/01-hero-flagship.png" },
  { image: "/placeholder-media/studio-buntu/02.png" },
  { image: "/placeholder-media/shawls-and-soul/04-packaging-unboxing.png" },
  { image: "/placeholder-media/studio-buntu/03.png" },
  { image: "/placeholder-media/shawls-and-soul/06-swat-editorial.png" },
  { image: "/placeholder-media/studio-buntu/04.png" },
  { image: "/placeholder-media/shawls-and-soul/02-brand-identity-board.png" },
];

export default function FeaturedWork({ studies }: FeaturedWorkProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [carouselState, setCarouselState] = useState<"loading" | "ready" | "fallback">("loading");

  const carouselImages = useMemo(() => {
    const extracted: { image: string }[] = [];
    studies.forEach((s) => {
      if (s.heroMedia?.url && !s.heroMedia.url.endsWith(".mp4") && !s.heroMedia.url.endsWith(".mov")) {
        extracted.push({ image: s.heroMedia.url });
      }
      s.gallery?.forEach((g) => {
        if (g.url && !g.url.endsWith(".mp4") && !g.url.endsWith(".mov")) {
          extracted.push({ image: g.url });
        }
      });
    });

    if (extracted.length >= 6) {
      return extracted.slice(0, 10);
    }
    return FALLBACK_SHOWCASE_IMAGES;
  }, [studies]);

  // Safety fallback: if 3D scene takes >4.5s (slow 3G / throttled network / WebGL delay), gracefully fall back
  useEffect(() => {
    const timer = setTimeout(() => {
      setCarouselState((prev) => (prev === "loading" ? "fallback" : prev));
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const cards = section.querySelectorAll<HTMLElement>("[data-reveal-card]");
      const header = section.querySelector<HTMLElement>("[data-reveal-header]");
      const rotunda = section.querySelector<HTMLElement>("[data-reveal-rotunda]");

      // Reveal section header first
      if (header) {
        gsap.fromTo(
          header,
          { opacity: 0 },
          {
            opacity: 1,
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

      // Reveal 3D Rotunda Carousel
      if (rotunda) {
        gsap.fromTo(
          rotunda,
          { opacity: 0, scale: 0.96 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: rotunda,
              start: "top 85%",
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
          duration: 0.65,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: rotunda || section,
            start: "bottom 80%",
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  if (!studies.length) return null;

  return (
    <section id="featured-work" ref={sectionRef} className="container py-24 md:py-32">
      {/* Section header with SectionLabel & bold short sentence */}
      <div
        data-reveal-header
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12 border-t border-text/10 pt-10"
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

        <div className="flex items-center gap-6">
          <span className="font-body text-eyebrow uppercase tracking-widest text-text/40 hidden sm:inline-block">
            {carouselState === "fallback" ? "[ ARCHIVE GALLERY ]" : "[ DRAG TO EXPLORE ]"}
          </span>
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
      </div>

      {/* 3D WebGL Rotunda Carousel Showcase or Resilient Fallback Grid */}
      <div
        data-reveal-rotunda
        className="w-full relative h-[420px] sm:h-[500px] md:h-[580px] lg:h-[640px] mb-16 md:mb-24 overflow-hidden border border-text/10 bg-bg select-none"
        style={{ opacity: 0 }}
      >
        {carouselState === "fallback" ? (
          /* Editorial Fallback Grid for Slow Connections / WebGL unavailable */
          <div className="w-full h-full p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 bg-bg overflow-hidden">
            {carouselImages.slice(0, 8).map((item, idx) => (
              <div
                key={idx}
                className="relative overflow-hidden border border-text/10 bg-white/[0.02] group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={`Archive artifact ${idx + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-ui ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-2 left-2 font-body text-[0.62rem] uppercase tracking-wider text-text/50">
                  {`0${idx + 1}`}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <RotundaCarousel
            images={carouselImages}
            background="#0E0E0E"
            gap={40}
            panelWidth={1500}
            panelHeight={1000}
            rounded={2}
            distance={76}
            tilt={0}
            speed={30}
            cursor={{ hover: 85, damping: 55 }}
            style={{ width: "100%", height: "100%" }}
            onReady={() => setCarouselState("ready")}
            onError={() => setCarouselState("fallback")}
          />
        )}
        
        {/* Subtle bottom edge gradient & interactive indicator */}
        <div className="absolute inset-x-0 bottom-0 pointer-events-none flex items-center justify-between p-4 md:p-6 bg-gradient-to-t from-bg/90 via-bg/20 to-transparent">
          <span className="font-body text-eyebrow uppercase tracking-widest text-text/60 bg-bg/80 px-3 py-1.5 border border-text/10">
            {carouselState === "fallback" ? "Studio Archive" : "3D Studio Archive"}
          </span>
          <span className="font-body text-eyebrow uppercase tracking-widest text-text/40">
            {carouselState === "fallback" ? "Curated Grid" : "Interactive Ring"}
          </span>
        </div>
      </div>

      {/* Case Study Cards Grid */}
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
