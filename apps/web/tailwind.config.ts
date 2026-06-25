import type { Config } from "tailwindcss";

/**
 * WhiskyMart design tokens (see docs/04-ui-ux-architecture.md §2).
 * Premium, warm palette: deep amber/whisky tones, charcoal, cream, gold.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Editorial neutrals
        cream: "#FAF6EE", // page background (warm paper)
        parchment: "#F2EADB", // alternating sections / tints
        charcoal: "#171310", // primary ink (deep espresso)
        ink: "#0E0B09", // near-black for hero / footer
        // Accent metals
        gold: {
          DEFAULT: "#C2A14E",
          light: "#E4D29A",
          dark: "#9A7C32",
        },
        whisky: {
          50: "#FBF3E8",
          100: "#F4E2C8",
          200: "#E7C695",
          300: "#D7A765",
          400: "#C68A3C",
          500: "#AE6D27",
          600: "#90551E",
          700: "#724219",
          800: "#553216",
          900: "#392310",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-sans)"],
      },
      letterSpacing: {
        tightest: "-0.02em",
        luxe: "0.22em", // eyebrow / overline caps
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(23,19,16,0.05), 0 10px 30px -12px rgba(23,19,16,0.18)",
        lift: "0 2px 4px rgba(23,19,16,0.06), 0 24px 48px -20px rgba(23,19,16,0.28)",
      },
    },
  },
  plugins: [],
};

export default config;
