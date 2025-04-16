/** @type {import('next').NextConfig} */
export default {
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false, tsconfigPath: "./tsconfig.json" },
  experimental: { optimizePackageImports: ["three"] },
  devIndicators: false,
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
      { hostname: "asross.com", protocol: "https" },
      { hostname: "raw.githubusercontent.com", protocol: "https" },
      { hostname: "www.thefaderoominc.com", protocol: "https" },
      {
        hostname: "ypuktmwmnilhirdf.public.blob.vercel-storage.com",
        protocol: "https",
        port: ""
      }
    ]
  }
};
