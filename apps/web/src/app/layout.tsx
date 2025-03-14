import type { Metadata, Viewport } from "next";
import React from "react";
import { Poppins as _Poppins, Inter } from "next/font/google";
import { Footer } from "@/ui/footer";
import { LoadingAnimation } from "@/ui/loading-animation";
import { default as Navbar } from "@/ui/nav";
import { ThemeProvider } from "@/ui/providers/theme-provider";
import "./global.css";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AnimationContextProvider } from "@/context/animation-context";
import {
  BasisGrotesqueProBlack,
  BasisGrotesqueProBlackItalic,
  BasisGrotesqueProBold,
  BasisGrotesqueProBoldItalic,
  BasisGrotesqueProItalic,
  BasisGrotesqueProLight,
  BasisGrotesqueProLightItalic,
  BasisGrotesqueProMedium,
  BasisGrotesqueProMediumItalic,
  BasisGrotesqueProRegular
} from "@/lib/fonts";
import { getSiteUrl } from "@/lib/site-url";
import { cn } from "@/lib/utils";
import * as gAnalytics from "@/utils/analytics";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
export const viewport = {
  colorScheme: "normal",
  userScalable: true,
  themeColor: "#020817",
  viewportFit: "auto",
  initialScale: 1,
  width: "device-width"
} satisfies Viewport;

export const metadata = {
  metadataBase: new URL(getSiteUrl(process.env.NODE_ENV)),
  title: {
    default: "Andrew Ross",
    template: "%s | Portfolio"
  },
  verification: {
    google: "z8Aoz_qPBEI4Y9njJ-I4QFfRb0n85o27ihGExlwv4rQ",
    yandex: "d62bccbf47351725"
  },
  description: "Portfolio 2025",
  authors: [{ name: "Andrew Ross", url: "https://github.com/DopamineDriven" }],
  creator: "Andrew Ross",
  appleWebApp: {
    startupImage: "/apple-icon.png",
    statusBarStyle: "black-translucent",
    title: "Next Chess Bot"
  },
  twitter: {
    card: "summary_large_image",
    title: "Next Chess Bot",
    creator: "@Dopamine_Driven",
    creatorId: "989610823105568769",
    description: "Portfolio 2025"
  },
  openGraph: {
    title: "Andrew Ross",
    description: "Portfolio 2025",
    url: getSiteUrl(process.env.NODE_ENV),
    siteName: "Andrew Ross Portfolio",
    locale: "en_US",
    type: "website",
    countryName: "US",
    emails: ["andrew@windycitydevs.io"]
  },
  icons: [
    {
      type: "image/png",
      rel: "apple-icon",
      url: new URL(
        "/meta/apple-touch-icon.png",
        getSiteUrl(process.env.NODE_ENV)
      ),
      sizes: "180x180"
    },
    {
      type: "image/svg+xml",
      rel: "mask-icon",
      url: new URL("/meta/favicon.svg", getSiteUrl(process.env.NODE_ENV))
    },
    {
      type: "image/png",
      rel: "icon",
      url: new URL("/meta/favicon-96x96.png", getSiteUrl(process.env.NODE_ENV)),
      sizes: "96x96"
    }
  ],
  robots: {
    googleBot: {
      follow: true,
      index: true,
      indexifembedded: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    },
    follow: true,
    index: true,
    indexifembedded: true,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1
  }
} satisfies Metadata;

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={cn(
        BasisGrotesqueProLight.variable,
        BasisGrotesqueProMedium.variable,
        BasisGrotesqueProMediumItalic.variable,
        BasisGrotesqueProRegular.variable,
        BasisGrotesqueProItalic.variable,
        BasisGrotesqueProLightItalic.variable,
        BasisGrotesqueProBold.variable,
        BasisGrotesqueProBlack.variable,
        BasisGrotesqueProBlackItalic.variable,
        BasisGrotesqueProBoldItalic.variable,
        inter.variable
      )}>
      <body className="font-basis-grotesque-pro-regular overflow-x-hidden!">
        <AnimationContextProvider>
          <ThemeProvider>
            <LoadingAnimation />
            <div className="max-w-[96rem] overflow-x-hidden! mx-auto flex min-h-[100dvh] flex-col sm:px-6 lg:px-8">
              <Navbar />
              <main className="theme-transition">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </AnimationContextProvider>
        <SpeedInsights />
        <Analytics />
      </body>
      <Script
        async
        strategy="afterInteractive"
        id="gtag-init"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gAnalytics.GA_TRACKING_ID}', {
            page_path: window.location.pathname,
          });
         `
        }}
      />
      <Script
        async
        id={gAnalytics.GA_TRACKING_ID}
        data-test={gAnalytics.GA_TRACKING_ID}
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gAnalytics.GA_TRACKING_ID}`}
      />
    </html>
  );
}
