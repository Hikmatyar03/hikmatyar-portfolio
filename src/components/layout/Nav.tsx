"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

const NAV_LINKS = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

function SunIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close overlay when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const rm = prefersReducedMotion;

  // Section-reveal tier: 650ms, ease-out, 80ms stagger per child
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: rm ? 0 : 0.08,
        delayChildren: rm ? 0 : 0.05,
      },
    },
    exit: {
      transition: {
        staggerChildren: rm ? 0 : 0.04,
        staggerDirection: -1,
      },
    },
  };

  const linkVariants: Variants = {
    hidden: { opacity: 0, y: rm ? 0 : 28 },
    visible: {
      opacity: 1,
      y: 0,
      // UX reason: staggered entrance paces the eye across menu items, making the overlay feel intentional not sudden
      transition: { duration: rm ? 0.01 : 0.65, ease: [0.0, 0.0, 0.2, 1] },
    },
    exit: {
      opacity: 0,
      y: rm ? 0 : 12,
      transition: { duration: rm ? 0.01 : 0.3, ease: [0.4, 0.0, 1, 1] },
    },
  };

  const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      // UX reason: fade confirms the overlay is a distinct layer above page content
      transition: { duration: rm ? 0.01 : 0.25, ease: [0.0, 0.0, 0.2, 1] },
    },
    exit: {
      opacity: 0,
      transition: { duration: rm ? 0.01 : 0.2, ease: [0.4, 0.0, 1, 1] },
    },
  };

  return (
    <>
      {/* ── Floating centered glass navbar with rounded corners ── */}
      <header className="fixed top-5 md:top-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
        <div className="pointer-events-auto flex items-center justify-between gap-4 md:gap-8 px-5 md:px-6 py-2.5 md:py-3 rounded-full bg-bg/80 backdrop-blur-2xl backdrop-saturate-150 border border-text/[0.12] shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all duration-ui w-full max-w-[94%] sm:max-w-xl md:max-w-2xl">
          {/* Wordmark */}
          <Link
            href="/"
            data-cursor="true"
            data-cursor-text="Home"
            className="font-display text-text hover:text-accent transition-colors duration-micro ease-micro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg shrink-0"
            style={{ fontSize: "1.15rem", letterSpacing: "-0.01em", lineHeight: 1 }}
            aria-label="Hikmatyar — home"
          >
            Hikmatyar
          </Link>

          {/* Desktop navigation with glass-pill hover states */}
          <nav aria-label="Primary navigation" className="hidden md:block">
            <ul className="flex items-center gap-1.5 list-none m-0 p-0">
              {NAV_LINKS.map(({ href, label }) => {
                const isActive = pathname?.startsWith(href) ?? false;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      data-cursor="true"
                      data-cursor-text="Open"
                      className={[
                        "font-body text-eyebrow uppercase tracking-widest px-3.5 py-1.5 rounded-full",
                        "transition-all duration-micro ease-micro inline-block",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                        isActive
                          ? "text-accent bg-text/[0.08] border border-text/[0.12] shadow-sm"
                          : "text-text/70 hover:text-text hover:bg-text/[0.05]",
                      ].join(" ")}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Actions: Theme Toggle + Mobile Menu Button */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              type="button"
              id="theme-toggle"
              data-cursor="true"
              data-cursor-text="Theme"
              onClick={toggleTheme}
              className="relative flex items-center justify-center w-8 h-8 rounded-full border border-text/[0.12] bg-text/[0.04] hover:bg-text/[0.08] text-text/80 hover:text-accent transition-all duration-micro ease-micro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent shrink-0"
              aria-label={
                mounted
                  ? `Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`
                  : "Toggle theme"
              }
            >
              {mounted ? (
                resolvedTheme === "dark" ? (
                  <SunIcon />
                ) : (
                  <MoonIcon />
                )
              ) : (
                <span className="w-3.5 h-3.5 block" />
              )}
            </button>

            {/* Mobile menu toggle — tactile glass pill */}
            <button
              id="mobile-menu-toggle"
              data-cursor="true"
              data-cursor-text="Menu"
              className="md:hidden font-body text-eyebrow uppercase tracking-widest text-text/80 hover:text-accent px-3.5 py-1 rounded-full border border-text/[0.12] bg-text/[0.05] backdrop-blur-md transition-all duration-micro ease-micro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      {/* ── Full-screen mobile overlay with frosted backdrop ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="fixed inset-0 z-40 bg-bg/95 backdrop-blur-2xl flex flex-col justify-end md:hidden"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Nav items anchored to bottom — editorial, confident */}
            <nav className="container pb-16" aria-label="Mobile navigation">
              <motion.ul
                className="list-none m-0 p-0 flex flex-col gap-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {NAV_LINKS.map(({ href, label }) => {
                  const isActive = pathname?.startsWith(href) ?? false;
                  return (
                    <motion.li key={href} variants={linkVariants}>
                      <Link
                        href={href}
                        className={[
                          "font-display block transition-colors duration-micro ease-micro",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                          isActive ? "text-accent" : "text-text hover:text-accent",
                        ].join(" ")}
                        style={{
                          fontSize: "clamp(2.75rem, 10vw, 5.5rem)",
                          lineHeight: "0.92",
                          letterSpacing: "-0.02em",
                        }}
                        aria-current={isActive ? "page" : undefined}
                        onClick={() => setMenuOpen(false)}
                      >
                        {label}
                      </Link>
                    </motion.li>
                  );
                })}
              </motion.ul>

              {/* Eyebrow label & theme switcher row */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-text/[0.08]">
                <p className="font-body text-eyebrow uppercase tracking-widest text-text/40">
                  Hikmatyar — Brand Identity Designer
                </p>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="font-body text-eyebrow uppercase tracking-widest text-text/70 hover:text-accent flex items-center gap-2 px-3 py-1.5 rounded-full border border-text/[0.12] bg-text/[0.04]"
                >
                  {mounted && resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
                  <span>{mounted && resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

