import type { Metadata, Viewport } from "next";
import React from "react";
import "./global.css";
import { Inter, Poppins } from "next/font/google";
import Footer from "@/ui/Footer";
import { LoadingAnimation } from "@/ui/LoadingAnimation";
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
const poppins = Poppins({ weight: ["400", "600", "700"], subsets: ["latin"] });

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
    default: "portfolio",
    template: "%s | portfolio"
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
      <body className={`antialised ${inter.className} ${poppins.className}`}>
        <ThemeProvider
          attribute={"class"}
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <LoadingAnimation />
          <Navbar />
          <div className="transition-colors flex min-h-screen flex-col">
            <main className="transition-colors container mx-auto flex-grow px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
