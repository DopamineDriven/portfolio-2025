import { Fs } from "@d0paminedriven/fs/index";
import Color from "colorjs.io";

/*
eslint-disable @typescript-eslint/no-non-null-assertion
*/

const fs = new Fs(process.cwd());

export const HSL_VARIABLE_REGEX =
  /(--[\w-]+):\s*([\d.]+)deg\s+([\d.]+)%\s+([\d.]+)%\s*;/g;

/**
 * return parsed tailwind base layer color variables in theme as [varName, H, S, L].
 */
export function parseTailwindHSLVars(
  cssText: string
): [string, number, number, number][] {
  const matches = [...cssText.matchAll(HSL_VARIABLE_REGEX)];
  // Transform regex captures into typed tuples
  return matches.map(match => {
    const varName = match[1]; // e.g. --background
    const hue = parseFloat(match[2]!);
    const saturation = parseFloat(match[3]!);
    const lightness = parseFloat(match[4]!);

    return [varName, hue, saturation, lightness] as [
      string,
      number,
      number,
      number
    ];
  });
}

const _readFile = fs.fileToBuffer("src/app/global.css").toString("utf-8");

const darkOnly = `.dark {
    --background: 222.2deg 84% 4.9%;
    --foreground: 210deg 40% 98%;
    --card: 222.2deg 84% 4.9%;
    --card-foreground: 210deg 40% 98%;
    --popover: 222.2deg 84% 4.9%;
    --popover-foreground: 210deg 40% 98%;
    --primary: 217.2deg 91.2% 59.8%;
    --primary-foreground: 222.2deg 47.4% 11.2%;
    --secondary: 217.2deg 32.6% 17.5%;
    --secondary-foreground: 210deg 40% 98%;
    --muted: 217.2deg 32.6% 17.5%;
    --muted-foreground: 215deg 20.2% 65.1%;
    --accent: 217.2deg 32.6% 17.5%;
    --accent-foreground: 210deg 40% 98%;
    --destructive: 0deg 62.8% 30.6%;
    --destructive-foreground: 210deg 40% 98%;
    --border: 217.2deg 32.6% 17.5%;
    --input: 217.2deg 32.6% 17.5%;
    --ring: 224.3deg 76.3% 48%;
}`;

const lightOnly = `{
    --background: 0deg 0% 100%;
    --foreground: 222.2deg 84% 4.9%;
    --card: 0deg 0% 100%;
    --card-foreground: 222.2deg 84% 4.9%;
    --popover: 0deg 0% 100%;
    --popover-foreground: 222.2deg 84% 4.9%;
    --primary: 221.2deg 83.2% 53.3%;
    --primary-foreground: 210deg 40% 98%;
    --secondary: 210deg 40% 96.1%;
    --secondary-foreground: 222.2deg 47.4% 11.2%;
    --muted: 210deg 40% 96.1%;
    --muted-foreground: 215.4deg 16.3% 46.9%;
    --accent: 210deg 40% 96.1%;
    --accent-foreground: 222.2deg 47.4% 11.2%;
    --destructive: 0deg 84.2% 60.2%;
    --destructive-foreground: 210deg 40% 98%;
    --border: 214.3deg 31.8% 91.4%;
    --input: 214.3deg 31.8% 91.4%;
    --ring: 221.2deg 83.2% 53.3%;
    --radius: 0.5rem;
    --theme-transition-duration: 0.5s;
    --loading-animation-duration: 2s;
}`;

const hslVarArrayofArrays = parseTailwindHSLVars(darkOnly);

const hslLightVarArrayofArrays = parseTailwindHSLVars(lightOnly);

function handleHsltoOkclhTransform(hsl: [string, number, number, number][]) {
  return hsl.map(hslVal => {
    console.log(hslVal);
    const colorJS = new Color({
      space: "hsl",
      coords: [hslVal[1], hslVal[2], hslVal[3]]
    }).oklch as unknown as [number, number, number];

    const handleOklch = `${colorJS[0]} ${colorJS[1]} ${colorJS[2]}`;
    return [hslVal[0], handleOklch] as const;
  });
}

console.log({
  dark: Object.fromEntries(handleHsltoOkclhTransform(hslVarArrayofArrays)),
  light: Object.fromEntries(handleHsltoOkclhTransform(hslLightVarArrayofArrays))
});
