import { MetadataRoute } from "next";
import { getCaseStudies } from "@/lib/sanity";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hikmatyar.com";

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/work`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Dynamic case study routes from Sanity
  const studies = await getCaseStudies();
  const caseStudyRoutes: MetadataRoute.Sitemap = (studies || []).map((study) => {
    const slugStr = typeof study.slug === "string" ? study.slug : study.slug?.current || "";
    return {
      url: `${baseUrl}/work/${slugStr}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    };
  });

  return [...staticRoutes, ...caseStudyRoutes];
}
