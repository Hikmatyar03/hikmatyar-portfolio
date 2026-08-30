import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "heroHeadline",
      title: "Hero headline",
      type: "string",
      initialValue: "Brand identity, built with intent.",
    }),
    defineField({
      name: "heroSubline",
      title: "Hero subline",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "aboutShortCopy",
      title: "Short about copy",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "contactEmail",
      title: "Contact email",
      type: "email",
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Site settings",
      };
    },
  },
});
