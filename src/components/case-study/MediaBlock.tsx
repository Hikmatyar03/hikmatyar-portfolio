import type { ProjectMedia } from "@/lib/types";

interface MediaBlockProps {
  media: ProjectMedia;
  /** CSS aspect-ratio value, e.g. "16/9" or "4/5" */
  aspectRatio?: string;
  priority?: boolean;
  className?: string;
}

/**
 * Renders a Sanity ProjectMedia object — image, video, or placeholder.
 * Always shows a dev badge when isPlaceholder is true.
 * Inner media element scales slightly on hover — UX reason: confirms interactivity
 * and adds depth to static gallery grids.
 */
export default function MediaBlock({
  media,
  aspectRatio = "16 / 9",
  className = "",
}: MediaBlockProps) {
  const isPlaceholder = media.isPlaceholder ?? true;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl bg-text/5 group ${className}`}
      style={{ aspectRatio }}
    >
      {/* Depth gradient — not a flat box */}
      <div className="absolute inset-0 bg-gradient-to-br from-text/10 via-text/5 to-transparent z-[1]" />

      {/* Direct video rendering */}
      {media.mediaType === "video" && media.url && (
        <video
          src={media.url}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover absolute inset-0 z-0 transition-transform duration-reveal ease-out group-hover:scale-[1.03]"
        />
      )}

      {/* Direct image rendering */}
      {media.mediaType === "image" && media.url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={media.url}
          alt={media.alt || "Case study media"}
          className="w-full h-full object-cover absolute inset-0 z-0 transition-transform duration-reveal ease-out group-hover:scale-[1.03]"
        />
      )}

      {/* Real video — when Sanity provides an asset URL */}
      {!media.url && !isPlaceholder && media.mediaType === "video" && media.video?.asset && (
        <div className="absolute inset-0 flex items-center justify-center z-[2]">
          <span className="font-body text-eyebrow uppercase tracking-widest text-text/30">
            Video
          </span>
        </div>
      )}

      {/* Caption */}
      {media.caption && (
        <p className="absolute bottom-3 left-4 right-4 z-[3] font-body text-eyebrow uppercase tracking-widest text-text/80 bg-bg/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/[0.08]">
          {media.caption}
        </p>
      )}

      {/* Dev-only placeholder badge */}
      {process.env.NODE_ENV === "development" && isPlaceholder && !media.url && (
        <span className="absolute top-2 left-2 z-10 bg-accent text-bg font-body text-eyebrow uppercase tracking-widest px-3 py-1 rounded-full pointer-events-none">
          Placeholder — replace
        </span>
      )}
    </div>
  );
}
