"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

interface PageTransitionWrapperProps {
  children: React.ReactNode;
}

export default function PageTransitionWrapper({ children }: PageTransitionWrapperProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  // Page transition tier: 700–1000ms, crossfade + 20px vertical settle.
  // UX reason: the 20px settle confirms a new page has arrived and orients
  // the user's eye to the top of the incoming content.
  const variants = prefersReducedMotion
    ? {
        // Reduced-motion: opacity swap only — no transform at all
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
      };

  const duration = prefersReducedMotion ? 0.01 : 0.85;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={variants.initial}
        animate={variants.animate}
        exit={variants.exit}
        transition={{ duration, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
