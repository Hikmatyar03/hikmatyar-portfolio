"use client";

import { useEffect } from "react";
import SectionLabel from "@/components/ui/SectionLabel";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Application Error]", error);
  }, [error]);

  return (
    <div className="container min-h-[70vh] flex flex-col justify-center items-start pt-32 pb-24">
      <SectionLabel className="mb-4">Error</SectionLabel>

      <h1
        className="font-display text-text text-5xl md:text-7xl mb-6"
        style={{ lineHeight: 0.95, letterSpacing: "-0.02em" }}
      >
        Something went wrong.
      </h1>

      <p className="font-body text-body-lg text-text/60 max-w-md mb-8">
        An unexpected error occurred while rendering this page.
      </p>

      <div className="flex items-center gap-4">
        <button
          onClick={() => reset()}
          data-cursor="true"
          data-cursor-text="Retry"
          className="inline-flex items-center gap-2 font-body text-eyebrow uppercase tracking-widest bg-accent text-bg px-6 py-3 rounded-sharp transition-opacity duration-micro ease-micro hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
