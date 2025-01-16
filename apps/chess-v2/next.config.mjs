/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  typescript: { ignoreBuildErrors: false, tsconfigPath: "./tsconfig.json" },
  images: {
    loader: "default",
    formats: ["image/avif", "image/webp"],
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
};

export default nextConfig;
