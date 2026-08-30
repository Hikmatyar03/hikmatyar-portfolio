import type { ReactNode } from "react";

interface StatBadgeProps {
  children: ReactNode;
  className?: string;
}

/**
 * StatBadge — punchy single-stat callout with rounded-full glass finish.
 */
export default function StatBadge({ children, className = "" }: StatBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md font-body text-eyebrow uppercase tracking-widest text-text/70 hover:border-white/[0.18] hover:text-text transition-all duration-micro ${className}`}
    >
      {/* Accent tick */}
      <span
        aria-hidden="true"
        className="flex-shrink-0"
        style={{
          display: "inline-block",
          width: "2px",
          height: "0.85em",
          background: "var(--accent)",
          boxShadow: "0 0 6px var(--accent)",
          opacity: 0.85,
        }}
      />
      {children}
    </span>
  );
}
