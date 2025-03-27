import type { Metadata } from "next";
import "./globals.css";
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
      <body>{children}</body>
    </html>
  );
}
