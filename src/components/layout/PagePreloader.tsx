"use client";

import { useEffect, useState, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * PagePreloader — full-screen percentage counter that runs once per session.
 *
 * UX reason: gives the browser time to parse critical fonts and decode
 * the hero video before the page snaps into view — prevents FOUT and a
 * raw-layout flash on first visit.
 *
 * Session-storage flag: runs only on first visit, not on soft-nav route changes.
 * Hard-refresh (Ctrl+F5) clears sessionStorage so the loader runs again.
 */
export default function PagePreloader() {
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);
  const [exiting, setExiting] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Skip on subsequent visits in the same session
    if (sessionStorage.getItem("preloaded")) return;

    setVisible(true);

    const rm = prefersReducedMotion;

    // Reduced-motion: skip immediately
    if (rm) {
      sessionStorage.setItem("preloaded", "1");
      setVisible(false);
      return;
    }

    let current = 0;
    const TARGET = 100;
    // Count to 100 over ~1.6s — 80 ticks at 20ms
    const TICK_MS = 16;
    const STEP = TARGET / (1600 / TICK_MS);

    intervalRef.current = setInterval(() => {
      current = Math.min(current + STEP + Math.random() * STEP * 0.5, TARGET);
      setCount(Math.floor(current));

      if (current >= TARGET) {
        clearInterval(intervalRef.current!);
        // Brief pause at 100% before wipe-out
        setTimeout(() => {
          setExiting(true);
          // Remove from DOM after clip-path animation completes (700ms)
          setTimeout(() => {
            setVisible(false);
            sessionStorage.setItem("preloaded", "1");
          }, 750);
        }, 200);
      }
    }, TICK_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [prefersReducedMotion]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998, // below cursor (9999), above everything else
        backgroundColor: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        padding: "clamp(20px, 5vw, 80px)",
        // UX reason: vertical clip-path wipe from bottom reveals the page
        // below without a hard cut — mimics a curtain rising
        clipPath: exiting ? "inset(100% 0 0 0)" : "inset(0 0 0 0)",
        transition: exiting ? "clip-path 0.7s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
        willChange: "clip-path",
      }}
    >
      {/* Brand wordmark — top-left */}
      <p
        style={{
          position: "absolute",
          top: "clamp(20px, 5vw, 80px)",
          left: "clamp(20px, 5vw, 80px)",
          fontFamily: "var(--font-degular-text), Arial, sans-serif",
          fontSize: "0.75rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "rgba(216,216,216,0.35)",
        }}
      >
        Hikmatyar
      </p>

      {/* Percentage counter — bottom-left, display scale */}
      <div style={{ lineHeight: 1 }}>
        <span
          style={{
            fontFamily: "var(--font-degular-display), Arial Narrow, sans-serif",
            fontSize: "clamp(5rem, 18vw, 14rem)",
            color: "var(--text)",
            letterSpacing: "-0.02em",
            lineHeight: 0.88,
            display: "block",
          }}
        >
          {String(count).padStart(2, "0")}
          <span
            style={{
              fontSize: "clamp(1.5rem, 4vw, 3.5rem)",
              color: "var(--accent)",
              marginLeft: "0.15em",
            }}
          >
            %
          </span>
        </span>

        {/* Loading label */}
        <p
          style={{
            fontFamily: "var(--font-degular-text), Arial, sans-serif",
            fontSize: "0.7rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(216,216,216,0.3)",
            marginTop: "1rem",
          }}
        >
          Loading
        </p>
      </div>

      {/* Thin accent progress bar at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "2px",
          width: `${count}%`,
          background: "var(--accent)",
          transition: "width 0.05s linear",
        }}
      />
    </div>
  );
}
