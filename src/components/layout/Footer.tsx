import Link from "next/link";

// Footer renders identically on every route — Phase 3 spec.
// Deliberately light: name, one line, two CTAs, copyright.
// Social links placeholder — wired to siteSettings in Phase 4 when getSiteSettings() is fetched server-side.

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-text/[0.08] mt-32 bg-bg/60 backdrop-blur-xl">
      <div className="container py-14 md:py-16">
        <div className="grid grid-cols-mobile gap-grid-mobile md:grid-cols-tablet md:gap-grid-tablet lg:grid-cols-desktop lg:gap-grid-laptop xl:gap-grid-desktop items-end">

          {/* ── Left: name + positioning line ── */}
          <div className="col-span-4 md:col-span-3 lg:col-span-4 mb-10 md:mb-0">
            <p
              className="font-display text-text mb-2"
              style={{ fontSize: "1.75rem", lineHeight: 1, letterSpacing: "-0.01em" }}
            >
              Hikmatyar
            </p>
            <p className="font-body text-body text-text/50 max-w-xs leading-relaxed">
              Brand identity, campaign design,&nbsp;growth systems.
            </p>
          </div>

          {/* ── Centre: CTAs ── */}
          <div className="col-span-4 md:col-span-3 md:col-start-4 lg:col-span-4 lg:col-start-5 flex flex-wrap gap-3 mb-10 md:mb-0">
            {/* Primary CTA */}
            <Link
              href="/contact"
              id="footer-cta-project"
              data-cursor="true"
              data-cursor-text="Let's Go"
              className="inline-block font-body text-eyebrow uppercase tracking-widest bg-accent text-bg px-6 py-3 rounded-full shadow-[0_0_20px_rgba(255,74,74,0.35)] transition-all duration-micro ease-micro hover:opacity-90 hover:shadow-[0_0_28px_rgba(255,74,74,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              Start a project
            </Link>
            {/* Secondary CTA — glass outlined */}
            <a
              href="https://cal.com/hikmatyar"
              target="_blank"
              rel="noopener noreferrer"
              id="footer-cta-call"
              data-cursor="true"
              data-cursor-text="Book"
              className="inline-block font-body text-eyebrow uppercase tracking-widest border border-text/[0.12] bg-text/[0.03] backdrop-blur-md text-text px-6 py-3 rounded-full transition-all duration-micro ease-micro hover:border-text/[0.25] hover:bg-text/[0.08] hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Book a call
            </a>
          </div>

          {/* ── Right: copyright ── */}
          <div className="col-span-4 md:col-span-2 md:col-start-7 lg:col-span-4 lg:col-start-9 flex items-end justify-start md:justify-end">
            <p className="font-body text-eyebrow uppercase tracking-widest text-text/30">
              &copy; {CURRENT_YEAR} Hikmatyar
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
