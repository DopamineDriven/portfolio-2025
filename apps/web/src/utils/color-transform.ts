import Color from "colorjs.io";

/*
eslint-disable @typescript-eslint/no-non-null-assertion
*/

const HSL_VARIABLE_REGEX =
  /(--[\w-]+):\s*([\d.]+)(?:deg)?\s+([\d.]+)%\s+([\d.]+)%\s*;/g;

/**
 * return parsed tailwind base layer color variables in theme as [varName, H, S, L].
 */
function parseTailwindHSLVars(
  cssText: string
): [string, number, number, number][] {
  const matches = [...cssText.matchAll(HSL_VARIABLE_REGEX)];
  // Transform regex captures into typed tuples
  return matches.map(match => {
    const varName = match[1]; // e.g. --background
    const hue = parseFloat(match[2]!);
    const saturation = parseFloat(match[3]!);
    const lightness = parseFloat(match[4]!);

    return [varName ?? "", hue, saturation, lightness] as [
      string,
      number,
      number,
      number
    ];
  });
}

const _s = {
  root: {
    "--background": "0 0% 100%",
    "--foreground": "0 0% 3.9%",
    "--card": "0 0% 100%",
    "--card-foreground": "0 0% 3.9%",
    "--popover": "0 0% 100%",
    "--popover-foreground": "0 0% 3.9%",
    "--primary": "0 0% 9%",
    "--primary-foreground": "0 0% 98%",
    "--secondary": "0 0% 96.1%",
    "--secondary-foreground": "0 0% 9%",
    "--muted": "0 0% 96.1%",
    "--muted-foreground": "0 0% 45.1%",
    "--accent": "0 0% 96.1%",
    "--accent-foreground": "0 0% 9%",
    "--destructive": "0 84.2% 60.2%",
    "--destructive-foreground": "0 0% 98%",
    "--border": "0 0% 89.8%",
    "--input": "0 0% 89.8%",
    "--ring": "0 0% 3.9%",
    "--chart-1": "12 76% 61%",
    "--chart-2": "173 58% 39%",
    "--chart-3": "197 37% 24%",
    "--chart-4": "43 74% 66%",
    "--chart-5": "27 87% 67%",
    "--radius": "0.5rem",
    "--sidebar-background": "0 0% 98%",
    "--sidebar-foreground": "240 5.3% 26.1%",
    "--sidebar-primary": "240 5.9% 10%",
    "--sidebar-primary-foreground": "0 0% 98%",
    "--sidebar-accent": "240 4.8% 95.9%",
    "--sidebar-accent-foreground": "240 5.9% 10%",
    "--sidebar-border": "220 13% 91%",
    "--sidebar-ring": "217.2 91.2% 59.8%"
  },
  dark: {
    "--background": "0 0% 3.9%",
    "--foreground": "0 0% 98%",
    "--card": "0 0% 3.9%",
    "--card-foreground": "0 0% 98%",
    "--popover": "0 0% 3.9%",
    "--popover-foreground": "0 0% 98%",
    "--primary": "0 0% 98%",
    "--primary-foreground": "0 0% 9%",
    "--secondary": "0 0% 14.9%",
    "--secondary-foreground": "0 0% 98%",
    "--muted": "0 0% 14.9%",
    "--muted-foreground": "0 0% 63.9%",
    "--accent": "0 0% 14.9%",
    "--accent-foreground": "0 0% 98%",
    "--destructive": "0 62.8% 30.6%",
    "--destructive-foreground": "0 0% 98%",
    "--border": "0 0% 14.9%",
    "--input": "0 0% 14.9%",
    "--ring": "0 0% 83.1%",
    "--chart-1": "220 70% 50%",
    "--chart-2": "160 60% 45%",
    "--chart-3": "30 80% 55%",
    "--chart-4": "280 65% 60%",
    "--chart-5": "340 75% 55%",
    "--sidebar-background": "240 5.9% 10%",
    "--sidebar-foreground": "240 4.8% 95.9%",
    "--sidebar-primary": "224.3 76.3% 48%",
    "--sidebar-primary-foreground": "0 0% 100%",
    "--sidebar-accent": "240 3.7% 15.9%",
    "--sidebar-accent-foreground": "240 4.8% 95.9%",
    "--sidebar-border": "240 3.7% 15.9%",
    "--sidebar-ring": "217.2 91.2% 59.8%"
  }
} satisfies {
  dark: { [record: string]: string };
  root: { [record: string]: string };
};

const light = `{
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 0 0% 3.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 0 0% 3.9%;
  --primary: 0 0% 9%;
  --primary-foreground: 0 0% 98%;
  --secondary: 0 0% 96.1%;
  --secondary-foreground: 0 0% 9%;
  --muted: 0 0% 96.1%;
  --muted-foreground: 0 0% 45.1%;
  --accent: 0 0% 96.1%;
  --accent-foreground: 0 0% 9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 0 0% 89.8%;
  --input: 0 0% 89.8%;
  --ring: 0 0% 3.9%;
  --chart-1: 12 76% 61%;
  --chart-2: 173 58% 39%;
  --chart-3: 197 37% 24%;
  --chart-4: 43 74% 66%;
  --chart-5: 27 87% 67%;
  --radius: 0.5rem;
  --sidebar-background: 0 0% 98%;
  --sidebar-foreground: 240 5.3% 26.1%;
  --sidebar-primary: 240 5.9% 10%;
  --sidebar-primary-foreground: 0 0% 98%;
  --sidebar-accent: 240 4.8% 95.9%;
  --sidebar-accent-foreground: 240 5.9% 10%;
  --sidebar-border: 220 13% 91%;
  --sidebar-ring: 217.2 91.2% 59.8%;
}`;
const dark = `.dark {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  --card: 0 0% 3.9%;
  --card-foreground: 0 0% 98%;
  --popover: 0 0% 3.9%;
  --popover-foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  --primary-foreground: 0 0% 9%;
  --secondary: 0 0% 14.9%;
  --secondary-foreground: 0 0% 98%;
  --muted: 0 0% 14.9%;
  --muted-foreground: 0 0% 63.9%;
  --accent: 0 0% 14.9%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 0% 98%;
  --border: 0 0% 14.9%;
  --input: 0 0% 14.9%;
  --ring: 0 0% 83.1%;
  --chart-1: 220 70% 50%;
  --chart-2: 160 60% 45%;
  --chart-3: 30 80% 55%;
  --chart-4: 280 65% 60%;
  --chart-5: 340 75% 55%;
  --radius: 0.5rem;
  --sidebar-background: 240 5.9% 10%;
  --sidebar-foreground: 240 4.8% 95.9%;
  --sidebar-primary: 224.3 76.3% 48%;
  --sidebar-primary-foreground: 0 0% 100%;
  --sidebar-accent: 240 3.7% 15.9%;
  --sidebar-accent-foreground: 240 4.8% 95.9%;
  --sidebar-border: 240 3.7% 15.9%;
  --sidebar-ring: 217.2 91.2% 59.8%;
}`;

const hslDark = parseTailwindHSLVars(dark);
const hslLight = parseTailwindHSLVars(light);

function handleHsltoOkclhTransform(hsl: [string, number, number, number][]) {
  return hsl.map(hslVal => {
    console.log(hslVal);
    const colorJS = new Color({
      space: "hsl",
      coords: [hslVal[1], hslVal[2], hslVal[3]]
    }).oklch as unknown as [number, number, number];

    const handleOklch = `oklch(${Math.fround(colorJS[0]*100).toPrecision(4)}% ${colorJS[1] < 0.0001 ? 0 : colorJS[1].toPrecision(4)} ${isNaN(colorJS[2]) ? 0 : colorJS[2].toPrecision(4)})` as const;
    return [hslVal[0], handleOklch] as const;
  });
}

console.log({
  dark: Object.fromEntries(handleHsltoOkclhTransform(hslDark)),
  light: Object.fromEntries(handleHsltoOkclhTransform(hslLight))
});
