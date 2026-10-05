import type { Metadata } from "next";
import { getCaseStudies, getServicePillars } from "@/lib/sanity";
import WorkArchive from "@/components/work/WorkArchive";

export const metadata: Metadata = {
  title: "Selected Work",
  description:
    "Brand identity and campaign design case studies including Studio Buntu, Shawls & Soul, BLU X, and TechFest IMS — systems-first work built with intent.",
};

// ISR: stays in sync with Sanity content
export const revalidate = 60;

export default async function WorkPage() {
  const [caseStudies, pillars] = await Promise.all([
    getCaseStudies(),
    getServicePillars(),
  ]);

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="container pt-32 pb-0 md:pt-40">
        <div className="grid grid-cols-mobile gap-grid-mobile md:grid-cols-tablet md:gap-grid-tablet lg:grid-cols-desktop lg:gap-grid-laptop xl:gap-grid-desktop">
          <div className="col-span-4 md:col-span-5 lg:col-span-8 pb-12 md:pb-16">
            <p className="font-body text-eyebrow uppercase tracking-widest text-text/35 mb-4">
              Work
            </p>
            <h1
              className="font-display text-display text-text"
              style={{ lineHeight: 0.9 }}
            >
              All projects
            </h1>
          </div>
        </div>
      </div>

      {/* Filter + grid — client component handles interactivity */}
      <WorkArchive
        studies={caseStudies ?? []}
        pillars={pillars ?? []}
      />
    </div>
  );
}
