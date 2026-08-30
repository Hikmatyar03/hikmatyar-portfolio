import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1440px",
      "2xl": "1536px",
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "20px",
        md: "32px",
        lg: "48px",
        xl: "80px",
      },
      screens: {
        sm: "100%",
        md: "100%",
        lg: "100%",
        xl: "1440px",
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        bg: "var(--bg)",
        text: "var(--text)",
        accent: "var(--accent)",
      },
      fontFamily: {
        display: ["var(--font-degular-display)", "Arial Narrow", "sans-serif"],
        body: ["var(--font-degular-text)", "Arial", "sans-serif"],
      },
      fontSize: {
        display: [
          "clamp(3.5rem, 8vw, 7.5rem)",
          {
            lineHeight: "0.88",
            letterSpacing: "0",
          },
        ],
        body: [
          "1rem",
          {
            lineHeight: "1.6",
            letterSpacing: "0",
          },
        ],
        "body-lg": [
          "1.125rem",
          {
            lineHeight: "1.6",
            letterSpacing: "0",
          },
        ],
        eyebrow: [
          "0.75rem",
          {
            lineHeight: "1.2",
            letterSpacing: "0.1em",
          },
        ],
      },
      gridTemplateColumns: {
        desktop: "repeat(12, minmax(0, 1fr))",
        tablet: "repeat(6, minmax(0, 1fr))",
        mobile: "repeat(4, minmax(0, 1fr))",
      },
      gap: {
        "grid-mobile": "12px",
        "grid-tablet": "16px",
        "grid-laptop": "20px",
        "grid-desktop": "24px",
      },
      borderRadius: {
        sharp: "1.25rem",
      },
      transitionDuration: {
        micro: "150ms",
        ui: "350ms",
        reveal: "650ms",
        page: "850ms",
      },
      transitionTimingFunction: {
        micro: "ease-out",
        ui: "cubic-bezier(0.4, 0, 0.2, 1)",
        reveal: "ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
