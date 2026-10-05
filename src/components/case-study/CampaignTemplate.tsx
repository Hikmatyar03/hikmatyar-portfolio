"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CaseStudy } from "@/lib/types";
import MediaBlock from "./MediaBlock";
import NextProjectCard from "./NextProjectCard";
import CaseStudySidebar from "./CaseStudySidebar";

interface CampaignTemplateProps {
  study: CaseStudy;
  nextStudy: CaseStudy | null;
}

const EASE: [number, number, number, number] = [0, 0, 0.2, 1];
const PLACEHOLDER = "[PLACEHOLDER COPY]";

function isPlaceholder(v?: string | null): boolean {
  return !v || v === PLACEHOLDER;
}

export default function CampaignTemplate({ study, nextStudy }: CampaignTemplateProps) {
  const prefersReducedMotion = useReducedMotion();
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollStripRef = useRef<HTMLDivElement>(null);

  const pillarName =
    study.pillar && typeof study.pillar === "object"
      ? study.pillar.name
      : String(study.pillar ?? "");

  const rm = prefersReducedMotion;
  const HERO_DURATION = rm ? 0.01 : 0.65;

  // Build sidebar nav items
  const sidebarItems = [
    !isPlaceholder(study.brief) && { id: "cc-brief", label: "Brief" },
    !isPlaceholder(study.concept) && { id: "cc-concept", label: "Concept" },
    study.gallery && study.gallery.length > 0 && { id: "cc-execution", label: "Execution" },
    !isPlaceholder(study.reach) && { id: "cc-reach", label: "Reach" },
  ].filter(Boolean) as { id: string; label: string }[];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const container = contentRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const sections = container.querySelectorAll<HTMLElement>("[data-section]");

      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: rm ? 0 : 28 },
          {
            opacity: 1,
            y: 0,
            // UX reason: scroll-triggered reveal lets each campaign beat land one at a time
            duration: rm ? 0.01 : 0.65,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              once: true,
            },
          },
        );
      });
    }, contentRef);

    return () => ctx.revert();
  }, [rm]);

  // GSAP horizontal scroll drag for execution gallery strip
  // UX reason: horizontal snap strip lets the viewer flick through campaign frames
  // at their own pace, mirroring how campaign content is consumed on social feeds
  useEffect(() => {
    const strip = scrollStripRef.current;
    if (!strip || rm) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      strip.style.cursor = "grabbing";
      startX = e.pageX - strip.offsetLeft;
      scrollLeft = strip.scrollLeft;
    };
    const onMouseLeave = () => {
      isDown = false;
      strip.style.cursor = "grab";
    };
    const onMouseUp = () => {
      isDown = false;
      strip.style.cursor = "grab";
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - strip.offsetLeft;
      const walk = (x - startX) * 1.5;
      strip.scrollLeft = scrollLeft - walk;
    };

    strip.style.cursor = "grab";
    strip.addEventListener("mousedown", onMouseDown);
    strip.addEventListener("mouseleave", onMouseLeave);
    strip.addEventListener("mouseup", onMouseUp);
    strip.addEventListener("mousemove", onMouseMove);

    return () => {
      strip.removeEventListener("mousedown", onMouseDown);
      strip.removeEventListener("mouseleave", onMouseLeave);
      strip.removeEventListener("mouseup", onMouseUp);
      strip.removeEventListener("mousemove", onMouseMove);
    };
  }, [rm]);

  return (
    <article>
      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <header className="container pt-32 md:pt-40 pb-0">
        <div className="grid grid-cols-mobile gap-grid-mobile md:grid-cols-tablet md:gap-grid-tablet lg:grid-cols-desktop lg:gap-grid-laptop xl:gap-grid-desktop">
          <div className="col-span-4 md:col-span-5 lg:col-span-9">

            {/* Breadcrumb */}
            <motion.p
              className="font-body text-eyebrow uppercase tracking-widest text-text/35 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: HERO_DURATION, ease: EASE }}
            >
              <Link
                href="/work"
                className="hover:text-accent transition-colors duration-micro ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Work
              </Link>
              {" / "}
              <span className="text-accent">{pillarName}</span>
            </motion.p>

            {/* Title */}
            <motion.h1
              className="font-display text-display text-text"
              style={{ lineHeight: 0.88 }}
              initial={{ opacity: 0, y: rm ? 0 : 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: HERO_DURATION, ease: EASE, delay: rm ? 0 : 0.1 }}
            >
              {study.title}
            </motion.h1>

            {/* Meta */}
            <motion.div
              className="flex flex-wrap gap-x-6 gap-y-1 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: HERO_DURATION, ease: EASE, delay: rm ? 0 : 0.22 }}
            >
              {study.client && (
                <span className="font-body text-eyebrow uppercase tracking-widest text-text/45">
                  {study.client}
                </span>
              )}
              {study.year && (
                <span className="font-body text-eyebrow uppercase tracking-widest text-text/35">
                  {study.year}
                </span>
              )}
            </motion.div>
          </div>
        </div>

        {/* Hero media */}
        <motion.div
          className="mt-12 overflow-hidden rounded-3xl border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
          initial={{ opacity: 0, y: rm ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: HERO_DURATION, ease: EASE, delay: rm ? 0 : 0.3 }}
        >
          {study.heroMedia ? (
            <MediaBlock media={study.heroMedia} aspectRatio="16 / 9" priority />
          ) : (
            <div
              className="w-full rounded-3xl bg-gradient-to-br from-text/8 via-text/4 to-transparent"
              style={{ aspectRatio: "16 / 9" }}
              aria-hidden="true"
            />
          )}
        </motion.div>
      </header>

      {/* ══════════════════════════════════════════
          CONTENT — sidebar + main
      ══════════════════════════════════════════ */}
      <div ref={contentRef} className="container">
        {/* Sidebar + content wrapper */}
        <div className="xl:flex xl:gap-16 xl:items-start">
          {/* Sticky sidebar */}
          {sidebarItems.length > 1 && (
            <div className="hidden xl:block w-48 flex-shrink-0 pt-20">
              <CaseStudySidebar items={sidebarItems} />
            </div>
          )}

          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* ── Brief ── */}
            {!isPlaceholder(study.brief) && (
              <div
                id="cc-brief"
                data-section="cc-brief"
                className="py-20 md:py-24 border-t border-text/10"
                style={{ opacity: 0 }}
              >
                <div className="grid grid-cols-mobile gap-grid-mobile md:grid-cols-tablet md:gap-grid-tablet lg:grid-cols-desktop lg:gap-grid-laptop xl:gap-grid-desktop">
                  <div className="col-span-4 md:col-span-2 lg:col-span-2 mb-4 md:mb-0">
                    <p className="font-body text-eyebrow uppercase tracking-widest text-text/35">
                      Brief
                    </p>
                  </div>
                  <div className="col-span-4 md:col-span-4 lg:col-span-7">
                    <p className="font-body text-body-lg text-text/80 leading-relaxed">
                      {study.brief}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── Concept — editorial pull-quote ──
                Full-width, centered, display-scale type with accent border.
                Intentionally breaks the 2-col layout to create a moment.
            ── */}
            {!isPlaceholder(study.concept) && (
              <div
                id="cc-concept"
                data-section="cc-concept"
                className="py-24 md:py-36 border-t border-text/10"
                style={{ opacity: 0 }}
              >
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto px-4">
                  <p className="font-body text-eyebrow uppercase tracking-widest text-text/35 mb-10">
                    Concept
                  </p>

                  {/* Divider line above quote */}
                  <div
                    className="w-8 mb-10"
                    style={{ height: "2px", background: "var(--accent)" }}
                    aria-hidden="true"
                  />

                  {/* The campaign idea — given real typographic space */}
                  <blockquote className="m-0 p-0">
                    <p
                      className="font-display text-text"
                      style={{
                        fontSize: "clamp(1.875rem, 4vw, 3.5rem)",
                        lineHeight: 1.08,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      &ldquo;{study.concept}&rdquo;
                    </p>
                  </blockquote>
                </div>
              </div>
            )}

            {/* ── Execution — horizontal scroll gallery strip ── */}
            {study.gallery && study.gallery.length > 0 && (
              <div
                id="cc-execution"
                data-section="cc-execution"
                className="py-20 md:py-24 border-t border-text/10"
                style={{ opacity: 0 }}
              >
                <div className="mb-8">
                  <p className="font-body text-eyebrow uppercase tracking-widest text-text/35">
                    Execution
                  </p>
                </div>

                {/* Horizontal scroll strip — draggable, scroll-snap */}
                <div
                  ref={scrollStripRef}
                  className="flex gap-4 overflow-x-auto pb-4 select-none"
                  style={{
                    scrollSnapType: "x mandatory",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    WebkitOverflowScrolling: "touch",
                  }}
                >
                  <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
                  {study.gallery.map((media, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0"
                      style={{
                        width: i === 0 ? "75vw" : "45vw",
                        maxWidth: i === 0 ? "800px" : "480px",
                        scrollSnapAlign: "start",
                      }}
                    >
                      <MediaBlock
                        media={media}
                        aspectRatio={i === 0 ? "16 / 9" : "4 / 5"}
                      />
                    </div>
                  ))}
                  {/* End spacer */}
                  <div className="flex-shrink-0 w-8" aria-hidden="true" />
                </div>

                {/* Drag hint — appears once, fades on first interaction */}
                <p className="font-body text-eyebrow uppercase tracking-widest text-text/25 mt-4">
                  Drag to explore →
                </p>
              </div>
            )}

            {/* ── Reach ── */}
            {!isPlaceholder(study.reach) && (
              <div
                id="cc-reach"
                data-section="cc-reach"
                className="py-20 md:py-24 border-t border-text/10"
                style={{ opacity: 0 }}
              >
                <div className="grid grid-cols-mobile gap-grid-mobile md:grid-cols-tablet md:gap-grid-tablet lg:grid-cols-desktop lg:gap-grid-laptop xl:gap-grid-desktop">
                  <div className="col-span-4 md:col-span-2 lg:col-span-2 mb-4 md:mb-0">
                    <p className="font-body text-eyebrow uppercase tracking-widest text-text/35">
                      Reach
                    </p>
                  </div>
                  <div className="col-span-4 md:col-span-4 lg:col-span-6">
                    <p className="font-body text-body-lg text-text/80 leading-relaxed">
                      {study.reach}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Next project ── */}
      {nextStudy && <NextProjectCard study={nextStudy} />}
    </article>
  );
}
