"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import SectionLabel from "@/components/ui/SectionLabel";

interface HeroSectionProps {
  headline: string;
  subline?: string;
}

export default function HeroSection({ headline, subline }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollLineRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Respect reduced-motion: pause video if autoplay fired before hook resolved
  useEffect(() => {
    if (prefersReducedMotion && videoRef.current) {
      videoRef.current.pause();
    }
  }, [prefersReducedMotion]);

  // GSAP: breathing scroll indicator line
  // UX reason: a subtle pulse draws the eye downward, cuing vertical scrolling
  useEffect(() => {
    if (prefersReducedMotion || !scrollLineRef.current) return;

    const tl = gsap.timeline({ repeat: -1 });
    tl.fromTo(
      scrollLineRef.current,
      { scaleY: 0, transformOrigin: "top center" },
      { scaleY: 1, duration: 0.9, ease: "power2.out" },
    ).to(scrollLineRef.current, {
      scaleY: 0,
      transformOrigin: "bottom center",
      duration: 0.7,
      ease: "power2.in",
      delay: 0.2,
    });

    return () => {
      tl.kill();
    };
  }, [prefersReducedMotion]);

  // Split headline into words for per-word stagger
  const words = headline.split(" ");

  // Section-reveal tier timing constants
  const WORD_DELAY_BASE = 0.2;
  const WORD_STAGGER = 0.07;
  const REVEAL_DURATION = 0.65;
  const EASE: [number, number, number, number] = [0, 0, 0.2, 1];

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] md:min-h-screen flex flex-col justify-end overflow-hidden pt-28 pb-16 md:pb-20"
      aria-label="Introduction"
    >
      {/* ── Background atmospheric backdrop ── */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <video
          ref={videoRef}
          className="w-full h-full object-cover opacity-60"
          autoPlay={!prefersReducedMotion}
          muted
          loop
          playsInline
        >
          <source src="/placeholder-media/hero/reel-01.mp4" type="video/mp4" />
          <source src="/placeholder-media/hero/reel-02.mp4" type="video/mp4" />
        </video>

        {/* Film grain overlay — editorial texture, CSS-only */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "256px 256px",
            mixBlendMode: "overlay",
            opacity: 0.5,
          }}
        />

        {/* Gradient backdrop: clean contrast for editorial legibility (theme-adaptive) */}
        <div className="absolute inset-0 z-[2] hero-gradient-overlay" />
      </div>

      {/* ── Hero content — two-column clean layout ── */}
      <div className="container relative z-10 grid grid-cols-mobile gap-grid-mobile md:grid-cols-tablet md:gap-grid-tablet lg:grid-cols-desktop lg:gap-grid-laptop xl:gap-grid-desktop items-end">
        {/* Left column — eyebrow + headline + subline + CTAs */}
        <div className="col-span-4 md:col-span-5 lg:col-span-8 flex flex-col justify-end">
          {/* Eyebrow label in square brackets */}
          <SectionLabel className="mb-4 md:mb-6">
            Brand Identity &amp; Strategy
          </SectionLabel>

          {/* Headline — per-word stagger reveal */}
          <h1
            className="font-display text-display text-text tracking-tight"
            style={{ lineHeight: 0.9 }}
          >
            {words.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                className="inline-block"
                style={{ marginRight: "0.22em" }}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 44 }}
                animate={{ opacity: 1, y: 0 }}
                // UX reason: per-word stagger gives each word typographic weight; settle mimics ink on paper
                transition={{
                  duration: prefersReducedMotion ? 0.01 : REVEAL_DURATION,
                  ease: EASE,
                  delay: prefersReducedMotion ? 0 : WORD_DELAY_BASE + i * WORD_STAGGER,
                }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* Subline — fades in after headline completes */}
          {subline && (
            <motion.p
              className="font-body text-body-lg text-text/70 mt-6 md:mt-8 max-w-xl leading-relaxed"
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              // UX reason: delayed fade lets the display headline land before supporting copy appears
              transition={{
                duration: prefersReducedMotion ? 0.01 : REVEAL_DURATION,
                ease: EASE,
                delay: prefersReducedMotion
                  ? 0
                  : WORD_DELAY_BASE + words.length * WORD_STAGGER + 0.15,
              }}
            >
              {subline}
            </motion.p>
          )}

          {/* Clean Action Links */}
          <motion.div
            className="flex flex-wrap items-center gap-4 mt-8 md:mt-10"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.01 : 0.5,
              delay: prefersReducedMotion
                ? 0
                : WORD_DELAY_BASE + words.length * WORD_STAGGER + 0.3,
            }}
          >
            <a
              href="#featured-work"
              data-cursor="true"
              data-cursor-text="Explore"
              className="inline-flex items-center gap-2 font-body text-eyebrow uppercase tracking-widest px-6 py-3 rounded-full bg-text/[0.08] hover:bg-text/[0.14] text-text border border-text/[0.12] shadow-sm transition-all duration-micro ease-micro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span>Explore Selected Work</span>
              <span className="text-accent" aria-hidden="true">↓</span>
            </a>

            <Link
              href="/contact"
              data-cursor="true"
              data-cursor-text="Contact"
              className="inline-flex items-center gap-2 font-body text-eyebrow uppercase tracking-widest px-6 py-3 rounded-full text-text/70 hover:text-text hover:bg-text/[0.05] border border-text/[0.1] transition-all duration-micro ease-micro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span>Start a Project</span>
              <span className="text-text/40" aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </div>

        {/* Right column — status badge + scroll indicator */}
        <motion.div
          className="col-span-4 md:col-span-1 md:col-start-6 lg:col-span-4 lg:col-start-9 flex flex-row md:flex-col justify-between md:justify-end items-center md:items-end gap-6 md:gap-10 pt-8 md:pt-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: prefersReducedMotion ? 0.01 : 0.5,
            delay: prefersReducedMotion ? 0 : 0.9,
            ease: EASE,
          }}
        >
          {/* Available for work status pill */}
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-text/[0.03] border border-text/[0.1] backdrop-blur-md">
            <span
              className="relative flex h-2 w-2"
              aria-hidden="true"
            >
              <span
                className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"
                style={{
                  animation: prefersReducedMotion
                    ? "none"
                    : "ping 1.6s cubic-bezier(0,0,0.2,1) infinite",
                }}
              />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <p className="font-body text-eyebrow uppercase tracking-widest text-text/70">
              Available for Projects
            </p>
          </div>

          {/* Scroll indicator — minimal animated vertical cue */}
          <a
            href="#featured-work"
            className="flex flex-col items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Scroll to featured work"
            data-cursor="true"
            data-cursor-text="Scroll"
          >
            <p
              className="font-body text-eyebrow uppercase tracking-widest text-text/30 group-hover:text-text/60 transition-colors duration-micro"
              style={{ writingMode: "vertical-rl", letterSpacing: "0.15em" }}
            >
              Scroll
            </p>
            {/* Breathing line — GSAP animates scaleY via ref */}
            <div
              className="w-px h-12 bg-text/20 overflow-hidden"
              aria-hidden="true"
            >
              <div
                ref={scrollLineRef}
                className="w-full h-full bg-accent origin-top scale-y-0"
              />
            </div>
          </a>
        </motion.div>
      </div>

      {/* Keyframes for availability dot ping */}
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
