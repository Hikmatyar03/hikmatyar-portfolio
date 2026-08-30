import type { Metadata } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import PageTransitionWrapper from "@/components/layout/PageTransitionWrapper";
import MagneticCursor from "@/components/cursor/MagneticCursor";
import InkBleedCursor from "@/components/cursor/InkBleedCursor";
import PagePreloader from "@/components/layout/PagePreloader";

export const metadata: Metadata = {
  title: "Hikmatyar — Brand Identity Designer",
  description:
    "Brand identity, campaign design, and growth systems. Work built with intent.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-bg text-text">
      {/*
        Tab order: Nav → main page content → Footer
        Nav is fixed; PageTransitionWrapper animates the page swap.
        Skip-to-content link ensures keyboard users can bypass the nav.
      */}
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
          {/* Skip-to-content — meets WCAG 2.4.1 */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-accent focus:text-bg focus:font-body focus:text-eyebrow focus:uppercase focus:tracking-widest focus:px-4 focus:py-2 focus:rounded-sharp"
          >
            Skip to content
          </a>

          {/* First visit preloader */}
          <PagePreloader />

          {/* Organic Ink Bleed Canvas Layer (z-index 30) */}
          <InkBleedCursor />

          {/* Magnetic GSAP cursor system with mix-blend-mode: difference */}
          <MagneticCursor />

          <Nav />

          <PageTransitionWrapper>
            <main id="main-content">{children}</main>
          </PageTransitionWrapper>

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
