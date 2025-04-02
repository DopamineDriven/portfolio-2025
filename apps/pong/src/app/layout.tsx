import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
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
import "./globals.css";

export const viewport = {
  colorScheme: "normal",
  userScalable: true,
  themeColor: "#020817",
  viewportFit: "cover",
  initialScale: 1,
  width: "device-width"
} satisfies Viewport;

export const metadata = {
  metadataBase: new URL(getSiteUrl(process.env.NODE_ENV)),
  title: { default: "React Pong", template: "%s | React Pong" },
  description: "React Pong Game",
  authors: [{ name: "Andrew Ross", url: "https://github.com/DopamineDriven" }],
  creator: "Andrew Ross",
  applicationName: "React Pong",
  appleWebApp: {
    startupImage: "/apple-icon.png",
    statusBarStyle: "black-translucent",
    title: "React Pong"
  },
  twitter: {
    card: "summary_large_image",
    title: "React Pong",
    creator: "@Dopamine_Driven",
    creatorId: "989610823105568769",
    description: "React Pong Game"
  },

  openGraph: {
    title: "Andrew Ross",
    description: "React Pong Game",
    url: getSiteUrl(process.env.NODE_ENV),
    siteName: "React Pong",
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
        BasisGrotesqueProBoldItalic.variable
      )}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
