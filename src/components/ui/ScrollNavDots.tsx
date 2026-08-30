"use client";

import { useEffect, useState, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface NavSection {
  id: string;
  label: string;
}

interface ScrollNavDotsProps {
  sections: NavSection[];
}

/**
 * ScrollNavDots — fixed vertical scroll-spy dots indicator on the right edge.
 * Visible on desktop viewports. Shows active section label on hover and active state.
 */
export default function ScrollNavDots({ sections }: ScrollNavDotsProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || "");
  const prefersReducedMotion = useReducedMotion();
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!sections.length) return;

    const visibleSections = new Set<string>();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.add(entry.target.id);
          } else {
            visibleSections.delete(entry.target.id);
          }
        });

        // Pick the earliest section in DOM order that is intersecting
        for (const sec of sections) {
          if (visibleSections.has(sec.id)) {
            setActiveId(sec.id);
            break;
          }
        }
      },
      {
        rootMargin: "-20% 0px -50% 0px",
        threshold: 0,
      }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [sections]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  if (!sections.length) return null;

  return (
    <aside
      aria-label="Section navigation"
      className="hidden xl:flex fixed right-8 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-5"
    >
      {sections.map(({ id, label }) => {
        const isActive = activeId === id;

        return (
          <button
            key={id}
            onClick={() => scrollToSection(id)}
            data-cursor="true"
            data-cursor-text="Jump"
            className="group flex items-center gap-3 py-1 text-right focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            aria-current={isActive ? "true" : undefined}
            aria-label={`Jump to ${label}`}
          >
            {/* Label reveals on hover or when active */}
            <span
              className={`font-body text-eyebrow uppercase tracking-widest transition-all duration-micro ${
                isActive
                  ? "text-text opacity-100 translate-x-0"
                  : "text-text/30 opacity-0 translate-x-2 group-hover:opacity-80 group-hover:translate-x-0"
              }`}
            >
              {label}
            </span>

            {/* Dot / Indicator */}
            <div className="relative flex items-center justify-center w-3 h-3">
              <span
                className={`block rounded-full transition-all duration-micro ${
                  isActive
                    ? "w-2.5 h-2.5 bg-accent"
                    : "w-1.5 h-1.5 bg-text/30 group-hover:bg-text/70"
                }`}
              />
            </div>
          </button>
        );
      })}
    </aside>
  );
}
