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

interface IdentityTemplateProps {
  study: CaseStudy;
  nextStudy: CaseStudy | null;
}

const EASE: [number, number, number, number] = [0, 0, 0.2, 1];
const PLACEHOLDER = "[PLACEHOLDER COPY]";

function isPlaceholder(v?: string | null): boolean {
  return !v || v === PLACEHOLDER;
}

/** Editorial section — label column left (2 cols), content right (8 cols). */
function Section({
  label,
  id,
  children,
  contentClass = "",
}: {
  label: string;
  id: string;
  children: React.ReactNode;
  contentClass?: string;
}) {
  return (
    <div
      id={id}
      data-section={id}
      className="py-20 md:py-28 border-t border-text/10"
      style={{ opacity: 0 }} // GSAP animates from 0
    >
      <div className="grid grid-cols-mobile gap-grid-mobile md:grid-cols-tablet md:gap-grid-tablet lg:grid-cols-desktop lg:gap-grid-laptop xl:gap-grid-desktop">
        {/* Label column */}
        <div className="col-span-4 md:col-span-2 lg:col-span-2 mb-4 md:mb-0">
          <p className="font-body text-eyebrow uppercase tracking-widest text-text/35 md:pt-1">
            {label}
          </p>
        </div>
        {/* Content column */}
        <div className={`col-span-4 md:col-span-4 lg:col-span-8 ${contentClass}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function IdentityTemplate({ study, nextStudy }: IdentityTemplateProps) {
  const prefersReducedMotion = useReducedMotion();
  const contentRef = useRef<HTMLDivElement>(null);

  const pillarName =
    study.pillar && typeof study.pillar === "object"
      ? study.pillar.name
      : String(study.pillar ?? "");

  const rm = prefersReducedMotion;
  const HERO_DURATION = rm ? 0.01 : 0.65;

  // Split gallery between Identity System assets (system architecture, boards, moodboards)
  // and Applications (collateral, packaging, editorial, touchpoints) so no images are duplicated
  const isPartitioned = Boolean(study.gallery && study.gallery.length > 2);
  const identityMedia = isPartitioned
    ? (study.gallery?.slice(0, 2) ?? [])
    : (study.gallery ?? []);
  const applicationMedia = isPartitioned
    ? (study.gallery?.slice(2) ?? [])
    : [];

  const hasIdentitySection = !isPlaceholder(study.identitySystemNotes) || identityMedia.length > 0;
  const hasApplicationsSection = applicationMedia.length > 0;

  // Build sidebar nav items — only include sections that have real content
  const sidebarItems = [
    !isPlaceholder(study.context) && { id: "cs-context", label: "Context" },
    !isPlaceholder(study.challenge) && { id: "cs-challenge", label: "Challenge" },
    !isPlaceholder(study.strategicIdea) && { id: "cs-strategy", label: "Strategy" },
    hasIdentitySection && {
      id: "cs-identity",
      label: "Identity",
    },
    hasApplicationsSection && { id: "cs-applications", label: "Applications" },
    !isPlaceholder(study.outcome) && { id: "cs-outcome", label: "Outcome" },
    !study.isOwnVenture && study.credits && study.credits.length > 0 && {
      id: "cs-credits",
      label: "Credits",
    },
  ].filter(Boolean) as { id: string; label: string }[];

  // GSAP: scroll-trigger reveals for all [data-section] blocks
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
            // UX reason: scroll-reveal paces the narrative — each case study section lands before the next appears
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

  return (
    <article>
      {/* ══════════════════════════════════════════
          HERO — full-bleed media with title dock
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
              // UX reason: title settle confirms arrival at the project page
              transition={{ duration: HERO_DURATION, ease: EASE, delay: rm ? 0 : 0.1 }}
            >
              {study.title}
            </motion.h1>

            {/* Meta row */}
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
              {study.isOwnVenture && (
                <span className="font-body text-eyebrow uppercase tracking-widest text-accent">
                  Own venture
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

        {/* Hero media — full container width, 21:9 on desktop */}
        <motion.div
          className="mt-12 overflow-hidden rounded-3xl border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
          initial={{ opacity: 0, y: rm ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: HERO_DURATION, ease: EASE, delay: rm ? 0 : 0.3 }}
        >
          {study.heroMedia ? (
            <MediaBlock
              media={study.heroMedia}
              aspectRatio="16 / 9"
              priority
            />
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
          CONTENT — sidebar + main content columns
      ══════════════════════════════════════════ */}
      <div className="container mt-0" ref={contentRef}>
        {/* Own-venture dev flag */}
        {study.isOwnVenture && process.env.NODE_ENV === "development" && (
          <div className="mt-8 py-3 px-5 border border-accent/30 rounded-full bg-accent/[0.05]">
            <p className="font-body text-eyebrow uppercase tracking-widest text-accent">
              [Dev] Own venture — write Context &amp; Outcome in first-person founder voice
            </p>
          </div>
        )}

        {/* Sidebar + content wrapper */}
        <div className="xl:flex xl:gap-16 xl:items-start">
          {/* Sticky sidebar — desktop only */}
          {sidebarItems.length > 1 && (
            <div className="hidden xl:block w-48 flex-shrink-0 pt-20">
              <CaseStudySidebar items={sidebarItems} />
            </div>
          )}

          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* ── Context ── */}
            {!isPlaceholder(study.context) && (
              <Section label="Context" id="cs-context">
                <p className="font-body text-body-lg text-text/80 leading-relaxed">
                  {study.context}
                </p>
              </Section>
            )}

            {/* ── Challenge ── */}
            {!isPlaceholder(study.challenge) && (
              <Section label="Challenge" id="cs-challenge">
                <p className="font-body text-body-lg text-text/80 leading-relaxed">
                  {study.challenge}
                </p>
              </Section>
            )}

            {/* ── Strategic Idea — editorial pull-quote treatment ── */}
            {!isPlaceholder(study.strategicIdea) && (
              <Section label="Strategic idea" id="cs-strategy">
                <blockquote
                  className="relative pl-6 m-0"
                  style={{
                    borderLeft: "3px solid var(--accent)",
                  }}
                >
                  <p
                    className="font-display text-text"
                    style={{
                      fontSize: "clamp(1.75rem, 3.5vw, 3rem)",
                      lineHeight: 1.08,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {study.strategicIdea}
                  </p>
                </blockquote>
              </Section>
            )}

            {/* ── Identity System Notes + gallery ── */}
            {hasIdentitySection && (
              <Section label="Identity system" id="cs-identity">
                {!isPlaceholder(study.identitySystemNotes) && (
                  <p className="font-body text-body-lg text-text/80 leading-relaxed mb-10">
                    {study.identitySystemNotes}
                  </p>
                )}

                {identityMedia.length > 0 ? (
                  <div className={`grid ${identityMedia.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"} gap-4 md:gap-6`}>
                    {identityMedia.map((media, i) => (
                      <div
                        key={i}
                        className={
                          identityMedia.length === 1 || (identityMedia.length === 3 && i === 0)
                            ? "col-span-full"
                            : "col-span-1"
                        }
                      >
                        <MediaBlock
                          media={media}
                          aspectRatio={
                            identityMedia.length === 1 || media.url?.includes("board") || media.url?.includes("system")
                              ? "16 / 10"
                              : "3 / 2"
                          }
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Dev placeholder asset grid */
                  process.env.NODE_ENV === "development" && (
                    <div className="grid grid-cols-2 gap-4">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`rounded-sharp bg-gradient-to-br from-text/8 via-text/4 to-transparent relative ${i === 2 ? "col-span-2" : "col-span-1"}`}
                          style={{ aspectRatio: i === 2 ? "16/9" : i % 2 === 0 ? "4/5" : "3/2" }}
                        >
                          <span className="absolute top-2 left-2 bg-accent text-bg font-body text-eyebrow uppercase tracking-widest px-2 py-1 rounded-sharp">
                            Placeholder — replace
                          </span>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </Section>
            )}

            {/* ── Applications / Full gallery ── */}
            {hasApplicationsSection && (
              <Section label="Applications" id="cs-applications">
                {/* First item: wide hero shot */}
                <div className="mb-4 md:mb-6">
                  <MediaBlock
                    media={applicationMedia[0]}
                    aspectRatio="16 / 9"
                  />
                </div>
                {/* Remaining items: alternating portrait pairs */}
                {applicationMedia.length > 1 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    {applicationMedia.slice(1).map((media, i) => (
                      <div key={i} className="col-span-1">
                        <MediaBlock
                          media={media}
                          aspectRatio={
                            media.url?.includes("editorial") || media.url?.includes("swat")
                              ? "4 / 5"
                              : i % 2 === 0
                              ? "4 / 5"
                              : "3 / 2"
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}
              </Section>
            )}

            {/* ── Outcome ── */}
            {!isPlaceholder(study.outcome) && (
              <Section label="Outcome" id="cs-outcome">
                <p className="font-body text-body-lg text-text/80 leading-relaxed">
                  {study.outcome}
                </p>
              </Section>
            )}

            {/* ── Credits — only if not own venture and credits exist ── */}
            {!study.isOwnVenture &&
              study.credits &&
              study.credits.length > 0 && (
                <Section label="Credits" id="cs-credits">
                  <ul className="flex flex-col gap-3 list-none m-0 p-0">
                    {study.credits.map((credit, i) => (
                      <li
                        key={i}
                        className="font-body text-body text-text/60 flex gap-4"
                      >
                        {credit.name && (
                          <span className="text-text">{credit.name}</span>
                        )}
                        {credit.role && <span>{credit.role}</span>}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}
          </div>
        </div>
      </div>

      {/* ── Next project ── */}
      {nextStudy && <NextProjectCard study={nextStudy} />}
    </article>
  );
}
