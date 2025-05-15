import type { Metadata } from "next";
import React from "react";
import { ThemeProvider } from "@/ui/providers/theme-provider";
import "./global.css";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AnimationContextProvider } from "@/context/animation-context";
import { CookieProvider } from "@/context/cookie-context";
import { getSiteUrl } from "@/lib/site-url";
import * as gAnalytics from "@/utils/analytics";


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
    title: "Portfolio"
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio 2025",
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
      lang="en">
      <body className="font-basis-grotesque-pro antialiased overflow-x-hidden!">
        <AnimationContextProvider>
          <ThemeProvider>
            <CookieProvider>{children}</CookieProvider>
          </ThemeProvider>
        </AnimationContextProvider>
        <SpeedInsights  debug={true} />
        <Analytics mode="production" />
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
