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
        obsidian: "#0A0907",
        ink: "#0B0A08",
        charcoal: "#171310", // primary text on light
        oak: "#211510", // dark oak brown (editorial bands)
        // Lights — refined warm paper, less buttery than before
        cream: "#F2ECE0", // page background
        ivory: "#FBF8F1", // card / panel surface
        parchment: "#E7D9C0", // section tint (deeper for definition)
        line: "#E0D3BB", // warm hairline border on light surfaces
        // Accents — bronze-leaning, used sparingly
        amber: { DEFAULT: "#BE7A2B", dark: "#A1661F" }, // cask amber accent
        gold: { DEFAULT: "#A98A4E", light: "#C8AA6E", dark: "#866A38" }, // antique brass
        burgundy: "#451616",
        smoke: "#645A4F", // secondary text (AA on cream)
        // Warm neutral ramp (backgrounds / borders / text)
        whisky: {
          50: "#F6EEDF",
          100: "#EADCC2",
          200: "#DABF95",
          300: "#C9A468",
          400: "#BE7A2B",
          500: "#A86A28",
          600: "#8C5822",
          700: "#71471D",
          800: "#503217",
          900: "#281911",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.025em",
        luxe: "0.28em", // eyebrow / overline caps
      },
      // Tightened, architectural radius scale — gallery, not app-bubbly.
      borderRadius: {
        DEFAULT: "0.1875rem",
        md: "0.25rem",
        lg: "0.3125rem",
        xl: "0.4375rem",
        "2xl": "0.625rem",
        "3xl": "0.75rem",
      },
      boxShadow: {
        // Near-hairline — depth comes from tone + borders, not drop shadows
        card: "0 1px 2px -1px rgba(11,10,8,0.05)",
        lift: "0 2px 4px -2px rgba(11,10,8,0.07), 0 24px 48px -34px rgba(11,10,8,0.30)",
      },
      backgroundImage: {
        "cask-glow":
          "radial-gradient(58% 70% at 50% -8%, rgba(190,122,43,0.16), rgba(190,122,43,0.03) 46%, transparent 72%)",
        "cask-glow-soft":
          "radial-gradient(50% 60% at 82% 0%, rgba(169,138,78,0.11), transparent 70%)",
      },
    },
  },
  plugins: [],
};

export default config;
