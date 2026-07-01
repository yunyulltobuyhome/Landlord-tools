import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1f2318",
        paper: "#faf6ee",
        moss: "#3a5a40",
        mossdark: "#26401f",
        clay: "#b5533c",
        sand: "#e8dfc9",
        gold: "#c08a2e",
      },
      fontFamily: {
        serif: ["'Source Serif 4'", "Georgia", "serif"],
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "4px 4px 0 0 rgba(31,35,24,0.9)",
      },
    },
  },
  plugins: [],
};
export default config;
