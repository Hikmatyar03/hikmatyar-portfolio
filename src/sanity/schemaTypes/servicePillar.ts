import { defineArrayMember, defineField, defineType } from "sanity";

export const servicePillar = defineType({
  name: "servicePillar",
  title: "Service pillar",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "oneLineDescription",
      title: "One-line description",
      type: "string",
      validation: (rule) => rule.required().max(140),
    }),
    defineField({
      name: "capabilityWords",
      title: "Capability words",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.max(4),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "oneLineDescription",
    },
  },
});
