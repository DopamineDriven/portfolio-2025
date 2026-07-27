import type { NextConfig } from "next";

export default {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  reactStrictMode: true,
  reactCompiler: true,
  // defaults to to 1mb :|
  experimental: {
    serverActions: { bodySizeLimit: `50mb` },
    authInterrupts: true
  },
  typescript: { ignoreBuildErrors: false, tsconfigPath: "./tsconfig.json" },
  images: {
    localPatterns: [
      { pathname: "/audio/**" },
      { pathname: "/flags/**" },
      { pathname: "/icons/**" },
      { pathname: "/meta/**" },
      { pathname: "/pieces/**" },
      { pathname: "/*" }
    ],
    qualities: [75, 80, 85, 90, 95, 100],
    loader: "default",
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowLocalIP: true,
    maximumRedirects: 5,
    unoptimized: true,
    contentDispositionType: "attachment",
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        hostname: "localhost",
        port: "3010",
        protocol: "http"
      },
      {
        protocol: "https",
        hostname: "**.vercel-storage.com"
      },
      { hostname: "raw.githubusercontent.com", port: "", protocol: "https" },
      { hostname: "api.dicebear.com", protocol: "https" },
      { hostname: "images.unsplash.com", protocol: "https" },
      { hostname: "tailwindui.com", protocol: "https" },
      { hostname: "www.nextchessbot.com", protocol: "https" },
      { hostname: "nextchessbot.com", protocol: "https" },
      { hostname: "dev.nextchessbot.com", protocol: "https" }
    ]
  }
} satisfies NextConfig;
