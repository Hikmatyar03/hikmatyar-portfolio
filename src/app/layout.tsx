import type { Metadata } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import PageTransitionWrapper from "@/components/layout/PageTransitionWrapper";
import MagneticCursor from "@/components/cursor/MagneticCursor";
import AsciiCursorScope from "@/components/cursor/AsciiCursorScope";
import PagePreloader from "@/components/layout/PagePreloader";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.hikmatyar.site"),
  title: {
    default: "Hikmatyar",
    template: "%s | Hikmatyar",
  },
  description:
    "Independent brand identity designer and campaign strategist working with founders, studios, and creators. Brand systems built with intent, not templates.",
  applicationName: "Hikmatyar Portfolio",
  authors: [{ name: "Hikmatyar", url: "https://www.hikmatyar.site" }],
  creator: "Hikmatyar",
  publisher: "Hikmatyar",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.hikmatyar.site",
    siteName: "Hikmatyar",
    title: "Hikmatyar — Brand Identity & Campaign Designer",
    description:
      "Independent brand identity designer and campaign strategist working with founders, studios, and creators. Brand systems built with intent, not templates.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Hikmatyar — Brand Identity & Campaign Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hikmatyar — Brand Identity & Campaign Designer",
    description:
      "Independent brand identity designer and campaign strategist working with founders, studios, and creators. Brand systems built with intent, not templates.",
    images: ["/og-image.png"],
    creator: "@hikmatyar",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.hikmatyar.site",
  },
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
        <JsonLd />
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

          {/* ASCII Ink Bleed cursor reaction layer (z-index 25, hero/landing only) */}
          <AsciiCursorScope />

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
