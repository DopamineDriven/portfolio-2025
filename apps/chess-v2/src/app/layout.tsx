import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { ChessWebSocketProvider } from "@/contexts/chess-websocket-context";
import { GameProvider } from "@/contexts/game-context";
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
  themeColor: "#1f2937",
  viewportFit: "auto",
  initialScale: 1,
  width: "device-width"
} satisfies Viewport;

export const metadata = {
  metadataBase: new URL(getSiteUrl(process.env.NODE_ENV)),
  title: {
    default: "Next Chess Bot",
    template: "%s | Next Chess Bot"
  },
  verification: { google: "WiuGYHLPegAsEoxCa_7DGSsG6tB_AU9D822XBPNxtpI" },
  description: "Elevate your Game - play against Stockfish",
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
    description: "Elevate your Game - play against Stockfish"
  },
  openGraph: {
    title: "Next Chess Bot",
    description: "Elevate your Game - play against Stockfish",
    url: getSiteUrl(process.env.NODE_ENV),
    siteName: "Next Chess Bot",
    locale: "en_US",
    type: "website",
    countryName: "US",
    images: [
      {
        url: new URL(
          "/opengraph-image",
          getSiteUrl(process.env.NODE_ENV)
        ).toString(),
        width: 1200,
        height: 630,
        alt: "Next Chess Bot - Powered by Stockfish"
      },
      {
        url: new URL(
          "/meta/apple-touch-icon.png",
          getSiteUrl(process.env.NODE_ENV)
        ).toString(),
        width: 180,
        height: 180,
        alt: "Next Chess Bot"
      }
    ],
    emails: ["andrew@windycitydevs.io"]
  },
  icons: [
    {
      type: "image/png",
      rel: "apple-touch-icon",
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
}: {
  children: React.ReactNode;
}) {
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
      <body className={inter.className}>
        <ChessWebSocketProvider>
          <GameProvider
            initialColor="white"
            initialDifficulty="beginner"
            initialMode="friendly"
            soundEnabled={true}>
            <main className="font-basis-grotesque-pro-light"> {children}</main>
          </GameProvider>
        </ChessWebSocketProvider>
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
