import type { Metadata, Viewport } from "next";
import React from "react";
import "./global.css";
import { Poppins as _Poppins, Inter } from "next/font/google";
import { LoadingAnimation } from "@/ui/LoadingAnimation";
import { Footer } from "@/ui/Footer";
import { Navbar } from "@/ui/Nav";
import { ThemeProvider } from "@/ui/Providers/ThemeProvider";

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
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow theme-transition">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
