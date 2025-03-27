import type { Metadata } from "next";
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
import { cn } from "@/lib/utils";
import "./globals.css";

export const metadata: Metadata = {
  title: "React Pong",
  description: "React Pong Game"
};

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
