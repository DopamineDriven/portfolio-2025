import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/ui/providers/theme-provider";
import "./global.css";
import Script from "next/script";
import { AnimationContextProvider } from "@/context/animation-context";
import { CookieProvider } from "@/context/cookie-context";
import { getSiteUrl } from "@/lib/site-url";
import * as ga from "@/utils/analytics";
import { Analytics } from "@vercel/analytics/react";

const year = new Date(Date.now()).getFullYear();

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
  description: `Portfolio ${year}`,
  authors: [{ name: "Andrew Ross", url: "https://github.com/DopamineDriven" }],
  creator: "Andrew Ross",
  appleWebApp: {
    startupImage: "/apple-icon.png",
    statusBarStyle: "black-translucent",
    title: "Portfolio"
  },
  twitter: {
    card: "summary_large_image",
    title: `Portfolio ${year}`,
    creator: "@Dopamine_Driven",
    creatorId: "989610823105568769",
    description: `Portfolio ${year}`
  },
  openGraph: {
    title: "Andrew Ross",
    description: `Portfolio ${year}`,
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
  children: ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <Script
        async={true}
        id="prevent-flash-of-wrong-theme"
        dangerouslySetInnerHTML={{
          __html: `
              (function() {
                try {
                  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (prefersDark) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `
        }}
      />
      <body className="font-basis-grotesque-pro overflow-x-hidden! antialiased">
        <AnimationContextProvider>
          <CookieProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
            </ThemeProvider>
          </CookieProvider>
        </AnimationContextProvider>
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
          gtag('config', '${ga.GA_TRACKING_ID}', {
            page_path: window.location.pathname,
          });
         `
        }}
      />
      <Script
        async
        id={ga.GA_TRACKING_ID}
        data-test={ga.GA_TRACKING_ID}
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${ga.GA_TRACKING_ID}`}
      />
    </html>
  );
}
