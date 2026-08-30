export type Slug = {
  _type: "slug";
  current: string;
};

export type SanityReference = {
  _type: "reference";
  _ref: string;
};

export type SanityImage = {
  _type: "image";
  asset?: SanityReference;
  alt?: string;
};

export type SanityFile = {
  _type: "file";
  asset?: SanityReference;
};

export type ProjectMedia = {
  _type: "projectMedia";
  mediaType: "image" | "video";
  image?: SanityImage;
  video?: SanityFile;
  poster?: SanityImage;
  alt?: string;
  caption?: string;
  isPlaceholder?: boolean;
  url?: string;
};

export type ServicePillar = {
  _id: string;
  _type: "servicePillar";
  name: "Brand & Identity" | "Campaign & Content" | "Growth & Automation";
  slug: Slug | string;
  oneLineDescription: string;
  capabilityWords?: string[];
};

export type CaseStudyTemplate = "identity" | "campaign";

export type CaseStudy = {
  _id: string;
  _type: "caseStudy";
  title: string;
  slug: Slug | string;
  pillar: ServicePillar;
  templateType: CaseStudyTemplate;
  year?: number;
  client?: string;
  isOwnVenture?: boolean;
  description: string;
  heroMedia?: ProjectMedia;
  gallery?: ProjectMedia[];
  context?: string;
  challenge?: string;
  strategicIdea?: string;
  identitySystemNotes?: string;
  outcome?: string;
  credits?: Array<{
    name?: string;
    role?: string;
  }>;
  brief?: string;
  concept?: string;
  reach?: string;
};

export type SiteSettings = {
  _id: string;
  _type: "siteSettings";
  heroHeadline?: string;
  heroSubline?: string;
  aboutShortCopy?: string;
  contactEmail?: string;
  socialLinks?: Array<{
    label: string;
    url: string;
  }>;
};
