import type { Config } from "tailwindcss";

// ============================================================
// NATURAL BEAUTY CLINIC & ACADEMY — DESIGN TOKEN SYSTEM
// Locked palette per spec: cream background, emerald primary,
// luxury gold accent. Do not introduce new brand colors without
// updating this file — every screen should derive from here.
// ============================================================

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#F8F5EE",
          soft: "#FBF9F4",
          deep: "#EFE9DA",
        },
        emerald: {
          50: "#E9F2ED",
          100: "#C9E0D3",
          300: "#5C9C7C",
          500: "#1C6B4F", // interactive / links / hover
          700: "#0E4B3C", // primary brand emerald
          900: "#08301F", // deep text-on-cream headings
        },
        gold: {
          100: "#F3E6BE",
          300: "#E8C766",
          500: "#C9A227", // luxury gold accent
          700: "#96771A",
        },
        ink: {
          DEFAULT: "#1F2420", // warm charcoal body text
          soft: "#4B534D",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-sora)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        soft: "0 8px 30px -12px rgba(14, 75, 60, 0.18)",
        gold: "0 8px 24px -8px rgba(201, 162, 39, 0.35)",
      },
      backgroundImage: {
        "botanical-line": "url('/images/brand/botanical-line.svg')",
      },
    },
  },
  plugins: [],
};

export default config;
