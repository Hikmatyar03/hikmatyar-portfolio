"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "@/sanity/schemaTypes";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "demo1234";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "default",
  title: "Hikmatyar Portfolio",
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [structureTool()],
  // Embedded Studio keeps this solo portfolio on one Vercel app until the CMS needs independent ownership.
  schema: {
    types: schemaTypes,
  },
});
