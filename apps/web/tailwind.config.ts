import type { Config } from "tailwindcss";

/**
 * WhiskyMart: "The Archive" design tokens (Increment 12B).
 * A distiller's private archive: warehouse dark, paper records, copper stills.
 * Seven colours, one accent; everything else is derived. See
 * docs/12b-design-plan.md for the AA contrast table.
 *
 * Contrast rule: raw `copper` passes AA on `ground`/`surface` only. On
 * `parchment`, textual accents must use `copper-deep` (4.8:1); raw copper on
 * parchment is reserved for non-text hairlines (the pour line).
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
        ground: "#171210", // peat/char: the page ground, dark-first
        surface: "#211A16", // oak: cards, panels, header
        parchment: "#EFE6D3", // paper: the inverse surface (plates, journal)
        ink: "#14100D", // text on parchment
        cream: {
          DEFAULT: "#EDE4D6", // text on dark
          muted: "rgba(237,228,214,0.62)", // secondary text on dark (AA 6.2:1)
        },
        copper: {
          DEFAULT: "#C1763B", // the single accent
          deep: "#8F5527", // hover/pressed; textual accent on parchment
        },
        line: {
          dark: "rgba(237,228,214,0.14)", // hairline on dark
          light: "rgba(20,16,13,0.15)", // hairline on parchment
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // The five-step scale (docs/12b-design-plan.md §2).
        d1: ["clamp(2.8rem, 6vw, 4.5rem)", { lineHeight: "1.05" }],
        d2: ["clamp(1.9rem, 3.2vw, 2.75rem)", { lineHeight: "1.08" }],
        d3: ["1.375rem", { lineHeight: "1.2" }],
        body: ["1.0625rem", { lineHeight: "1.65" }],
        "body-sm": ["0.9375rem", { lineHeight: "1.6" }],
        label: ["0.8125rem", { lineHeight: "1.4", letterSpacing: "0.04em" }],
        "label-sm": ["0.75rem", { lineHeight: "1.35", letterSpacing: "0.04em" }],
      },
      // 2px everywhere; the scale is collapsed on purpose so no surface can
      // drift back to app-bubbly radii. `rounded-full` stays for count dots.
      borderRadius: {
        none: "0",
        sm: "2px",
        DEFAULT: "2px",
        md: "2px",
        lg: "2px",
        xl: "2px",
        "2xl": "2px",
        "3xl": "2px",
      },
    },
  },
  plugins: [],
};

export default config;
