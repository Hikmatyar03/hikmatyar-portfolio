"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * CustomCursor — two-layer magnetic cursor.
 *
 * Architecture:
 *   • cursor-dot   : snaps to mouse instantly (no interpolation)
 *   • cursor-ring  : lerps toward the dot with a 0.1 factor (~80ms lag feel)
 *
 * Both layers are driven by a single rAF loop, keeping layout and paint
 * on the compositor thread — zero jank even at 120fps.
 *
 * UX reason: The lerp delay gives the cursor weight and personality;
 * it feels like the ring is magnetically attracted to the dot.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Skip entirely on touch / coarse-pointer devices (mobile, tablets)
    if (window.matchMedia("(pointer: coarse)").matches) return;

    // Type-safe local references — early return above ensures these are used
    // only on pointer:fine environments where the DOM elements are mounted
    const dot = dotRef.current!;
    const ring = ringRef.current!;

    // Current mouse position (updates instantly on mousemove)
    let mouseX = -100;
    let mouseY = -100;

    // Ring's current interpolated position
    let ringX = -100;
    let ringY = -100;

    // Lerp factor — lower = more lag/trail; 0.1 ≈ 80ms feel at 60fps
    // Reduced-motion: instant follow (factor = 1)
    const LERP = prefersReducedMotion ? 1 : 0.1;

    let rafId: number;
    let isRunning = true;

    // Show cursor once we have a real position (prevent off-screen flash)
    dot.style.opacity = "0";
    ring.style.opacity = "0";
    let hasEnteredWindow = false;

    // ── rAF loop ──────────────────────────────────────────────────────
    function tick() {
      if (!isRunning) return;

      // Lerp ring toward mouse
      ringX += (mouseX - ringX) * LERP;
      ringY += (mouseY - ringY) * LERP;

      // Apply transforms (compositor-only — no layout, no paint)
      dot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
      ring.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    // ── Mouse tracking ─────────────────────────────────────────────────
    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!hasEnteredWindow) {
        hasEnteredWindow = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
        // Snap ring to starting position so there's no first-frame flyby
        ringX = mouseX;
        ringY = mouseY;
      }
    }

    // ── Hover state — interactive targets ──────────────────────────────
    const INTERACTIVE =
      'a, button, [role="button"], input, select, textarea, label, ' +
      '[data-cursor="hover"], summary, [tabindex]:not([tabindex="-1"])';

    // Use event delegation on document — covers dynamically added elements
    function onMouseOver(e: MouseEvent) {
      if ((e.target as Element).closest(INTERACTIVE)) {
        dot.classList.add("is-hovered");
        ring.classList.add("is-hovered");
      } else {
        dot.classList.remove("is-hovered");
        ring.classList.remove("is-hovered");
      }
    }

    // ── Click state — physical compression feedback ─────────────────────
    function onMouseDown() {
      dot.classList.add("is-clicking");
      ring.classList.add("is-clicking");
    }

    function onMouseUp() {
      dot.classList.remove("is-clicking");
      ring.classList.remove("is-clicking");
    }

    // ── Hide when cursor leaves viewport ───────────────────────────────
    function onDocMouseLeave() {
      dot.classList.add("is-hidden");
      ring.classList.add("is-hidden");
    }

    function onDocMouseEnter() {
      dot.classList.remove("is-hidden");
      ring.classList.remove("is-hidden");
    }

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mousedown", onMouseDown, { passive: true });
    document.addEventListener("mouseup", onMouseUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onDocMouseLeave);
    document.documentElement.addEventListener("mouseenter", onDocMouseEnter);

    return () => {
      isRunning = false;
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.documentElement.removeEventListener(
        "mouseleave",
        onDocMouseLeave,
      );
      document.documentElement.removeEventListener(
        "mouseenter",
        onDocMouseEnter,
      );
    };
  }, [prefersReducedMotion]);

  return (
    <>
      {/* Fast dot — snaps immediately, confirms precision */}
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      {/* Slow ring — lerps behind, creates magnetic weight */}
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
