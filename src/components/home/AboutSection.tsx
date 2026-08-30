"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import StatBadge from "@/components/ui/StatBadge";
import MarqueeStrip from "@/components/ui/MarqueeStrip";

import { ClientLogo } from "@/lib/logos";

interface AboutSectionProps {
  copy?: string;
  logos?: ClientLogo[];
}

// Fallback copy if siteSettings.aboutShortCopy is not yet set in Sanity
const FALLBACK_COPY =
  "I work across brand identity, campaign design, and growth automation — three disciplines that sharpen each other. A brand without campaigns stays invisible. A campaign without identity is forgettable. Growth without a brand to grow is noise. I build all three as a single system.";

const EASE: [number, number, number, number] = [0, 0, 0.2, 1];

const MARQUEE_CLIENTS = [
  "Studio Buntu",
  "Shawls & Soul",
  "Blu-X",
  "TechFest IMS",
  "Brand Systems",
  "Campaign Direction",
  "AI Automation",
];

export default function AboutSection({ copy, logos }: AboutSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const rm = prefersReducedMotion;

  const displayCopy =
    copy && copy !== "[PLACEHOLDER COPY]" ? copy : FALLBACK_COPY;

  return (
    <section
      id="about"
      className="py-24 md:py-32 border-t border-text/10 overflow-hidden"
      aria-label="About"
    >
      <div className="container">
        <div className="grid grid-cols-mobile gap-grid-mobile md:grid-cols-tablet md:gap-grid-tablet lg:grid-cols-desktop lg:gap-grid-laptop xl:gap-grid-desktop items-start">
          {/* ── Copy column ── */}
          <motion.div
            className="col-span-4 md:col-span-4 lg:col-span-7 order-2 md:order-1 p-6 md:p-10 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            // UX reason: gentle fade-in creates a calm reading moment after the motion-heavy sections above it
            transition={{ duration: rm ? 0.01 : 0.65, ease: EASE }}
          >
            <SectionLabel className="mb-4">Who I am</SectionLabel>

            <h2
              className="font-display text-text text-3xl md:text-5xl mb-6 md:mb-8"
              style={{ lineHeight: 1, letterSpacing: "-0.02em" }}
            >
              Intent over volume.
            </h2>

            <p className="font-body text-body-lg text-text/85 leading-relaxed mb-6">
              {displayCopy}
            </p>

            {/* Range line — inline text */}
            <p className="font-body text-body text-text/50 mb-8">
              From{" "}
              <span className="text-text/90 font-medium">Shawls &amp; Soul</span>{" "}
              to{" "}
              <span className="text-text/90 font-medium">mehbob.mov</span> — one
              approach, applied across categories.
            </p>

            {/* Stat badges row (A6) */}
            <div className="flex flex-wrap gap-3 pt-6 border-t border-white/[0.08]">
              <StatBadge>Independent Designer</StatBadge>
              <StatBadge>B2B &amp; Consumer</StatBadge>
              <StatBadge>End-to-End Delivery</StatBadge>
            </div>
          </motion.div>

          {/* ── Photo column ── */}
          <motion.div
            className="col-span-4 md:col-span-2 md:col-start-5 lg:col-span-4 lg:col-start-9 order-1 md:order-2 mb-8 md:mb-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            // UX reason: slight delay so copy and photo don't compete — photo arrives after the reader starts reading
            transition={{
              duration: rm ? 0.01 : 0.65,
              ease: EASE,
              delay: rm ? 0 : 0.15,
            }}
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
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover object-top transition-transform duration-reveal ease-out group-hover:scale-[1.03]"
                  priority={false}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Marquee Strip (A5) with dynamic client logos */}
      <MarqueeStrip logos={logos} items={!logos || logos.length === 0 ? MARQUEE_CLIENTS : undefined} duration="28s" />
    </section>
  );
}
