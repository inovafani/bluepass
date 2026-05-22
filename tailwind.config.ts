import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--bp-font-sans)"],
        display: ["var(--bp-font-display)"],
        mono: ["var(--bp-font-mono)"],
      },
      colors: {
        bluepass: {
          ink: "rgb(var(--bp-color-ink) / <alpha-value>)",
          muted: "rgb(var(--bp-color-muted) / <alpha-value>)",
          ocean: "rgb(var(--bp-color-ocean) / <alpha-value>)",
          tide: "rgb(var(--bp-color-tide) / <alpha-value>)",
          reef: "rgb(var(--bp-color-reef) / <alpha-value>)",
          surface: "rgb(var(--bp-color-surface) / <alpha-value>)",
          gold: "rgb(var(--bp-color-gold) / <alpha-value>)",
        },
      },
      borderRadius: {
        "bp-sm": "var(--bp-radius-sm)",
        bp: "var(--bp-radius-md)",
        "bp-lg": "var(--bp-radius-lg)",
        "bp-pill": "var(--bp-radius-pill)",
      },
      boxShadow: {
        "bp-soft": "var(--bp-shadow-soft)",
        "bp-float": "var(--bp-shadow-float)",
        "bp-glass": "var(--bp-shadow-glass)",
      },
    },
  },
  plugins: [forms],
};

export default config;
