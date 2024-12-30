import type { Metadata, Viewport } from "next";
import React from "react";
import "./global.css";
import { Geist, Geist_Mono } from "next/font/google";
import { LoadingAnimation } from "@/ui/LoadingAnimation";
import { Navbar } from "@/ui/Nav";
import { ThemeProvider } from "@/ui/Providers/ThemeProvider";

/* populate relevant values in src/lib/site-url.ts and uncomment for url injetion */
// import { getSiteUrl } from "@/lib/site-url";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const viewport = {
  colorScheme: "normal",
  userScalable: true,
  themeColor: "#ffffff",
  viewportFit: "auto",
  initialScale: 1,
  maximumScale: 1,
  width: "device-width"
} satisfies Viewport;

export const metadata = {
  /* populate relevant values in src/lib/site-url.ts and uncomment for url injetion */
  // metadataBase: new URL(getSiteUrl(process.env.NODE_ENV)),
  title: {
    default: "portfolio",
    template: "%s | portfolio"
  },
  description: "@portfolio/web created by @d0paminedriven/turbogen"
} satisfies Metadata;

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (

      <html suppressHydrationWarning lang="en">
        <body
          className={`antialiased ${geistSans.variable} ${geistMono.variable}`}>
          <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem>
            <LoadingAnimation />
            <Navbar />
            <div className="pt-16">{children}</div>
          </ThemeProvider>
        </body>
      </html>
  );
}
