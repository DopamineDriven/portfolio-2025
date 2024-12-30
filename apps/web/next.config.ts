import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import rehypeShiki from "@shikijs/rehype";
import type { RehypeShikiOptions } from "@shikijs/rehype";

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [
      [
        rehypeShiki,
        {
          theme: "dark-plus",
          langs: ["typescript", "tsx"]
        } satisfies RehypeShikiOptions
      ]
    ]
  }
});

export default withMDX({
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: false },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  typescript: { ignoreBuildErrors: false, tsconfigPath: "./tsconfig.json" },
  // serverExternalPackages: ["@shikijs/twoslash"],
  images: {
    loader: "default",
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        hostname: "localhost",
        port: "3008",
        protocol: "http"
      },
      { hostname: "images.unsplash.com", protocol: "https" },
      { hostname: "tailwindui.com", protocol: "https" }
    ]
  },
  productionBrowserSourceMaps: true
} satisfies NextConfig);
