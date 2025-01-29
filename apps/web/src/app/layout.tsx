import type { Metadata, Viewport } from "next";
import React from "react";
import { Poppins as _Poppins, Inter } from "next/font/google";
import { Footer } from "@/ui/footer";
import { LoadingAnimation } from "@/ui/loading-animation";
import { default as Navbar } from "@/ui/nav";
import { ThemeProvider } from "@/ui/providers/theme-provider";
import "./global.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AnimationContextProvider } from "@/context/animation-context";
import { cn } from "@/lib/utils";

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
    <html
      suppressHydrationWarning
      lang="en"
      className={cn(inter.className, "")}>
      <body>
        <AnimationContextProvider>
          <ThemeProvider>
            <LoadingAnimation />
            <div className="flex min-h-[100dvh] flex-col">
              <Navbar />
              <main className="theme-transition grow">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </AnimationContextProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
