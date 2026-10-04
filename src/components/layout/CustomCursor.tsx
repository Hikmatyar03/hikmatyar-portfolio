"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { ASCII_FONT_FAMILY } from "@/lib/asciiShader";

/**
 * CustomCursor — Single ASCII glyph cursor.
 *
 * Replaces the legacy ring+dot elements with a single monospace
 * ASCII character matching the density ramp of the portfolio.
 */
export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const glyphRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = cursorRef.current;
    const glyph = glyphRef.current;
    if (!cursor || !glyph) return;

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;

    const LERP = prefersReducedMotion ? 1 : 0.15;
    let rafId: number;
    let isRunning = true;
    let hasEnteredWindow = false;

    cursor.style.opacity = "0";

    function tick() {
      if (!isRunning) return;

      currentX += (mouseX - currentX) * LERP;
      currentY += (mouseY - currentY) * LERP;

      cursor!.style.transform = `translate(${currentX}px, ${currentY}px)`;
      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!hasEnteredWindow) {
        hasEnteredWindow = true;
        cursor!.style.opacity = "1";
        currentX = mouseX;
        currentY = mouseY;
      }
    }

    const INTERACTIVE =
      'a, button, [role="button"], input, select, textarea, label, [data-cursor="hover"], [data-cursor-text]';

    function onMouseOver(e: MouseEvent) {
      if ((e.target as Element).closest(INTERACTIVE)) {
        glyph!.textContent = "@";
        glyph!.classList.add("ascii-cursor-glyph--active");
      } else {
        glyph!.textContent = ":";
        glyph!.classList.remove("ascii-cursor-glyph--active");
      }
    }

    function onMouseDown() {
      glyph!.style.transform = "scale(0.85)";
    }

    function onMouseUp() {
      glyph!.style.transform = "scale(1)";
    }

    function onDocMouseLeave() {
      cursor!.style.opacity = "0";
    }

    function onDocMouseEnter() {
      if (hasEnteredWindow) cursor!.style.opacity = "1";
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
      document.documentElement.removeEventListener("mouseleave", onDocMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onDocMouseEnter);
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={cursorRef}
      className="ascii-cursor"
      style={{ fontFamily: ASCII_FONT_FAMILY }}
      aria-hidden="true"
    >
      <span ref={glyphRef} className="ascii-cursor-glyph">
        :
      </span>
    </div>
  );
}
