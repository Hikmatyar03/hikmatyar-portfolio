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

  if (isOwnVenture) {
    return {
      _id: `caseStudy-${slugify(title)}`,
      _type: "caseStudy",
      title,
      slug: { _type: "slug", current: slugify(title) },
      pillar: { _type: "reference", _ref: "servicePillar-brand-identity" },
      templateType: "identity",
      client: undefined,
      isOwnVenture: true,
      description:
        "Artisan textile venture celebrating centuries-old handloom heritage with disciplined modern luxury branding.",
      heroMedia: {
        _type: "projectMedia",
        mediaType: "image",
        url: "/placeholder-media/shawls-and-soul/01-hero-flagship.png",
        alt: "Shawls & Soul Digital Flagship Experience",
        caption: "Digital Flagship Store & Web Experience",
        isPlaceholder: false,
      },
      gallery: [
        {
          _type: "projectMedia",
          mediaType: "image",
          url: "/placeholder-media/shawls-and-soul/02-brand-identity-board.png",
          alt: "Shawls & Soul Comprehensive Brand Identity Board",
          caption: "Brand Identity Board & System Guidelines",
          isPlaceholder: false,
        },
        {
          _type: "projectMedia",
          mediaType: "image",
          url: "/placeholder-media/shawls-and-soul/03-brand-moodboard.png",
          alt: "Shawls & Soul Creative Direction & Moodboard",
          caption: "Creative Direction, Color Palette & Material Architecture",
          isPlaceholder: false,
        },
        {
          _type: "projectMedia",
          mediaType: "image",
          url: "/placeholder-media/shawls-and-soul/04-packaging-unboxing.png",
          alt: "Shawls & Soul Bespoke Luxury Packaging & Unboxing Suite",
          caption: "Bespoke Packaging, Rigid Gift Box & Unboxing Suite",
          isPlaceholder: false,
        },
        {
          _type: "projectMedia",
          mediaType: "image",
          url: "/placeholder-media/shawls-and-soul/05-artisanal-collateral.png",
          alt: "Artisanal Branding Collateral, Care Cards & Woven Tags",
          caption: "Tactile Collateral, Authenticity Card & Woven Labels",
          isPlaceholder: false,
        },
        {
          _type: "projectMedia",
          mediaType: "image",
          url: "/placeholder-media/shawls-and-soul/06-swat-editorial.png",
          alt: "Rooted in Heritage — Swat Editorial Campaign",
          caption: "Editorial Campaign — Rooted in Heritage, Crafted for Today",
          isPlaceholder: false,
        },
        {
          _type: "projectMedia",
          mediaType: "image",
          url: "/placeholder-media/shawls-and-soul/07-macro-artisan-tag.png",
          alt: "Handwoven Swati Shawl with Custom Embossed Brand Tag",
          caption: "Macro Material Detailing & Custom Embossed Tag",
          isPlaceholder: false,
        },
      ],
      context:
        "I founded Shawls & Soul to bridge Swat's centuries-old handloom weaving heritage with contemporary luxury branding. As an indigenous artisan craft, Swati shawl weaving represents generational skill and cultural heritage, yet traditional makers lacked the visual positioning and digital infrastructure to reach a discerning global audience.",
      challenge:
        "Translating an organic, tactile heritage craft into a disciplined luxury brand identity system without losing the authentic warmth of the loom or falling into commercial clichés.",
      strategicIdea:
        "Weaving stories into every thread — elevating raw artisanal heritage into timeless modern luxury.",
      identitySystemNotes:
        "The identity system balances high-contrast editorial typography with warm earthy tones inspired by nature and Swat's landscape: Charcoal (#2B2B2B), Ivory (#F5EBDD), Earth Brown (#8A5E46), and Heritage Rust (#A44B2F). The dynamic 'S' glyph combines the fluid motion of yarn with architectural precision, anchored by refined Cormorant Garamond serif and disciplined Inter sans-serif.",
      outcome:
        "Built an end-to-end brand ecosystem from logo mark and packaging architecture to a digital flagship store, establishing Shawls & Soul as an artisanal luxury house.",
      credits: [],
    };
  }

  return {
    _id: `caseStudy-${slugify(title)}`,
    _type: "caseStudy",
    title,
    slug: { _type: "slug", current: slugify(title) },
    pillar: { _type: "reference", _ref: "servicePillar-brand-identity" },
    templateType: "identity",
    client: title,
    isOwnVenture: false,
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
