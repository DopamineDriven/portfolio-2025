import type { MetadataRoute } from "next";

export default function manifest() {
  return <MetadataRoute.Manifest>{
    short_name: "Next Chess Bot",
    description: "Play chess against Stockfish engine",
    background_color: "#FFFFFF",
    name: "Next Chess Bot - Powered by Stockfish",
    theme_color: "#1f2937",
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
