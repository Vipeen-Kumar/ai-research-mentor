import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        slateGlow: "#e2e8f0",
        skyMint: "#c7f9cc",
        researchBlue: "#1d4ed8",
        labGold: "#f59e0b",
      },
      boxShadow: {
        panel: "0 20px 80px rgba(15, 23, 42, 0.18)",
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(rgba(148, 163, 184, 0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.14) 1px, transparent 1px)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

