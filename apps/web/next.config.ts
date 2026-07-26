import type { NextConfig } from "next";

export default {
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
      { pathname: "/ai/**" },
      { pathname: "/audio/**" },
      { pathname: "/fonts/**" },
      { pathname: "/hdris/**" },
      { pathname: "/illustrator/**" },
      { pathname: "/meta/**" },
      { pathname: "/pong/**" },
      { pathname: "/textures/**" },
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
        port: "3008",
        protocol: "http"
      },
      {
        protocol: "https",
        hostname: "**.vercel-storage.com"
      },
      { hostname: "api.dicebear.com", protocol: "https" },
      { hostname: "images.unsplash.com", protocol: "https" },
      { hostname: "tailwindui.com", protocol: "https" },
      { hostname: "www.asross.com", protocol: "https" },
      { hostname: "dev.asross.com", protocol: "https" },
      { hostname: "asross.com", protocol: "https" },
      { hostname: "raw.githubusercontent.com", protocol: "https" },
      { hostname: "www.thefaderoominc.com", protocol: "https" },
      {
        hostname: "ypuktmwmnilhirdf.public.blob.vercel-storage.com",
        protocol: "https",
        port: ""
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/chat/home"
      }
    ];
  },
  productionBrowserSourceMaps: true
} satisfies NextConfig;
