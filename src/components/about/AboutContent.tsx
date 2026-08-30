"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionLabel from "@/components/ui/SectionLabel";

// ── Principles — 3 of them, not 4; not a numbered deck ──
// Voice: first-person, direct, no filler. Owner should replace with
// their own words before launch — [PLACEHOLDER COPY] marked below.
const PRINCIPLES = [
  {
    id: "research",
    label: "Research before design",
    // [PLACEHOLDER COPY — personalise before launch]
    body: "I don't open software until I understand the market, the audience, and what the brand needs to feel different from. The brief is a starting point, not the strategy.",
  },
  {
    id: "systems",
    label: "Systems, not one-offs",
    // [PLACEHOLDER COPY — personalise before launch]
    body: "A logo is a component. I design identity systems — type, colour, tone, space, motion — that work across every application without ongoing management. That's what makes a brand durable.",
  },
  {
    id: "loops",
    label: "Short loops, no long silences",
    // [PLACEHOLDER COPY — personalise before launch]
    body: "I share work early and often. A wrong direction caught in week one costs a fraction of one caught at presentation. Tight loops are how I stay aligned without lengthy check-ins.",
  },
] as const;

// [DEV] Verify: all copy below is first-person "I" — no "we" or "our team".

const EASE: [number, number, number, number] = [0, 0, 0.2, 1];

export default function AboutContent() {
  const prefersReducedMotion = useReducedMotion();
  const principlesRef = useRef<HTMLDivElement>(null);
  const rm = prefersReducedMotion;

  const HERO_DUR = rm ? 0.01 : 0.65;

  // GSAP scroll-reveal for principles
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const container = principlesRef.current;
    if (!container) return;

    const items = container.querySelectorAll<HTMLElement>("[data-principle]");

    gsap.fromTo(
      items,
      { opacity: 0, y: rm ? 0 : 24 },
      {
        opacity: 1,
        y: 0,
        // UX reason: each principle reveals in sequence so the reader absorbs one before the next
        duration: rm ? 0.01 : 0.65,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: container,
          start: "top 75%",
          once: true,
        },
      },
    );

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [rm]);

  return (
    <div className="min-h-screen">

      {/* ══════════════════════════════════
          HEADER
      ══════════════════════════════════ */}
      <div className="container pt-32 md:pt-40 pb-0">
        <div className="grid grid-cols-mobile gap-grid-mobile md:grid-cols-tablet md:gap-grid-tablet lg:grid-cols-desktop lg:gap-grid-laptop xl:gap-grid-desktop">
          <div className="col-span-4 md:col-span-5 lg:col-span-8">
            <SectionLabel className="mb-4">
              About Hikmatyar
            </SectionLabel>

            {/* H1 — editorial statement, not "About Me" */}
            <motion.h1
              className="font-display text-display text-text"
              style={{ lineHeight: 0.9 }}
              initial={{ opacity: 0, y: rm ? 0 : 40 }}
              animate={{ opacity: 1, y: 0 }}
              // UX reason: headline settle confirms arrival and frames the personal tone of the page
              transition={{ duration: HERO_DUR, ease: EASE, delay: rm ? 0 : 0.1 }}
            >
              Brand work
              <br />
              is systems work.
            </motion.h1>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          INTRO — who I am, what I do
      ══════════════════════════════════ */}
      <div className="container py-20 md:py-28 border-t border-text/10 mt-16">
        <div className="grid grid-cols-mobile gap-grid-mobile md:grid-cols-tablet md:gap-grid-tablet lg:grid-cols-desktop lg:gap-grid-laptop xl:gap-grid-desktop">
          <motion.div
            className="col-span-4 md:col-span-5 lg:col-span-7"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            // UX reason: intro fades in as the reader arrives at it, pacing the narrative
            transition={{ duration: rm ? 0.01 : 0.65, ease: EASE }}
          >
            {/* [PLACEHOLDER COPY — replace with your real intro before launch] */}
            <p className="font-body text-body-lg text-text/85 leading-relaxed mb-6">
              I&rsquo;m a brand identity designer and growth strategist working
              with founders, studios, and independent creators. I design the
              systems that make a brand recognisable — and the strategies that
              make it findable.
            </p>
            <p className="font-body text-body-lg text-text/85 leading-relaxed mb-6">
              My practice spans three disciplines:{" "}
              <span className="text-text">brand identity</span>, where I build
              the visual and verbal language a brand lives in;{" "}
              <span className="text-text">campaign design</span>, where I give
              that language something to say; and{" "}
              <span className="text-text">growth systems</span>, where I build
              the infrastructure to distribute it.
            </p>
            <p className="font-body text-body-lg text-text/85 leading-relaxed">
              I keep all three in the same room because they compound each
              other. A brand without campaigns stays invisible. A campaign
              without identity is forgettable. Growth without a brand to grow
              is noise.
            </p>
          </motion.div>

          {/* Portrait + Capability words — right column */}
          <motion.div
            className="col-span-4 md:col-span-3 md:col-start-4 lg:col-span-4 lg:col-start-9 flex flex-col gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: rm ? 0.01 : 0.65, ease: EASE, delay: rm ? 0 : 0.15 }}
          >
            <div
              className="relative rounded-3xl overflow-hidden p-3 bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] group"
              style={{ aspectRatio: "3 / 4" }}
              data-cursor="true"
              data-cursor-text="Hikmatyar"
            >
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <Image
                  src="/placeholder-media/about/portrait.png"
                  alt="Hikmatyar — Brand Identity Designer"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 40vw, 30vw"
                  className="object-cover object-top transition-transform duration-reveal ease-out group-hover:scale-[1.03]"
                  priority={false}
                />
              </div>
            </div>

            <div className="hidden lg:flex flex-col">
              {["Brand strategy", "Visual identity", "Logo systems", "Brand guidelines", "Campaign design", "Motion", "AI automation", "Lead generation"].map(
                (word) => (
                  <p
                    key={word}
                    className="font-body text-eyebrow uppercase tracking-widest text-text/30 py-2 border-b border-text/8 last:border-0"
                  >
                    {word}
                  </p>
                ),
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ══════════════════════════════════
          HOW I WORK — 3 principles
          Editorial, not a numbered deck
      ══════════════════════════════════ */}
      <div className="container py-20 md:py-28 border-t border-text/10">
        <div className="grid grid-cols-mobile gap-grid-mobile md:grid-cols-tablet md:gap-grid-tablet lg:grid-cols-desktop lg:gap-grid-laptop xl:gap-grid-desktop mb-12">
          <div className="col-span-4 md:col-span-2 lg:col-span-2">
            <p className="font-body text-eyebrow uppercase tracking-widest text-text/35">
              How I work
            </p>
          </div>
        </div>

        <div ref={principlesRef} className="flex flex-col">
          {PRINCIPLES.map((p) => (
            <div
              key={p.id}
              data-principle
              style={{ opacity: 0 }}
              className="grid grid-cols-mobile gap-grid-mobile md:grid-cols-tablet md:gap-grid-tablet lg:grid-cols-desktop lg:gap-grid-laptop xl:gap-grid-desktop py-10 border-t border-text/10 first:border-t-0"
            >
              {/* Principle label */}
              <div className="col-span-4 md:col-span-3 lg:col-span-4 mb-3 md:mb-0">
                <p className="font-body text-body text-text" style={{ fontVariant: "small-caps" }}>
                  {p.label}
                </p>
              </div>
              {/* Principle description */}
              <div className="col-span-4 md:col-span-3 lg:col-span-6">
                <p className="font-body text-body text-text/60 leading-relaxed">
                  {p.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════
          CLOSING — personal line into footer
      ══════════════════════════════════ */}
      <div className="container py-20 md:py-28 border-t border-text/10">
        <div className="grid grid-cols-mobile gap-grid-mobile md:grid-cols-tablet md:gap-grid-tablet lg:grid-cols-desktop lg:gap-grid-laptop xl:gap-grid-desktop">
          <motion.div
            className="col-span-4 md:col-span-5 lg:col-span-7"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: rm ? 0.01 : 0.65, ease: EASE }}
          >
            {/* [PLACEHOLDER COPY — write in your own voice before launch] */}
            <p className="font-body text-body-lg text-text/70 leading-relaxed mb-8">
              If any of this sounds like what your project needs, I&rsquo;d
              like to hear about it.
            </p>
            <Link
              href="/contact"
              id="about-contact-cta"
              data-cursor="true"
              data-cursor-text="Let's Go"
              className="inline-block font-body text-eyebrow uppercase tracking-widest bg-accent text-bg px-7 py-3.5 rounded-full shadow-[0_0_20px_rgba(255,74,74,0.35)] transition-all duration-micro ease-out hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              Start a project
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Contact Strip / Footer renders via root layout — not duplicated here */}
    </div>
  );
}
