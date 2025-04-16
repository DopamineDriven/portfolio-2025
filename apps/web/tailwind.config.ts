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
      fontFamily: {
        inter: ["var(--font-inter)"],
        "basis-grotesque-pro-regular": [
          "var(--font-basis-grotesque-pro-regular)"
        ],
        "basis-grotesque-pro-italic": [
          "var(--font-basis-grotesque-pro-italic)"
        ],
        "basis-grotesque-pro-black": ["var(--font-basis-grotesque-pro-black)"],
        "basis-grotesque-pro-black-italic": [
          "var(--font-basis-grotesque-pro-black-italic)"
        ],
        "basis-grotesque-pro-bold": ["var(--font-basis-grotesque-pro-bold)"],
        "basis-grotesque-pro-bold-italic": [
          "var(--font-basis-grotesque-pro-bold-italic)"
        ],
        "basis-grotesque-pro-light": ["var(--font-basis-grotesque-pro-light)"],
        "basis-grotesque-pro-light-italic": [
          "var(--font-basis-grotesque-pro-light-italic)"
        ],
        "basis-grotesque-pro-medium": [
          "var(--font-basis-grotesque-pro-medium)"
        ],
        "basis-grotesque-pro-medium-italic": [
          "var(--font-basis-grotesque-pro-medium-italic)"
        ]
      },
      transitionDuration: {
        theme: "var(--theme-transition-duration)",
        loading: "var(--loading-animation-duration)"
      }
    }
  }
} satisfies TailwindConfig;
