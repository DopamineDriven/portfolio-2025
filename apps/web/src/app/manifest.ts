import type { MetadataRoute } from "next";

export default function manifest() {
  return <MetadataRoute.Manifest>{
    short_name: "asross portfolio",
    description: "My 2025 Portfolio",
    background_color: "#FFFFFF",
    name: "Andrew Ross Portfolio",
    theme_color: "#020817",
    start_url: "/",
    display: "fullscreen",
    icons: [
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png"
      }
    ]
  };
}
