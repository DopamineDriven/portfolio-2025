import type { Config as TailwindConfig } from "tailwindcss";

export default {
  content: ["src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "selector",
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
      typography: {
        quoteless: {
          css: {
            "li code::before": { content: "none" },
            "li code::after": { content: "none" },
            "a code:first-of-type::before": { content: "none" },
            "a code:first-of-type::after": { content: "none" },
            "p code::before": { content: "none" },
            "p code::after": { content: "none" },
            "blockquote p:first-of-type::before": { content: "none" },
            "blockquote p:first-of-type::after": { content: "none" }
          }
        }
      },
      transitionDuration: {
        theme: "var(--theme-transition-duration)",
        loading: "var(--loading-animation-duration)"
      }
    }
  }
} satisfies TailwindConfig;
