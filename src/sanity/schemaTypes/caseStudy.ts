import { defineArrayMember, defineField, defineType } from "sanity";

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case study",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "pillar",
      title: "Service pillar",
      type: "reference",
      to: [{ type: "servicePillar" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "templateType",
      title: "Template type",
      type: "string",
      options: {
        layout: "radio",
        list: [
          { title: "Identity", value: "identity" },
          { title: "Campaign", value: "campaign" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      validation: (rule) => rule.min(2020).max(2100),
    }),
    defineField({
      name: "client",
      title: "Client",
      type: "string",
      description: "Leave blank for own ventures such as Shawls & Soul.",
    }),
    defineField({
      name: "isOwnVenture",
      title: "Own venture",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "description",
      title: "Card description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: "heroMedia",
      title: "Hero media",
      type: "projectMedia",
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [defineArrayMember({ type: "projectMedia" })],
    }),
    defineField({
      name: "context",
      title: "Context",
      type: "text",
      rows: 4,
      hidden: ({ document }) => document?.templateType !== "identity",
    }),
    defineField({
      name: "challenge",
      title: "Challenge",
      type: "text",
      rows: 4,
      hidden: ({ document }) => document?.templateType !== "identity",
    }),
    defineField({
      name: "strategicIdea",
      title: "Strategic idea",
      type: "text",
      rows: 4,
      hidden: ({ document }) => document?.templateType !== "identity",
    }),
    defineField({
      name: "identitySystemNotes",
      title: "Identity system notes",
      type: "text",
      rows: 5,
      hidden: ({ document }) => document?.templateType !== "identity",
    }),
    defineField({
      name: "outcome",
      title: "Outcome",
      type: "text",
      rows: 4,
      hidden: ({ document }) => document?.templateType !== "identity",
      description: "Use real outcomes only. Leave placeholder copy until supplied.",
    }),
    defineField({
      name: "credits",
      title: "Credits",
      type: "array",
      hidden: ({ document }) => document?.templateType !== "identity",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({ name: "role", title: "Role", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "brief",
      title: "Brief",
      type: "text",
      rows: 4,
      hidden: ({ document }) => document?.templateType !== "campaign",
    }),
    defineField({
      name: "concept",
      title: "Concept",
      type: "text",
      rows: 3,
      hidden: ({ document }) => document?.templateType !== "campaign",
    }),
    defineField({
      name: "reach",
      title: "Reach",
      type: "text",
      rows: 3,
      hidden: ({ document }) => document?.templateType !== "campaign",
      description: "Use real numbers only. Leave placeholder copy until supplied.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "templateType",
      media: "heroMedia.image",
    },
  },
});
