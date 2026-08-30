import type { ReactNode } from "react";

interface CategoryTagProps {
  children: ReactNode;
  /** Active state — accent color + border */
  active?: boolean;
  className?: string;
}

/**
 * CategoryTag — inline glass chip for project categories / service pillars with rounded-full finish.
 */
export default function CategoryTag({
  children,
  active = false,
  className = "",
}: CategoryTagProps) {
  return (
    <span
      className={[
        "inline-block font-body text-eyebrow uppercase tracking-widest",
        "px-3.5 py-1.5 rounded-full border backdrop-blur-md transition-all duration-micro",
        active
          ? "text-accent border-accent/60 bg-accent/[0.08] shadow-sm"
          : "text-text/70 border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] hover:text-text",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
