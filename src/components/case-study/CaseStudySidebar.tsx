"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface SidebarItem {
  id: string;
  label: string;
}

interface CaseStudySidebarProps {
  items: SidebarItem[];
}

/**
 * Sticky scroll-spy sidebar for case study pages (desktop only).
 * UX reason: lets readers orient themselves within a long case study
 * without scrolling back to the top — paces the narrative.
 */
export default function CaseStudySidebar({ items }: CaseStudySidebarProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
  const prefersReducedMotion = useReducedMotion();
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!items.length) return;

    // Track which sections are currently intersecting
    const intersecting = new Set<string>();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            intersecting.add(entry.target.id);
          } else {
            intersecting.delete(entry.target.id);
          }
        });

        // Active = the first item in our ordered list that is intersecting
        for (const item of items) {
          if (intersecting.has(item.id)) {
            setActiveId(item.id);
            break;
          }
        }
      },
      {
        // Trigger when section enters the middle band of the viewport
        rootMargin: "-15% 0px -60% 0px",
        threshold: 0,
      },
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [items]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    // UX reason: smooth scroll confirms section jump, anchors reader to target
    el.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  if (!items.length) return null;

  return (
    <nav
      aria-label="Case study sections"
      className="hidden xl:block sticky"
      style={{ top: "120px", alignSelf: "flex-start" }}
    >
      <p className="font-body text-eyebrow uppercase tracking-widest text-text/25 mb-6">
        Contents
      </p>
      <ol className="flex flex-col gap-3 list-none m-0 p-0" role="list">
        {items.map(({ id, label }) => {
          const isActive = activeId === id;
          return (
            <li key={id}>
              <button
                onClick={() => handleClick(id)}
                className="group flex items-center gap-3 text-left w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-sharp"
                aria-current={isActive ? "true" : undefined}
                data-cursor="hover"
              >
                {/* Active bar */}
                <span
                  className="block flex-shrink-0 rounded-full"
                  style={{
                    width: isActive ? "20px" : "8px",
                    height: "1px",
                    background: isActive ? "var(--accent)" : "rgba(216,216,216,0.2)",
                    transition: "width 300ms cubic-bezier(0.4,0,0.2,1), background 300ms ease-out",
                  }}
                  aria-hidden="true"
                />
                <span
                  className="font-body text-eyebrow uppercase tracking-widest transition-colors duration-micro ease-out"
                  style={{
                    color: isActive ? "var(--text)" : "rgba(216,216,216,0.3)",
                  }}
                >
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
