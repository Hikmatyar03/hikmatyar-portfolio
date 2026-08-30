import { defineField, defineType } from "sanity";

export const projectMedia = defineType({
  name: "projectMedia",
  title: "Project media",
  type: "object",
  fields: [
    defineField({
      name: "mediaType",
      title: "Media type",
      type: "string",
      initialValue: "image",
      options: {
        layout: "radio",
        list: [
          { title: "Image", value: "image" },
          { title: "Video", value: "video" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      hidden: ({ parent }) => parent?.mediaType === "video",
      options: { hotspot: true },
    }),
    defineField({
      name: "video",
      title: "Video",
      type: "file",
      hidden: ({ parent }) => parent?.mediaType !== "video",
      options: {
        accept: "video/mp4,video/quicktime",
      },
    }),
    defineField({
      name: "poster",
      title: "Poster frame",
      type: "image",
      hidden: ({ parent }) => parent?.mediaType !== "video",
      options: { hotspot: true },
    }),
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description: "Describe the visual content, not the filename.",
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
    defineField({
      name: "isPlaceholder",
      title: "Placeholder media",
      type: "boolean",
      initialValue: true,
      description: "Render a dev-only replacement badge when true.",
    }),
  ],
  preview: {
    select: {
      mediaType: "mediaType",
      media: "image",
      isPlaceholder: "isPlaceholder",
    },
    prepare({ mediaType, media, isPlaceholder }) {
      return {
        title: `${mediaType || "Media"}${isPlaceholder ? " placeholder" : ""}`,
        media,
      };
    },
  },
});
