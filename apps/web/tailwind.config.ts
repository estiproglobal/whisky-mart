import type { Config } from "tailwindcss";

/**
 * WhiskyMart — "The Private Cask Room" design tokens.
 * Restrained luxury: obsidian + oak darks, warm parchment lights, cask amber +
 * antique brass accents, deep burgundy. (See Current_Task.md / brief.)
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
        // Darks
        obsidian: "#0B0A08",
        ink: "#0B0A08",
        charcoal: "#15110D", // primary text on light
        oak: "#2A1A12", // dark oak brown
        // Lights
        cream: "#F4EBDD", // warm ivory — page background
        ivory: "#FBF7EF", // lighter surface (cards on cream)
        parchment: "#EADCC4", // section tint
        // Accents
        amber: { DEFAULT: "#C9822E", dark: "#AE6E26" }, // cask amber (primary)
        gold: { DEFAULT: "#B08A4A", light: "#C9A86A", dark: "#8C6E3A" }, // antique brass
        burgundy: "#4A1717",
        smoke: "#6B6157", // secondary text (AA on cream)
        // Warm neutral ramp (backgrounds / borders / text)
        whisky: {
          50: "#F7EFE0",
          100: "#EDDFC6",
          200: "#DCC39A",
          300: "#CCA66C",
          400: "#C9822E",
          500: "#B0702A",
          600: "#935D24",
          700: "#784B1F",
          800: "#553418",
          900: "#2A1A12",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.02em",
        luxe: "0.24em", // eyebrow / overline caps
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        // Soft, low — luxury through restraint, not heavy drop shadows
        card: "0 1px 2px rgba(11,10,8,0.04), 0 12px 30px -18px rgba(11,10,8,0.22)",
        lift: "0 2px 6px rgba(11,10,8,0.06), 0 28px 56px -28px rgba(11,10,8,0.34)",
      },
      backgroundImage: {
        "cask-glow":
          "radial-gradient(60% 75% at 50% -5%, rgba(201,130,46,0.20), rgba(201,130,46,0.05) 45%, transparent 72%)",
        "cask-glow-soft":
          "radial-gradient(50% 60% at 80% 0%, rgba(176,138,74,0.16), transparent 70%)",
      },
    },
  },
  plugins: [],
};

export default config;
