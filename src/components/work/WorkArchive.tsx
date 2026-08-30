"use client";

import { useState, useMemo, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CaseStudy, ServicePillar } from "@/lib/types";
import ProjectCard from "@/components/work/ProjectCard";
import ExpandableCaseRow from "@/components/work/ExpandableCaseRow";

interface WorkArchiveProps {
  studies: CaseStudy[];
  pillars: ServicePillar[];
}

// Alternating portrait/landscape/portrait for varied visual rhythm
const RATIOS = ["portrait", "landscape", "portrait"] as const;

function getPillarSlug(pillar: ServicePillar): string {
  return typeof pillar.slug === "string" ? pillar.slug : pillar.slug.current;
}

function getStudyPillarSlug(study: CaseStudy): string {
  if (!study.pillar || typeof study.pillar !== "object") return String(study.pillar ?? "");
  const slug = study.pillar.slug;
  return typeof slug === "string" ? slug : slug.current;
}

export default function WorkArchive({ studies, pillars }: WorkArchiveProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"rows" | "grid">("rows");
  const groupId = useId();

  // Client-side filter — no fetch on filter change
  const filtered = useMemo(() => {
    if (!activeFilter) return studies;
    return studies.filter((s) => getStudyPillarSlug(s) === activeFilter);
  }, [studies, activeFilter]);

  const activePillarName = useMemo(() => {
    if (!activeFilter) return null;
    return pillars.find((p) => getPillarSlug(p) === activeFilter)?.name ?? null;
  }, [activeFilter, pillars]);

  const toggleFilter = (slug: string) =>
    setActiveFilter((prev) => (prev === slug ? null : slug));

  const filterBtnClass = (isActive: boolean) =>
    [
      "font-body text-eyebrow uppercase tracking-widest px-4 py-2 rounded-full border backdrop-blur-md",
      "transition-all duration-micro ease-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
      isActive
        ? "border-accent text-accent bg-accent/[0.08] shadow-sm"
        : "border-white/[0.1] bg-white/[0.03] text-text/60 hover:border-white/[0.2] hover:text-text",
    ].join(" ");

  return (
    <div className="container pb-24 md:pb-32">
      {/* ── Filter & View Toggle Controls ── */}
      <div className="border-t border-white/[0.08] pt-8 mb-16 md:mb-20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Pillar filter buttons */}
        <div
          role="group"
          aria-label="Filter projects by service pillar"
          className="flex flex-wrap items-center gap-2.5"
        >
          {/* All */}
          <button
            id={`${groupId}-filter-all`}
            aria-pressed={activeFilter === null}
            onClick={() => setActiveFilter(null)}
            data-cursor="true"
            data-cursor-text="Filter"
            className={filterBtnClass(activeFilter === null)}
          >
            All ({studies.length})
          </button>

          {pillars.map((pillar) => {
            const slug = getPillarSlug(pillar);
            const isActive = activeFilter === slug;
            const count = studies.filter((s) => getStudyPillarSlug(s) === slug).length;

            return (
              <button
                key={pillar._id}
                id={`${groupId}-filter-${slug}`}
                aria-pressed={isActive}
                onClick={() => toggleFilter(slug)}
                data-cursor="true"
                data-cursor-text="Filter"
                className={filterBtnClass(isActive)}
              >
                {pillar.name} {count > 0 ? `(${count})` : ""}
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle: Accordion Rows vs Card Grid */}
        <div className="flex items-center gap-1.5 border border-white/[0.1] bg-white/[0.03] p-1 rounded-full backdrop-blur-md self-start md:self-auto">
          <button
            onClick={() => setViewMode("rows")}
            data-cursor="true"
            data-cursor-text="List"
            className={`font-body text-eyebrow uppercase tracking-widest px-4 py-1.5 rounded-full transition-all duration-micro ${
              viewMode === "rows"
                ? "bg-white/[0.12] text-text border border-white/[0.15] shadow-sm"
                : "text-text/50 hover:text-text"
            }`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode("grid")}
            data-cursor="true"
            data-cursor-text="Grid"
            className={`font-body text-eyebrow uppercase tracking-widest px-4 py-1.5 rounded-full transition-all duration-micro ${
              viewMode === "grid"
                ? "bg-white/[0.12] text-text border border-white/[0.15] shadow-sm"
                : "text-text/50 hover:text-text"
            }`}
          >
            Grid
          </button>
        </div>

        {/* Screen-reader live region — announces filter result count */}
        <p
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {activePillarName
            ? `Showing ${filtered.length} ${activePillarName} project${filtered.length !== 1 ? "s" : ""}`
            : `Showing all ${filtered.length} projects`}
        </p>
      </div>

      {/* ── Content View: Expandable Case Rows OR Card Grid ── */}
      <AnimatePresence mode="wait" initial={false}>
        {filtered.length === 0 ? (
          <motion.div
            key={`empty-${activeFilter}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
            className="py-24"
            role="status"
          >
            <p className="font-body text-body-lg text-text/40">
              {activePillarName
                ? `Case studies for ${activePillarName} coming soon.`
                : "No case studies yet."}
            </p>
          </motion.div>
        ) : viewMode === "rows" ? (
          <motion.div
            key={`rows-${activeFilter}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
            className="border-t border-text/10"
            role="list"
            aria-label="Case studies list"
          >
            {filtered.map((study, i) => (
              <ExpandableCaseRow
                key={study._id}
                study={study}
                index={i}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key={`grid-${activeFilter}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
            className="grid grid-cols-mobile gap-y-16 gap-x-grid-mobile md:grid-cols-tablet md:gap-grid-tablet lg:grid-cols-desktop lg:gap-grid-laptop xl:gap-grid-desktop"
            role="list"
            aria-label="Case studies grid"
          >
            {filtered.map((study, i) => (
              <div
                key={study._id}
                role="listitem"
                className={[
                  "col-span-4 md:col-span-3 lg:col-span-4",
                  i % 3 === 1 ? "lg:mt-20" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <ProjectCard
                  study={study}
                  ratio={RATIOS[i % 3]}
                  index={i}
                />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
