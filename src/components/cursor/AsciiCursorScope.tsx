"use client";

import { usePathname } from "next/navigation";
import AsciiInkBleedCursor from "@/components/cursor/AsciiInkBleedCursor";

/**
 * AsciiCursorScope — Controls where the ASCII cursor reaction renders.
 *
 * UX reason: Running a full-viewport shader on content-dense pages
 * (work archive, case studies) competes with text legibility and
 * wastes GPU budget. Limit to hero/landing contexts where the sparse
 * background adds editorial texture without fighting the content.
 */

/** Pathnames where the ASCII cursor layer is active */
const ASCII_ENABLED_PATHS = [
  "/",            // Home / hero landing
  "/about",       // About page hero
  "/contact",     // Contact page
  "/services",    // Services landing
];

export default function AsciiCursorScope() {
  const pathname = usePathname();
  const normalizedPath = pathname ? pathname.replace(/\/+$/, "") || "/" : "/";

  // Check if current path matches any enabled path (exact match)
  const isEnabled = ASCII_ENABLED_PATHS.some(
    (path) => normalizedPath === path
  );

  if (!isEnabled) {
    return null;
  }

  return <AsciiInkBleedCursor enabled={true} />;
}
