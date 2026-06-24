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
        cream: "#FBF7F0",
        charcoal: "#1A1714",
        gold: "#C9A24B",
        whisky: {
          50: "#FBF3E8",
          100: "#F6E4CC",
          200: "#EBC79A",
          300: "#DFA968",
          400: "#D08F3E",
          500: "#B8732B",
          600: "#9A5C20",
          700: "#7B481B",
          800: "#5E3717",
          900: "#3F2611",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-sans)"],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(26,23,20,0.06), 0 8px 24px rgba(26,23,20,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
