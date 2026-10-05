import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCaseStudies, getCaseStudyBySlug, urlForImage } from "@/lib/sanity";
import IdentityTemplate from "@/components/case-study/IdentityTemplate";
import CampaignTemplate from "@/components/case-study/CampaignTemplate";

interface PageProps {
  params: { slug: string };
}

// ISR — stays in sync with Sanity edits
export const revalidate = 60;

/**
 * Pre-generate all case study slugs at build time.
 * Wraps around if Sanity is not connected (returns empty array gracefully).
 */
export async function generateStaticParams() {
  const studies = await getCaseStudies();
  if (!studies) return [];

  return studies.map((study) => ({
    slug: typeof study.slug === "string" ? study.slug : study.slug.current,
  }));
}

/** Per-page title, description, and OpenGraph metadata generated dynamically */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const study = await getCaseStudyBySlug(params.slug);
  if (!study) return { title: "Project" };

  const title = study.client || study.title;
  const description = study.description;

  // Resolve static Open Graph image (OG images must be static images, not video)
  let ogImage = "/og-image.png";
  const hero = study.heroMedia;
  const isVideo =
    hero?.mediaType === "video" ||
    hero?.url?.endsWith(".mp4") ||
    hero?.url?.endsWith(".webm") ||
    hero?.url?.endsWith(".mov");

  if (hero && hero.mediaType === "image" && !isVideo) {
    if (hero.url) {
      ogImage = hero.url;
    } else if (hero.image?.asset) {
      try {
        ogImage = urlForImage(hero.image).width(1200).height(630).url();
      } catch {
        ogImage = "/og-image.png";
      }
    }
  }

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Hikmatyar`,
      description,
      type: "article",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${title} — Hikmatyar Case Study`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Hikmatyar`,
      description,
      images: [ogImage],
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  // Fetch current study and full list in parallel (list needed for next-project navigation)
  const [study, allStudies] = await Promise.all([
    getCaseStudyBySlug(params.slug),
    getCaseStudies(),
  ]);

  if (!study) notFound();

  // Compute next project — wraps from last to first
  const studies = allStudies ?? [];
  const currentIndex = studies.findIndex((s) => {
    const slug = typeof s.slug === "string" ? s.slug : s.slug.current;
    return slug === params.slug;
  });
  const nextStudy =
    studies.length > 1
      ? (studies[(currentIndex + 1) % studies.length] ?? null)
      : null;

  // Route to the correct template — two genuinely different layouts
  if (study.templateType === "identity") {
    return <IdentityTemplate study={study} nextStudy={nextStudy} />;
  }

  if (study.templateType === "campaign") {
    return <CampaignTemplate study={study} nextStudy={nextStudy} />;
  }

  // Unknown templateType — should not happen if schema is enforced
  notFound();
}
