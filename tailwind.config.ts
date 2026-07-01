import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#15171c",
        paper: "#ffffff",
        moss: "#0f7a5f",
        mossdark: "#0d1117",
        clay: "#d9724f",
        sand: "#f6f6f4",
        gold: "#b8863a",
        line: "#e5e5e0",
      },
      fontFamily: {
        sans: ["var(--font-body)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        serif: ["var(--font-body)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,17,20,0.04), 0 8px 24px -12px rgba(15,17,20,0.12)",
        cardHover: "0 2px 4px rgba(15,17,20,0.06), 0 16px 32px -12px rgba(15,17,20,0.16)",
      },
      borderRadius: {
        xl: "0.85rem",
        "2xl": "1.1rem",
      },
    },
  },
  plugins: [],
};
export default config;
