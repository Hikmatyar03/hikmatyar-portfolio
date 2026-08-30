"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { CaseStudy } from "@/lib/types";
import CategoryTag from "@/components/ui/CategoryTag";
import ToggleIcon from "@/components/ui/ToggleIcon";
import MediaBlock from "@/components/case-study/MediaBlock";

interface ExpandableCaseRowProps {
  study: CaseStudy;
  index: number;
}

/**
 * ExpandableCaseRow — Lama Lama accordion case study pattern.
 *
 * Collapsed by default: displays category tag, project title, year, and ( + ) control.
 * On click: expands downward to reveal preview media and description, morphing ( + ) to ( − ).
 */
export default function ExpandableCaseRow({ study, index }: ExpandableCaseRowProps) {
  const [expanded, setExpanded] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const slug =
    typeof study.slug === "string" ? study.slug : study.slug.current;

  const pillarName =
    study.pillar && typeof study.pillar === "object"
      ? study.pillar.name
      : String(study.pillar ?? "");

  const toggleExpand = () => setExpanded((prev) => !prev);

  return (
    <div className="border-b border-text/10 py-6 md:py-8 transition-colors duration-micro hover:border-text/30">
      {/* Row Header / Toggle Bar */}
      <div
        onClick={toggleExpand}
        className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 select-none"
        data-cursor="true"
        data-cursor-text={expanded ? "Close" : "Expand"}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleExpand();
          }
        }}
      >
        {/* Left side: Tag & Title */}
        <div className="flex flex-wrap items-center gap-4 md:gap-8">
          <span className="font-body text-eyebrow text-text/30 min-w-[2ch]">
            {String(index + 1).padStart(2, "0")}
          </span>

          <CategoryTag>{pillarName}</CategoryTag>

          <h3
            className="font-display text-text hover:text-accent transition-colors duration-micro"
            style={{
              fontSize: "clamp(1.5rem, 3.5vw, 2.75rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
            }}
          >
            {study.title}
          </h3>
        </div>

        {/* Right side: Year, Client & ( + / − ) Toggle */}
        <div className="flex items-center gap-6 self-end md:self-auto">
          {study.year && (
            <span className="font-body text-eyebrow uppercase tracking-widest text-text/40">
              {study.year}
            </span>
          )}

          <div className="flex items-center gap-2">
            <span className="font-body text-eyebrow uppercase tracking-widest text-text/40 hidden sm:inline">
              {expanded ? "View" : "Explore"}
            </span>
            <ToggleIcon open={expanded} />
          </div>
        </div>
      </div>

      {/* Expanded Content: Media preview, description & link to full case study */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="drawer"
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: {
                  duration: prefersReducedMotion ? 0.01 : 0.45,
                  ease: [0.4, 0, 0.2, 1],
                },
                opacity: {
                  duration: prefersReducedMotion ? 0.01 : 0.35,
                  delay: prefersReducedMotion ? 0 : 0.1,
                },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: {
                  duration: prefersReducedMotion ? 0.01 : 0.35,
                  ease: [0.4, 0, 0.2, 1],
                },
                opacity: { duration: prefersReducedMotion ? 0.01 : 0.2 },
              },
            }}
            className="overflow-hidden"
          >
            <div className="pt-8 pb-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Media Preview (Hero media or gallery item) */}
              <div className="lg:col-span-7">
                {study.heroMedia ? (
                  <MediaBlock
                    media={study.heroMedia}
                    aspectRatio="16 / 9"
                    className="w-full shadow-2xl rounded-2xl"
                  />
                ) : (
                  <div
                    className="w-full rounded-2xl bg-gradient-to-br from-text/10 via-text/5 to-transparent"
                    style={{ aspectRatio: "16 / 9" }}
                  />
                )}
              </div>

              {/* Summary & View Case CTA */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full gap-6">
                <div>
                  <p className="font-body text-eyebrow uppercase tracking-widest text-accent mb-3">
                    Project Overview
                  </p>
                  <p className="font-body text-body-lg text-text/80 leading-relaxed mb-6">
                    {study.description && study.description !== "[PLACEHOLDER COPY]"
                      ? study.description
                      : `${study.title} identity and design system crafted with intent.`}
                  </p>

                  {study.client && (
                    <div className="flex items-center gap-2 mb-4">
                      <span className="font-body text-eyebrow uppercase tracking-widest text-text/30">
                        Client:
                      </span>
                      <span className="font-body text-eyebrow uppercase tracking-widest text-text/60">
                        {study.client}
                      </span>
                    </div>
                  )}
                </div>

                <Link
                  href={`/work/${slug}`}
                  data-cursor="true"
                  data-cursor-text="View"
                  className="inline-flex items-center gap-3 font-body text-eyebrow uppercase tracking-widest text-accent hover:text-text transition-colors duration-micro self-start border border-accent/40 px-6 py-3 rounded-full hover:border-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <span>Open full case study</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
