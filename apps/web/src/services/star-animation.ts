import { Fs } from "@d0paminedriven/fs";

const fs = new Fs(process.cwd());

const stars = Array.from({ length: 200 }, (_, _i) => ({
  cx: Math.random() * 100 + "%",
  cy: Math.random() * 100 + "%",
  r: Math.random() * 1.5 + 0.5,
  animationDelay: Math.random() * 5 + "s"
}));

if (process.argv[2] === "generate") {
  fs.withWs(
    "src/ui/world-tour/constants.ts",
    `export const starFieldBackgroundProps = ${JSON.stringify(stars, null, 2)}`
  );
}
