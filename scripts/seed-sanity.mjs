import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-08-18";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "Missing Sanity env. Set NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and SANITY_API_WRITE_TOKEN before running npm run sanity:seed.",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const placeholderCopy = "[PLACEHOLDER COPY]";

const pillars = [
  {
    _id: "servicePillar-brand-identity",
    _type: "servicePillar",
    name: "Brand & Identity",
    slug: { _type: "slug", current: "brand-identity" },
    oneLineDescription:
      "Brand strategy, logo systems, identity design, and usage guidelines.",
    capabilityWords: ["Strategy", "Identity", "Logos", "Guidelines"],
  },
  {
    _id: "servicePillar-campaign-content",
    _type: "servicePillar",
    name: "Campaign & Content",
    slug: { _type: "slug", current: "campaign-content" },
    oneLineDescription:
      "Campaign design, cover art, motion, social, and launch content.",
    capabilityWords: ["Campaigns", "Cover art", "Motion", "Launch"],
  },
  {
    _id: "servicePillar-growth-automation",
    _type: "servicePillar",
    name: "Growth & Automation",
    slug: { _type: "slug", current: "growth-automation" },
    oneLineDescription:
      "AI automation, B2B lead generation, outreach, and growth systems.",
    capabilityWords: ["AI systems", "Lead gen", "Outreach", "Ops"],
  },
];

const identityProjectTitles = [
  "Shawls & Soul",
  "BLU X",
  "Blue Bridge LLC",
  "OURA",
  "Stoke Gadget",
  "SDC",
  "Zyphra",
  "CropIQ",
  "Studio Buntu",
];

const campaignProjectTitles = ["TechFest IMS", "GDGoC IMSciences"];

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function placeholderMedia(title) {
  return {
    _type: "projectMedia",
    mediaType: "image",
    alt: `${placeholderCopy} Hero media for ${title}`,
    caption: placeholderCopy,
    isPlaceholder: true,
  };
}

const identityProjects = identityProjectTitles.map((title) => {
  const isOwnVenture = title === "Shawls & Soul";

  return {
    _id: `caseStudy-${slugify(title)}`,
    _type: "caseStudy",
    title,
    slug: { _type: "slug", current: slugify(title) },
    pillar: { _type: "reference", _ref: "servicePillar-brand-identity" },
    templateType: "identity",
    client: isOwnVenture ? undefined : title,
    isOwnVenture,
    description: placeholderCopy,
    heroMedia: placeholderMedia(title),
    gallery: [],
    context: placeholderCopy,
    challenge: placeholderCopy,
    strategicIdea: placeholderCopy,
    identitySystemNotes: placeholderCopy,
    outcome: placeholderCopy,
    credits: [],
  };
});

const campaignProjects = campaignProjectTitles.map((title) => ({
  _id: `caseStudy-${slugify(title)}`,
  _type: "caseStudy",
  title,
  slug: { _type: "slug", current: slugify(title) },
  pillar: { _type: "reference", _ref: "servicePillar-campaign-content" },
  templateType: "campaign",
  client: title,
  isOwnVenture: false,
  description: placeholderCopy,
  heroMedia: placeholderMedia(title),
  gallery: [],
  brief: placeholderCopy,
  concept: placeholderCopy,
  reach: placeholderCopy,
}));

const siteSettings = {
  _id: "siteSettings-main",
  _type: "siteSettings",
  heroHeadline: "Brand identity, built with intent.",
  heroSubline: placeholderCopy,
  aboutShortCopy: placeholderCopy,
  contactEmail: "hikmodesiner03@gmail.com",
  socialLinks: [],
};

const documents = [
  ...pillars,
  ...identityProjects,
  ...campaignProjects,
  siteSettings,
];

const transaction = documents.reduce(
  (current, document) => current.createOrReplace(document),
  client.transaction(),
);

await transaction.commit({ visibility: "sync" });

console.log(
  `Seeded ${documents.length} Sanity documents into ${projectId}/${dataset}.`,
);
