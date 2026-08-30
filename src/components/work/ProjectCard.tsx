import Link from "next/link";
import type { CaseStudy } from "@/lib/types";
import CategoryTag from "@/components/ui/CategoryTag";

interface ProjectCardProps {
  study: CaseStudy;
  /** Alternating ratio for visual rhythm across a card row */
  ratio: "portrait" | "landscape";
  /** Optional index for unique IDs */
  index?: number;
}

export default function ProjectCard({ study, ratio, index = 0 }: ProjectCardProps) {
  const slug =
    typeof study.slug === "string" ? study.slug : study.slug.current;

  const pillarName =
    study.pillar && typeof study.pillar === "object"
      ? study.pillar.name
      : String(study.pillar ?? "");

  // Mixed-ratio grid: portrait = 4:5, landscape = 3:2
  const aspectStyle =
    ratio === "portrait"
      ? { aspectRatio: "4 / 5" }
      : { aspectRatio: "3 / 2" };

  const isPlaceholder =
    !study.heroMedia || study.heroMedia.isPlaceholder;

  const descriptionIsPlaceholder =
    !study.description || study.description === "[PLACEHOLDER COPY]";

  return (
    <article className="h-full">
      <Link
        href={`/work/${slug}`}
        id={`project-card-${slug}-${index}`}
        data-cursor="true"
        data-cursor-text="View"
        className="group flex flex-col h-full p-4 md:p-5 rounded-3xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] hover:border-white/[0.2] backdrop-blur-xl transition-all duration-ui shadow-[0_8px_32px_rgba(0,0,0,0.25)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label={`View case study: ${study.title}`}
      >
        {/* ── Media block ── */}
        <div
          className="relative w-full overflow-hidden rounded-2xl mb-5 bg-text/5 border border-white/[0.06]"
          style={aspectStyle}
        >
          {/* Direct video rendering */}
          {study.heroMedia?.mediaType === "video" && study.heroMedia.url && (
            <video
              src={study.heroMedia.url}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover absolute inset-0 z-0 transition-transform duration-reveal ease-out group-hover:scale-[1.03]"
            />
          )}

          {/* Direct image rendering */}
          {study.heroMedia?.mediaType === "image" && study.heroMedia.url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={study.heroMedia.url}
              alt={study.heroMedia.alt || study.title}
              className="w-full h-full object-cover absolute inset-0 z-0 transition-transform duration-reveal ease-out group-hover:scale-[1.03]"
            />
          )}

          {/* Subtle gradient placeholder — not a gray box, has depth */}
          {!study.heroMedia?.url && (
            <div className="absolute inset-0 bg-gradient-to-br from-text/8 via-text/4 to-transparent" />
          )}

          {/* Hover tint — micro tier */}
          <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-[0.04] transition-opacity duration-micro ease-out z-10" />

          {/* Dev-only placeholder badge */}
          {process.env.NODE_ENV === "development" && isPlaceholder && !study.heroMedia?.url && (
            <span className="absolute top-2 left-2 z-10 bg-accent text-bg font-body text-eyebrow uppercase tracking-widest px-3 py-1 rounded-full pointer-events-none">
              Placeholder — replace
            </span>
          )}
        </div>

        {/* ── Card metadata ── */}
        <div className="flex flex-col gap-2 flex-grow justify-between">
          <div>
            {/* Pillar tag & Year */}
            <div className="flex items-center gap-3 mb-2">
              <CategoryTag>{pillarName}</CategoryTag>
              {study.year && (
                <span className="font-body text-eyebrow uppercase tracking-widest text-text/40">
                  {study.year}
                </span>
              )}
            </div>

            {/* Title */}
            <h3
              className="font-display text-text group-hover:text-accent transition-colors duration-micro ease-out"
              style={{ fontSize: "1.45rem", lineHeight: 1.1, letterSpacing: "-0.01em" }}
            >
              {study.title}
            </h3>

            {/* Description */}
            {!descriptionIsPlaceholder && (
              <p className="font-body text-body text-text/60 mt-2 line-clamp-2 leading-relaxed">
                {study.description}
              </p>
            )}
          </div>

          {/* CTA */}
          <p className="font-body text-eyebrow uppercase tracking-widest text-text/40 group-hover:text-accent mt-4 transition-colors duration-micro ease-out inline-flex items-center gap-1">
            <span>View case</span>
            <span className="transition-transform duration-micro group-hover:translate-x-1">→</span>
          </p>
        </div>
      </Link>
    </article>
  );
}
