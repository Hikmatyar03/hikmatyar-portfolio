import Link from "next/link";
import SectionLabel from "@/components/ui/SectionLabel";

export default function NotFound() {
  return (
    <div className="container min-h-[70vh] flex flex-col justify-center items-start pt-32 pb-24">
      <SectionLabel className="mb-4">404 — Not Found</SectionLabel>

      <h1
        className="font-display text-text text-5xl md:text-7xl mb-6"
        style={{ lineHeight: 0.95, letterSpacing: "-0.02em" }}
      >
        This page does not exist.
      </h1>

      <p className="font-body text-body-lg text-text/60 max-w-md mb-8">
        The route you are looking for may have moved or no longer exists.
      </p>

      <Link
        href="/"
        data-cursor="true"
        data-cursor-text="Home"
        className="inline-flex items-center gap-3 font-body text-eyebrow uppercase tracking-widest bg-accent text-bg px-6 py-3 rounded-sharp transition-opacity duration-micro ease-micro hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        ← Return Home
      </Link>
    </div>
  );
}
