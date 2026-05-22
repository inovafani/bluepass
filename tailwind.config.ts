import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bluepass: {
          ink: "#092033",
          ocean: "#006F8E",
          tide: "#0EA5A4",
          reef: "#ECFDF5",
        },
      },
    },
  },
  plugins: [forms],
};

export default config;
