import type { Viewport } from "next";
import React from "react";

export const viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  viewportFit: "cover",
  interactiveWidget: "overlays-content",
  width: "device-width",
  height: "device-height",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false
} satisfies Viewport;

export default function ElevatorLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative h-[100dvh] min-h-screen w-[100vw] overflow-hidden bg-black">
      {children}
    </div>
  );
}
