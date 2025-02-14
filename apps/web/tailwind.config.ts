import type { Config as TailwindConfig } from "tailwindcss";

export default {
  content: ["src/**/*.{js,ts,jsx,tsx,md,mdx}"],
  darkMode: "selector",
  important: true,
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
      colors: {
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring))",
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        primary: {
          DEFAULT: "oklch(var(--primary))",
          foreground: "oklch(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary))",
          foreground: "oklch(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive))",
          foreground: "oklch(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT: "oklch(var(--muted))",
          foreground: "oklch(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "oklch(var(--accent))",
          foreground: "oklch(var(--accent-foreground))"
        },
        popover: {
          DEFAULT: "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))"
        },
        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))"
        }
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        },

        "cursor-blink": {
          "0%, 100%": { opacity: "0" },
          "50%": { opacity: "1" }
        },
        "cursor-blink-mobile": {
          "0%, 100%": { opacity: "0" },
          "50%": { opacity: "1" }
        },
        "cursor-advance": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" }
        },
        "carousel-scroll": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" }
        }
      },
      animation: {
        "accordion-down":
          "accordion-down var(--theme-transition-duration) ease-out",
        "accordion-up":
          "accordion-up var(--theme-transition-duration) ease-out",
        "cursor-blink": "cursor-blink 0.7s step-end infinite",
        "cursor-blink-mobile": "cursor-blink-mobile 0.7s step-end infinite",
        "cursor-advance": "cursor-advance 0.1s linear",
        carousel: "carousel-scroll var(--animation-duration) linear infinite"
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      transitionDuration: {
        theme: "var(--theme-transition-duration)",
        loading: "var(--loading-animation-duration)"
      },
      fontSize: {
        sxs: ["0.625rem", { lineHeight: "0.875rem" }],
        xxs: ["0.5rem", { lineHeight: "0.75rem" }]
      },
      backdropBlur: {
        sm: "4px"
      },
      maxWidth: {
        "10xl": "173.75rem",
        "9xl": "121rem",
        "8xl": "96rem"
      },
      width: {
        "9xl": "120rem",
        "8xl": "96rem"
      }
    }
  }
} satisfies TailwindConfig;
