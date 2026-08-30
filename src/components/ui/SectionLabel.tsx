"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface SectionLabelProps {
  children: ReactNode;
  /** Override color — defaults to accent. Pass "muted" for text/35 variant */
  variant?: "accent" | "muted";
  className?: string;
}

/**
 * SectionLabel — bracketed eyebrow label above section headings.
 *
 * Renders:  [ Section name ]
 *
 * UX reason: the brackets create a UI-language punctuation mark that
 * groups the label visually without requiring a heavy typographic hierarchy.
 * Scroll-reveals with a 16px upward settle to pace reading rhythm.
 */
export default function SectionLabel({
  children,
  variant = "accent",
  className = "",
}: SectionLabelProps) {
  const prefersReducedMotion = useReducedMotion();

  const colorClass =
    variant === "muted"
      ? "text-text/35"
      : "text-accent";

  return (
    <motion.p
      className={`font-body text-eyebrow uppercase tracking-widest ${colorClass} ${className}`}
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      // UX reason: upward settle arrives before the headline — primes the reader
      transition={{
        duration: prefersReducedMotion ? 0.01 : 0.5,
        ease: [0, 0, 0.2, 1],
      }}
    >
      {/* Literal bracket characters — semantic, not CSS ::before content */}
      <span aria-hidden="true">[ </span>
      {children}
      <span aria-hidden="true"> ]</span>
    </motion.p>
  );
}
