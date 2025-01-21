import type { NextFontWithVariable } from "next/dist/compiled/@next/font/dist/types";
import localFont from "next/font/local";

export const BasisGrotesqueProBlack =
  localFont<"--font-basis-grotesque-pro-black">({
    variable: "--font-basis-grotesque-pro-black",
    display: "swap",
    src: [
      {
        path: "../app/fonts/BasisGrotesquePro-Black.woff2"
      }
    ]
  }) satisfies NextFontWithVariable;

export const BasisGrotesqueProBlackItalic =
  localFont<"--font-basis-grotesque-pro-black-italic">({
    variable: "--font-basis-grotesque-pro-black-italic",
    display: "swap",
    src: [
      {
        path: "../app/fonts/BasisGrotesquePro-BlackItalic.woff2"
      }
    ]
  }) satisfies NextFontWithVariable;

export const BasisGrotesqueProBold =
  localFont<"--font-basis-grotesque-pro-bold">({
    variable: "--font-basis-grotesque-pro-bold",
    display: "swap",
    src: [
      {
        path: "../app/fonts/BasisGrotesquePro-Bold.woff2"
      }
    ]
  }) satisfies NextFontWithVariable;

export const BasisGrotesqueProBoldItalic =
  localFont<"--font-basis-grotesque-pro-bold-italic">({
    variable: "--font-basis-grotesque-pro-bold-italic",
    display: "swap",
    src: [
      {
        path: "../app/fonts/BasisGrotesquePro-BoldItalic.woff2"
      }
    ]
  }) satisfies NextFontWithVariable;

export const BasisGrotesqueProLight =
  localFont<"--font-basis-grotesque-pro-light">({
    variable: "--font-basis-grotesque-pro-light",
    display: "swap",
    src: [
      {
        path: "../app/fonts/BasisGrotesquePro-Light.woff2"
      }
    ]
  }) satisfies NextFontWithVariable;

export const BasisGrotesqueProLightItalic =
  localFont<"--font-basis-grotesque-pro-light-italic">({
    variable: "--font-basis-grotesque-pro-light-italic",
    display: "swap",
    src: [
      {
        path: "../app/fonts/BasisGrotesquePro-LightItalic.woff2"
      }
    ]
  }) satisfies NextFontWithVariable;

export const BasisGrotesqueProMedium =
  localFont<"--font-basis-grotesque-pro-medium">({
    variable: "--font-basis-grotesque-pro-medium",
    display: "swap",
    src: [
      {
        path: "../app/fonts/BasisGrotesquePro-Medium.woff2"
      }
    ]
  }) satisfies NextFontWithVariable;

export const BasisGrotesqueProMediumItalic =
  localFont<"--font-basis-grotesque-pro-medium-italic">({
    variable: "--font-basis-grotesque-pro-medium-italic",
    display: "swap",
    src: [
      {
        path: "../app/fonts/BasisGrotesquePro-MediumItalic.woff2"
      }
    ]
  }) satisfies NextFontWithVariable;

export const BasisGrotesqueProRegular =
  localFont<"--font-basis-grotesque-pro-regular">({
    variable: "--font-basis-grotesque-pro-regular",
    display: "swap",
    src: [
      {
        path: "../app/fonts/BasisGrotesquePro-Regular.woff2"
      }
    ]
  }) satisfies NextFontWithVariable;

export const BasisGrotesqueProItalic =
  localFont<"--font-basis-grotesque-pro-italic">({
    variable: "--font-basis-grotesque-pro-italic",
    display: "swap",
    src: [
      {
        path: "../app/fonts/BasisGrotesquePro-Italic.woff2"
      }
    ]
  }) satisfies NextFontWithVariable;

export const BasisGrotesquePro = localFont<"--font-basis-grotesque-pro">({
  variable: "--font-basis-grotesque-pro",
  display: "swap",
  src: [
    {
      path: "../app/fonts/BasisGrotesquePro-Black.woff2",
      weight: "900",
      style: "normal"
    },
    {
      path: "../app/fonts/BasisGrotesquePro-BlackItalic.woff2",
      weight: "900",
      style: "italic"
    },
    {
      path: "../app/fonts/BasisGrotesquePro-Bold.woff2",
      weight: "700",
      style: "normal"
    },
    {
      path: "../app/fonts/BasisGrotesquePro-BoldItalic.woff2",
      weight: "700",
      style: "italic"
    },
    {
      path: "../app/fonts/BasisGrotesquePro-Light.woff2",
      weight: "300",
      style: "normal"
    },
    {
      path: "../app/fonts/BasisGrotesquePro-LightItalic.woff2",
      weight: "300",
      style: "italic"
    },
    {
      path: "../app/fonts/BasisGrotesquePro-Medium.woff2",
      weight: "500",
      style: "normal"
    },
    {
      path: "../app/fonts/BasisGrotesquePro-MediumItalic.woff2",
      weight: "500",
      style: "italic"
    },
    {
      path: "../app/fonts/BasisGrotesquePro-Regular.woff2",
      weight: "400",
      style: "normal"
    },
    {
      path: "../app/fonts/BasisGrotesquePro-Italic.woff2",
      weight: "400",
      style: "italic"
    }
  ]
}) satisfies NextFontWithVariable;
