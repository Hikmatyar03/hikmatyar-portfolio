import { createImageUrlBuilder } from "@sanity/image-url";
import { createClient, groq } from "next-sanity";
import type { CaseStudy, ServicePillar, SiteSettings } from "./types";

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-08-18";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const hasSanityConfig = Boolean(projectId && dataset);

export const client = createClient({
  projectId: projectId || "demo1234",
  dataset,
  apiVersion,
  useCdn: true,
});

const imageBuilder = createImageUrlBuilder(client);

export const CASE_STUDY_BY_SLUG_QUERY = groq`*[
  _type == "caseStudy" && slug.current == $slug
][0]{
  _id,
  _type,
  title,
  slug,
  pillar->{
    _id,
    _type,
    name,
    slug,
    oneLineDescription,
    capabilityWords
  },
  templateType,
  year,
  client,
  isOwnVenture,
  description,
  heroMedia,
  gallery,
  context,
  challenge,
  strategicIdea,
  identitySystemNotes,
  outcome,
  credits,
  brief,
  concept,
  reach
}`;

export const CASE_STUDIES_QUERY = groq`*[
  _type == "caseStudy" && defined(slug.current)
] | order(coalesce(year, 0) desc, title asc){
  _id,
  _type,
  title,
  slug,
  pillar->{
    _id,
    _type,
    name,
    slug,
    oneLineDescription,
    capabilityWords
  },
  templateType,
  year,
  client,
  isOwnVenture,
  description,
  heroMedia
}`;

export const SERVICE_PILLARS_QUERY = groq`*[
  _type == "servicePillar" && defined(slug.current)
] | order(name asc){
  _id,
  _type,
  name,
  slug,
  oneLineDescription,
  capabilityWords
}`;

export const SITE_SETTINGS_QUERY = groq`*[_type == "siteSettings"][0]{
  _id,
  _type,
  heroHeadline,
  heroSubline,
  aboutShortCopy,
  contactEmail,
  socialLinks
}`;

type FetchOptions = {
  revalidate?: number;
};

export async function sanityFetch<T>(
  query: string,
  params: Record<string, string | number | boolean> = {},
  options: FetchOptions = {},
) {
  if (!hasSanityConfig) {
    console.warn(
      "[Sanity] Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Add .env.local before querying Content Lake.",
    );

    return null as T | null;
  }

  return client.fetch<T>(query, params, {
    next: { revalidate: options.revalidate ?? 60 },
  });
}

const brandIdentityPillar: ServicePillar = {
  _id: "servicePillar-brand-identity",
  _type: "servicePillar",
  name: "Brand & Identity",
  slug: { _type: "slug", current: "brand-identity" },
  oneLineDescription: "Brand strategy, logo systems, identity design, and usage guidelines.",
  capabilityWords: ["Strategy", "Identity", "Logos", "Guidelines"],
};

const campaignContentPillar: ServicePillar = {
  _id: "servicePillar-campaign-content",
  _type: "servicePillar",
  name: "Campaign & Content",
  slug: { _type: "slug", current: "campaign-content" },
  oneLineDescription: "Campaign design, cover art, motion, social, and launch content.",
  capabilityWords: ["Campaigns", "Cover art", "Motion", "Launch"],
};

export const DEFAULT_CASE_STUDIES: CaseStudy[] = [
  {
    _id: "caseStudy-studio-buntu",
    _type: "caseStudy",
    title: "Studio Buntu",
    slug: { _type: "slug", current: "studio-buntu" },
    pillar: brandIdentityPillar,
    templateType: "identity",
    year: 2024,
    client: "Studio Buntu",
    isOwnVenture: false,
    description:
      "Comprehensive brand identity, visual system, and motion direction for Studio Buntu — a contemporary design practice.",
    heroMedia: {
      _type: "projectMedia",
      mediaType: "video",
      url: "/placeholder-media/studio-buntu/Buntu.mp4",
      alt: "Studio Buntu Motion Reel",
      isPlaceholder: false,
    },
    gallery: [
      {
        _type: "projectMedia",
        mediaType: "image",
        url: "/placeholder-media/studio-buntu/01.png",
        alt: "Studio Buntu Brand Identity System",
        caption: "Identity System Overview",
        isPlaceholder: false,
      },
      {
        _type: "projectMedia",
        mediaType: "image",
        url: "/placeholder-media/studio-buntu/03.png",
        alt: "Typography and Color Architecture",
        caption: "Typography & Color Architecture",
        isPlaceholder: false,
      },
      {
        _type: "projectMedia",
        mediaType: "image",
        url: "/placeholder-media/studio-buntu/02.png",
        alt: "Brand Applications and Collateral",
        caption: "Stationery & Printed Applications",
        isPlaceholder: false,
      },
      {
        _type: "projectMedia",
        mediaType: "image",
        url: "/placeholder-media/studio-buntu/04.png",
        alt: "Digital Interface and Web Guidelines",
        caption: "Digital Touchpoints & UI Grid",
        isPlaceholder: false,
      },
      {
        _type: "projectMedia",
        mediaType: "image",
        url: "/placeholder-media/studio-buntu/05.png",
        alt: "Social Launch Content & Motion Assets",
        caption: "Social Launch Content & Campaign Assets",
        isPlaceholder: false,
      },
    ],
    context:
      "Studio Buntu required an editorial identity system and motion framework to establish their visual positioning across physical collateral, digital touchpoints, and brand launches.",
    challenge:
      "Creating an identity that balances high contrast editorial minimalism with fluid motion, without sacrificing legibility or commercial impact.",
    strategicIdea:
      "Form follows intent — a sharp, disciplined typographic system paired with rhythmic motion.",
    identitySystemNotes:
      "Built around custom typographic hierarchy, monochrome contrast with warm undertones, and structured grid compositions that scale across web and print.",
    outcome:
      "Delivered a complete, scalable brand identity kit, motion guidelines, and launch content system.",
  },
  {
    _id: "caseStudy-shawls-and-soul",
    _type: "caseStudy",
    title: "Shawls & Soul",
    slug: { _type: "slug", current: "shawls-and-soul" },
    pillar: brandIdentityPillar,
    templateType: "identity",
    year: 2024,
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
  },
  {
    _id: "caseStudy-blu-x",
    _type: "caseStudy",
    title: "BLU X",
    slug: { _type: "slug", current: "blu-x" },
    pillar: brandIdentityPillar,
    templateType: "identity",
    year: 2024,
    client: "BLU X",
    description: "Next-gen mobility and digital product brand identity system.",
  },
  {
    _id: "caseStudy-techfest-ims",
    _type: "caseStudy",
    title: "TechFest IMS",
    slug: { _type: "slug", current: "techfest-ims" },
    pillar: campaignContentPillar,
    templateType: "campaign",
    year: 2024,
    client: "TechFest IMS",
    description: "Full campaign design, motion graphics, and social launch architecture.",
    brief: "Create an unmistakable event identity and launch campaign for TechFest IMS.",
    concept: "Hyper-kinetic technology in motion.",
  },
];

export async function getCaseStudyBySlug(slug: string) {
  const res = await sanityFetch<CaseStudy>(CASE_STUDY_BY_SLUG_QUERY, { slug });
  if (res) return res;
  return DEFAULT_CASE_STUDIES.find((s) => {
    const sSlug = typeof s.slug === "string" ? s.slug : s.slug.current;
    return sSlug === slug;
  }) ?? null;
}

export async function getCaseStudies() {
  const res = await sanityFetch<CaseStudy[]>(CASE_STUDIES_QUERY);
  if (res && res.length > 0) return res;
  return DEFAULT_CASE_STUDIES;
}

export async function getServicePillars() {
  return sanityFetch<ServicePillar[]>(SERVICE_PILLARS_QUERY);
}

export async function getSiteSettings() {
  return sanityFetch<SiteSettings>(SITE_SETTINGS_QUERY);
}

export function urlForImage(
  source: Parameters<(typeof imageBuilder)["image"]>[0],
) {
  return imageBuilder.image(source);
}
