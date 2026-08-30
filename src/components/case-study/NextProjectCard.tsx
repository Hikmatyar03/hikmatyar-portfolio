import Link from "next/link";
import type { CaseStudy } from "@/lib/types";

interface NextProjectCardProps {
  study: CaseStudy;
}

/**
 * Full-bleed "Next project" transition strip.
 * On hover, the hero thumbnail of the next project fades in blurred
 * behind the text — giving a preview without fully committing.
 * UX reason: reduces uncertainty before navigating; confirms what's next.
 */
export default function NextProjectCard({ study }: NextProjectCardProps) {
  const slug =
    typeof study.slug === "string" ? study.slug : study.slug.current;

  const pillarName =
    study.pillar && typeof study.pillar === "object"
      ? study.pillar.name
      : String(study.pillar ?? "");

  const heroUrl =
    study.heroMedia?.url ?? null;

  return (
    <div className="border-t border-text/10 mt-24 md:mt-32 relative overflow-hidden">
      {/* Background thumbnail — blurred, appears on hover via group */}
      {heroUrl && (
        <>
          {study.heroMedia?.mediaType === "video" ? (
            <video
              src={heroUrl}
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-page ease-out"
              style={{ filter: "blur(24px)", transform: "scale(1.08)" }}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-page ease-out"
              style={{ filter: "blur(24px)", transform: "scale(1.08)" }}
            />
          )}
        </>
      )}

      <Link
        href={`/work/${slug}`}
        id={`next-project-${slug}`}
        className="group container relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 py-16 md:py-24 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label={`Next project: ${study.title}`}
        data-cursor="true"
        data-cursor-text="Next"
      >
        {/* Label + pillar */}
        <div>
          <p className="font-body text-eyebrow uppercase tracking-widest text-text/35 mb-3">
            Next project
          </p>
          <p className="font-body text-eyebrow uppercase tracking-widest text-text/35">
            {pillarName}
          </p>
        </div>

        {/* Title — large, hover accent */}
        <div className="flex items-end gap-6">
          <h2
            className="font-display text-text group-hover:text-accent transition-colors duration-micro ease-out"
            style={{
              fontSize: "clamp(2.25rem, 5vw, 4.5rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.02em",
            }}
          >
            {study.title}
          </h2>
          {/* Arrow — moves right on hover */}
          <span
            className="font-display text-accent mb-1 transition-transform duration-micro ease-out group-hover:translate-x-2"
            style={{ fontSize: "2rem", lineHeight: 1 }}
            aria-hidden="true"
          >
            →
          </span>
        </div>
      </Link>
    </div>
  );
}
