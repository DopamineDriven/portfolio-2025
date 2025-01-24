import type { Metadata, Viewport } from "next";
import React from "react";
import { Poppins as _Poppins, Inter } from "next/font/google";
import { Footer } from "@/ui/Footer";
import { LoadingAnimation } from "@/ui/LoadingAnimation";
import { default as Navbar } from "@/ui/Nav/alt";
import { ThemeProvider } from "@/ui/Providers/ThemeProvider";
import "./global.css";

/* populate relevant values in src/lib/site-url.ts and uncomment for url injetion */
// import { getSiteUrl } from "@/lib/site-url";

// const geistSans = Geist({
//   subsets: ["latin"]
// });

// const geistMono = Geist_Mono({
//   subsets: ["latin"]
// });

const inter = Inter({ subsets: ["latin"] });
// const poppins = Poppins({ weight: ["400", "600", "700"], subsets: ["latin"] });

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
  title: {
    default: "Portfolio",
    template: "%s | Portfolio"
  },
  description: "portfolio scaffolded by @d0paminedriven/turbogen"
} satisfies Metadata;

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <LoadingAnimation />
          <div className="flex min-h-[100dvh] flex-col">
            <Navbar />
            <main className="theme-transition flex-grow">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
