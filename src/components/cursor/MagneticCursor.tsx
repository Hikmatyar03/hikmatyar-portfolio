"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * MagneticCursor
 *
 * High-performance GSAP precision cursor follower system:
 * 1. Precision center dot (6px) with instant tracking.
 * 2. Smooth glass follower ring (36px) with fluid easing that expands to 88px on interactive targets.
 * 3. Zero canvas overhead — utilizes hardware-accelerated CSS transforms via GSAP quickTo.
 */
export default function MagneticCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string>("");
  const [active, setActive] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on fine pointer devices without reduced-motion preference
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!isFinePointer || prefersReducedMotion) {
      return;
    }

    const dotEl = dotRef.current;
    const ringEl = ringRef.current;
    if (!dotEl || !ringEl) return;

    // Initial position offscreen
    gsap.set(dotEl, { xPercent: -50, yPercent: -50, x: -100, y: -100 });
    gsap.set(ringEl, { xPercent: -50, yPercent: -50, x: -100, y: -100 });

    // GSAP quickTo for smooth 120fps hardware-accelerated transform interpolation
    const dotXTo = gsap.quickTo(dotEl, "x", { duration: 0.05, ease: "power2.out" });
    const dotYTo = gsap.quickTo(dotEl, "y", { duration: 0.05, ease: "power2.out" });
    const ringXTo = gsap.quickTo(ringEl, "x", { duration: 0.22, ease: "power3.out" });
    const ringYTo = gsap.quickTo(ringEl, "y", { duration: 0.22, ease: "power3.out" });

    let hasMovedOnce = false;

    const onMouseMove = (e: MouseEvent) => {
      const clientX = e.clientX;
      const clientY = e.clientY;

      if (!hasMovedOnce) {
        hasMovedOnce = true;
        document.documentElement.setAttribute("data-cursor-mounted", "");
        setIsVisible(true);
      }

      dotXTo(clientX);
      dotYTo(clientY);
      ringXTo(clientX);
      ringYTo(clientY);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = (e.target as Element).closest<HTMLElement>(
        "[data-cursor], [data-cursor-text], a, button, input, textarea",
      );
      if (target) {
        const text =
          target.getAttribute("data-cursor-text") ||
          (target.tagName === "A"
            ? "View"
            : target.tagName === "BUTTON"
              ? "Select"
              : "");
        setLabel(text);
        setActive(true);
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = (e.target as Element).closest<HTMLElement>(
        "[data-cursor], [data-cursor-text], a, button, input, textarea",
      );
      if (target && !target.contains(e.relatedTarget as Node)) {
        setActive(false);
        setLabel("");
      }
    };

    const onMouseDown = () => setClicking(true);
    const onMouseUp = () => setClicking(false);

    const onDocMouseLeave = () => setIsVisible(false);
    const onDocMouseEnter = () => {
      if (hasMovedOnce) setIsVisible(true);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseout", onMouseOut, { passive: true });
    document.addEventListener("mousedown", onMouseDown, { passive: true });
    document.addEventListener("mouseup", onMouseUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onDocMouseLeave);
    document.documentElement.addEventListener("mouseenter", onDocMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.documentElement.removeEventListener("mouseleave", onDocMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onDocMouseEnter);
      document.documentElement.removeAttribute("data-cursor-mounted");
    };
  }, []);

  const ringClasses = [
    "custom-cursor-ring",
    active ? "custom-cursor-ring--active" : "",
    clicking && active ? "custom-cursor-ring--clicking" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: "none",
        transition: "opacity 0.2s ease-out",
      }}
      aria-hidden="true"
    >
      {/* Smooth Glass Follower Ring with Morphing Text Pill */}
      <div ref={ringRef} className={ringClasses}>
        {active && label ? (
          <span className="custom-cursor-label">{label}</span>
        ) : null}
      </div>

      {/* Precision Center Glow Dot */}
      <div ref={dotRef} className="custom-cursor-dot" />
    </div>
  );
}
