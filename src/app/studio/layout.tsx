// Studio layout — strips the site chrome (Nav, Footer, PageTransitionWrapper) so the
// embedded Sanity Studio can fill the full viewport unobstructed.
// Next.js App Router: this layout wraps /studio/** without removing the root layout's
// <html>/<body> shell — the studio's own NextStudio component handles the rest of the UI.

export const metadata = {
  title: "Sanity Studio — Hikmatyar Portfolio",
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
