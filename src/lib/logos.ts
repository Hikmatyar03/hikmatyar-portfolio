import fs from "fs";
import path from "path";

export interface ClientLogo {
  src: string;
  name: string;
  alt: string;
}

/**
 * Clean and humanize a filename into a legible brand name.
 * e.g. "Artboard 1.png" -> "Brand Identity 1", "studio-buntu.png" -> "Studio Buntu"
 */
function formatLogoName(filename: string): string {
  const base = filename.replace(/\.[^/.]+$/, "");
  return base
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Dynamically retrieves all client logo assets from public/logos.
 * Any image file dropped into public/logos will automatically be discovered.
 */
export function getClientLogos(): ClientLogo[] {
  try {
    const logosDir = path.join(process.cwd(), "public", "logos");
    if (!fs.existsSync(logosDir)) {
      return [];
    }

    const files = fs.readdirSync(logosDir);
    const validExtensions = /\.(png|jpe?g|svg|webp)$/i;

    return files
      .filter((file) => validExtensions.test(file))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
      .map((file) => {
        const name = formatLogoName(file);
        return {
          src: `/logos/${file}`,
          name,
          alt: `${name} — Client Logo`,
        };
      });
  } catch (error) {
    console.error("Error reading client logos from public/logos:", error);
    return [];
  }
}
