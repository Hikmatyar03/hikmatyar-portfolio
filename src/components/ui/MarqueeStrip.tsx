"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { ClientLogo } from "@/lib/logos";

interface MarqueeStripProps {
  /** Array of logo objects dynamically loaded from public/logos */
  logos?: ClientLogo[];
  /** Fallback string items if text marquee is desired */
  items?: string[];
  /** Animation duration for one complete cycle (default: "28s") */
  duration?: string;
  /** Optional custom CSS classes */
  className?: string;
}

/**
 * MarqueeStrip — infinite seamless horizontal scrolling loop for client logos.
 *
 * Implemented with duplicate array rendered once with aria-hidden="true"
 * so screen readers only announce content once.
 *
 * Color Normalization:
 * - Dark mode: unified off-white via CSS brightness(0) invert(0.85), opacity 0.72
 * - Light mode: native black artwork (no filter, opacity 1)
 * - Hover (both themes): smooth transition to brand accent red (#FF4A4A) with red glow
 * - Hover pauses track animation for close inspection.
 * - Reduced motion disables animation.
 */
export default function MarqueeStrip({
  logos,
  items,
  duration = "28s",
  className = "",
}: MarqueeStripProps) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasLogos = logos && logos.length > 0;
  const hasItems = items && items.length > 0;

  if (!hasLogos && !hasItems) {
    return null;
  }

  const isLight = mounted && resolvedTheme === "light";
  const logoFilterClass = isLight ? "logo-filter-light" : "logo-filter-dark";

  return (
    <div
      className={`relative w-full overflow-hidden border-y border-text/[0.08] bg-text/[0.02] backdrop-blur-sm py-6 md:py-8 my-12 ${className}`}
      data-cursor="true"
      data-cursor-text="Clients"
      aria-label="Client brands and collaborations"
    >
      <div
        className="marquee-track flex items-center gap-16 md:gap-24"
        style={{ "--marquee-duration": duration } as React.CSSProperties}
      >
        {/* Set 1: Visible to screen readers */}
        <div className="flex items-center gap-16 md:gap-24 flex-shrink-0">
          {hasLogos
            ? logos.map((logo, idx) => (
                <div
                  key={`logo-1-${idx}`}
                  className="group/logo relative flex items-center justify-center flex-shrink-0 transition-transform duration-300 ease-out hover:scale-105"
                  title={logo.name}
                >
                  <div className="relative h-8 md:h-11 w-28 md:w-36 flex items-center justify-center">
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      fill
                      sizes="(max-width: 768px) 120px, 160px"
                      className={`object-contain transition-all duration-300 ease-out ${logoFilterClass} group-hover/logo:logo-filter-accent`}
                    />
                  </div>
                </div>
              ))
            : items?.map((item, idx) => (
                <div key={`item-1-${idx}`} className="flex items-center gap-16 md:gap-24">
                  <span className="font-display text-text/75 text-2xl md:text-3xl tracking-tight uppercase whitespace-nowrap">
                    {item}
                  </span>
                  <span className="text-accent/60 text-sm select-none" aria-hidden="true">
                    ✦
                  </span>
                </div>
              ))}
        </div>

        {/* Set 2: Duplicate for seamless loop — aria-hidden prevents duplicate screen reader announcements */}
        <div
          className="flex items-center gap-16 md:gap-24 flex-shrink-0"
          aria-hidden="true"
        >
          {hasLogos
            ? logos.map((logo, idx) => (
                <div
                  key={`logo-2-${idx}`}
                  className="group/logo relative flex items-center justify-center flex-shrink-0 transition-transform duration-300 ease-out hover:scale-105"
                >
                  <div className="relative h-8 md:h-11 w-28 md:w-36 flex items-center justify-center">
                    <Image
                      src={logo.src}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 120px, 160px"
                      className={`object-contain transition-all duration-300 ease-out ${logoFilterClass} group-hover/logo:logo-filter-accent`}
                    />
                  </div>
                </div>
              ))
            : items?.map((item, idx) => (
                <div key={`item-2-${idx}`} className="flex items-center gap-16 md:gap-24">
                  <span className="font-display text-text/75 text-2xl md:text-3xl tracking-tight uppercase whitespace-nowrap">
                    {item}
                  </span>
                  <span className="text-accent/60 text-sm select-none">
                    ✦
                  </span>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
