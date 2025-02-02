import createMDX from "@next/mdx";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: false },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  experimental: {
    mdxRs: true
  },
  typescript: { ignoreBuildErrors: false, tsconfigPath: "./tsconfig.json" },
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
      {
        protocol: "https",
        hostname: "**.vercel-storage.com"
      },
      { hostname: "api.dicebear.com", protocol: "https" },
      { hostname: "images.unsplash.com", protocol: "https" },
      { hostname: "tailwindui.com", protocol: "https" },
      { hostname: "www.asross.com", protocol: "https" },
      { hostname: "dev.asross.com", protocol: "https" },
      { hostname: "asross.com", protocol: "https" }
    ]
  }
};

export default withMDX(nextConfig);
