"use client";

import { motion, useReducedMotion } from "framer-motion";

interface ToggleIconProps {
  /** Whether the controlled content is expanded */
  open: boolean;
  className?: string;
}

/**
 * ToggleIcon — ( + ) / ( − ) expand-collapse affordance.
 *
 * Uses a consistent punctuation-based icon language instead of
 * per-component chevrons or arrow icons.
 *
 * UX reason: The parentheses create visual grouping that reads as a
 * "control" without importing a separate icon library. The vertical
 * bar of + scales to 0 height, leaving the horizontal bar as −.
 */
export default function ToggleIcon({ open, className = "" }: ToggleIconProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <span
      className={`font-body text-eyebrow uppercase tracking-widest text-text/50 inline-flex items-center gap-1 select-none ${className}`}
      aria-hidden="true"
    >
      <span>(</span>

      {/* The icon glyph: + morphs to − by collapsing the vertical bar */}
      <span
        className="relative inline-flex items-center justify-center"
        style={{ width: "1em", height: "1em" }}
      >
        {/* Horizontal bar — always visible */}
        <span
          style={{
            position: "absolute",
            width: "0.6em",
            height: "1px",
            background: "currentColor",
            display: "block",
          }}
        />
        {/* Vertical bar — collapses to 0 when open */}
        <motion.span
          animate={{ scaleY: open ? 0 : 1 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.2,
            ease: "easeOut",
          }}
          style={{
            position: "absolute",
            width: "1px",
            height: "0.6em",
            background: "currentColor",
            display: "block",
            transformOrigin: "center",
          }}
        />
      </span>

      <span>)</span>
    </span>
  );
}
