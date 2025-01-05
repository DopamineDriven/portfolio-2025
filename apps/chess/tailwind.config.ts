import type { Config as TailwindConfig } from "tailwindcss";
import * as motionPlugin from "tailwindcss-motion";

export default {
  content: ["src/**/*.{js,ts,jsx,tsx}"],
  future: { hoverOnlyWhenSupported: true },
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px"
      }
    },
    extend: {
      colors: {
        primary: "#3b82f6",
        secondary: "#10b981",
        accent: "#f59e0b"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"]
      },
      spacing: {
        "128": "32rem",
        "144": "36rem"
      },
      borderRadius: {
        "4xl": "2rem"
      }
    }
  },
  plugins: [motionPlugin]
} satisfies TailwindConfig;
