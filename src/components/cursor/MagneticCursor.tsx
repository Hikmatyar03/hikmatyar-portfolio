"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ASCII_FONT_FAMILY } from "@/lib/asciiShader";

/**
 * MagneticCursor — ASCII Glyph Cursor with Magnetic Proximity Snap.
 *
 * Architecture:
 *   • Single fixed DOM container (.ascii-cursor) housing one glyph span (.ascii-cursor-glyph).
 *   • Font stack matches WebGL shader font atlas: "Courier New", Consolas, monospace.
 *   • Proximity to interactive targets steps up character density:
 *       Idle:        ":"
 *       Approaching: "+" -> "*"
 *       Hover/Snap:  "@" with --accent (#FF4A4A) glow and magnetic center pull.
 *   • Direct textContent swapping without cross-fade for crisp, glitch-free character shifts.
 *   • GSAP quickTo hardware-accelerated positioning with smooth lerping.
 */

const INTERACTIVE_SELECTOR =
  "a, button, [role='button'], input, textarea, select, [data-cursor], [data-cursor-text]";

const SNAP_RADIUS = 75; // Proximity threshold in pixels

function getDistanceToRect(x: number, y: number, rect: DOMRect): number {
  const dx = Math.max(rect.left - x, 0, x - rect.right);
  const dy = Math.max(rect.top - y, 0, y - rect.bottom);
  return Math.sqrt(dx * dx + dy * dy);
}

export default function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const glyphRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<string>("");
  const [label, setLabel] = useState<string>("");
  const [active, setActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on fine pointer devices
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!isFinePointer) return;

    const cursorEl = cursorRef.current;
    const glyphEl = glyphRef.current;
    if (!cursorEl || !glyphEl) return;

    // Initial position offscreen
    gsap.set(cursorEl, { xPercent: -50, yPercent: -50, x: -100, y: -100 });

    // GSAP quickTo for smooth 120fps hardware-accelerated transform interpolation
    const followDuration = prefersReducedMotion ? 0 : 0.16;
    const xTo = gsap.quickTo(cursorEl, "x", {
      duration: followDuration,
      ease: "power2.out",
    });
    const yTo = gsap.quickTo(cursorEl, "y", {
      duration: followDuration,
      ease: "power2.out",
    });

    let hasMovedOnce = false;
    let isHoveredState = false;
    let cachedTargets: HTMLElement[] = [];
    let lastQueryTime = 0;

    const updateCachedTargets = () => {
      const now = performance.now();
      if (now - lastQueryTime > 400 || cachedTargets.length === 0) {
        lastQueryTime = now;
        cachedTargets = Array.from(
          document.querySelectorAll<HTMLElement>(INTERACTIVE_SELECTOR)
        ).filter((el) => {
          const rect = el.getBoundingClientRect();
          return (
            rect.width > 0 &&
            rect.height > 0 &&
            rect.bottom >= -50 &&
            rect.top <= window.innerHeight + 50 &&
            rect.right >= -50 &&
            rect.left <= window.innerWidth + 50
          );
        });
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      const clientX = e.clientX;
      const clientY = e.clientY;

      if (!hasMovedOnce) {
        hasMovedOnce = true;
        document.documentElement.setAttribute("data-cursor-mounted", "");
        setIsVisible(true);
      }

      if (prefersReducedMotion) {
        xTo(clientX);
        yTo(clientY);
        return;
      }

      // Check if directly hovering an interactive target
      const directTarget = (e.target as Element)?.closest<HTMLElement>(
        INTERACTIVE_SELECTOR
      );

      let targetX = clientX;
      let targetY = clientY;
      let nextGlyph = ":";
      let isHovered = false;
      let currentLabel = "";

      if (directTarget) {
        isHovered = true;
        nextGlyph = "@";

        currentLabel =
          directTarget.getAttribute("data-cursor-text") ||
          (directTarget.tagName === "A"
            ? "View"
            : directTarget.tagName === "BUTTON"
            ? "Select"
            : "");

        // Magnetic snap: strong pull toward element center
        const rect = directTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        targetX = clientX + (centerX - clientX) * 0.38;
        targetY = clientY + (centerY - clientY) * 0.38;
      } else {
        // Check proximity to nearby interactive elements
        updateCachedTargets();
        let closestDist = Infinity;
        let closestCenter = { x: clientX, y: clientY };

        for (let i = 0; i < cachedTargets.length; i++) {
          const rect = cachedTargets[i].getBoundingClientRect();
          const d = getDistanceToRect(clientX, clientY, rect);
          if (d < closestDist) {
            closestDist = d;
            closestCenter = {
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2,
            };
          }
        }

        if (closestDist <= SNAP_RADIUS) {
          const proximity = 1 - closestDist / SNAP_RADIUS; // 0 -> 1

          // Step up through ramp based on proximity: ":" -> "+" -> "*"
          if (proximity < 0.45) {
            nextGlyph = "+";
          } else {
            nextGlyph = "*";
          }

          // Gentle magnetic attraction curve as cursor approaches
          const pull = Math.pow(proximity, 1.6) * 0.28;
          targetX = clientX + (closestCenter.x - clientX) * pull;
          targetY = clientY + (closestCenter.y - clientY) * pull;
        } else {
          // Idle state
          nextGlyph = ":";
        }
      }

      // Direct textContent swap (instant, no cross-fade flicker)
      if (glyphEl.textContent !== nextGlyph) {
        glyphEl.textContent = nextGlyph;
      }

      // Animate hover state transitions (scale, color class)
      if (isHovered !== isHoveredState) {
        isHoveredState = isHovered;
        setActive(isHovered);
        labelRef.current = currentLabel;
        setLabel(currentLabel);

        if (isHovered) {
          glyphEl.classList.add("ascii-cursor-glyph--active");
          gsap.to(glyphEl, {
            scale: 1.35,
            duration: 0.18,
            ease: "back.out(2)",
            overwrite: "auto",
          });
        } else {
          glyphEl.classList.remove("ascii-cursor-glyph--active");
          gsap.to(glyphEl, {
            scale: 1.0,
            duration: 0.18,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      } else if (isHovered && currentLabel !== labelRef.current) {
        labelRef.current = currentLabel;
        setLabel(currentLabel);
      }

      // Smooth position update
      xTo(targetX);
      yTo(targetY);
    };

    const onMouseDown = () => {
      gsap.to(glyphEl, {
        scale: isHoveredState ? 1.1 : 0.82,
        duration: 0.1,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const onMouseUp = () => {
      gsap.to(glyphEl, {
        scale: isHoveredState ? 1.35 : 1.0,
        duration: 0.2,
        ease: "back.out(2)",
        overwrite: "auto",
      });
    };

    const onScroll = () => {
      lastQueryTime = 0; // Invalidate target cache on scroll
    };

    const onDocMouseLeave = () => setIsVisible(false);
    const onDocMouseEnter = () => {
      if (hasMovedOnce) setIsVisible(true);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onDocMouseLeave);
    document.documentElement.addEventListener("mouseenter", onDocMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.documentElement.removeEventListener(
        "mouseleave",
        onDocMouseLeave
      );
      document.documentElement.removeEventListener(
        "mouseenter",
        onDocMouseEnter
      );
      document.documentElement.removeAttribute("data-cursor-mounted");
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="ascii-cursor"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.2s ease-out",
        fontFamily: ASCII_FONT_FAMILY,
      }}
      aria-hidden="true"
    >
      <span ref={glyphRef} className="ascii-cursor-glyph">
        :
      </span>
      {active && label ? (
        <span className="ascii-cursor-label">[{label}]</span>
      ) : null}
    </div>
  );
}
