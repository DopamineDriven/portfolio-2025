import { Fs } from "@d0paminedriven/fs";

const fs = new Fs(process.cwd());
const helper = (file: string) => {
  const splitDashes = file?.split(/\./g)?.[0]?.split(/(-|_)/g) ?? [""];
  if (splitDashes.length > 1) {
    return splitDashes
      .filter((_, i) => i % 2 === 0)
      .map((text, i) => {
        return i === 0
          ? text.toLowerCase()
          : text.substring(0, 1).toUpperCase().concat(text.substring(1));
      })
      .join("");
  } else return file;
};

const files = Object.fromEntries(fs.readDir("public/textures/brushed-metal").map(file => {
  return [
    helper(file),
    `https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/development/apps/web/public/textures/smooth-stucco/${file}`
  ] as const;
}));

console.log(files);



const brushedMetal = {
  brushedMetalAlbedo: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/development/apps/web/public/textures/smooth-stucco/brushed-metal-albedo.png',
  brushedMetalAo: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/development/apps/web/public/textures/smooth-stucco/brushed-metal-ao.png',
  brushedMetalMetallic: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/development/apps/web/public/textures/smooth-stucco/brushed-metal-metallic.png',
  brushedMetalNormalOgl: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/development/apps/web/public/textures/smooth-stucco/brushed-metal-normal-ogl.png',
  brushedMetalPreview: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/development/apps/web/public/textures/smooth-stucco/brushed-metal-preview.jpg',
  brushedMetalRoughness: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/development/apps/web/public/textures/smooth-stucco/brushed-metal-roughness.png'
} as const;

const _getBrushedMetal = <const T extends keyof typeof brushedMetal>(target: T) => brushedMetal[target];

const smoothStucco = {
  smoothStuccoHeight: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/development/apps/web/public/textures/smooth-stucco/smooth-stucco-Height.png',
  smoothStuccoMetallic: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/development/apps/web/public/textures/smooth-stucco/smooth-stucco-Metallic.png',
  smoothStuccoNormalOgl: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/development/apps/web/public/textures/smooth-stucco/smooth-stucco-Normal-ogl.png',
  smoothStuccoRoughness: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/development/apps/web/public/textures/smooth-stucco/smooth-stucco-Roughness.png',
  smoothStuccoAlbedo: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/development/apps/web/public/textures/smooth-stucco/smooth-stucco-albedo.png',
  smoothStuccoAo: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/development/apps/web/public/textures/smooth-stucco/smooth-stucco-ao.png',
  smoothStuccoPreview: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/development/apps/web/public/textures/smooth-stucco/smooth-stucco-preview.jpg'
} as const;


const _getSmoothStucco = <const T extends keyof typeof smoothStucco>(target: T) => smoothStucco[target];


/**
  works but is...questionable


  const smoothStucco = {
  smoothStuccoHeight: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/development/apps/web/public/textures/smooth-stucco/smooth-stucco-Height.png',
  smoothStuccoMetallic: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/development/apps/web/public/textures/smooth-stucco/smooth-stucco-Metallic.png',
  smoothStuccoNormalOgl: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/development/apps/web/public/textures/smooth-stucco/smooth-stucco-Normal-ogl.png',
  smoothStuccoRoughness: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/development/apps/web/public/textures/smooth-stucco/smooth-stucco-Roughness.png',
  smoothStuccoAlbedo: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/development/apps/web/public/textures/smooth-stucco/smooth-stucco-albedo.png',
  smoothStuccoAo: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/development/apps/web/public/textures/smooth-stucco/smooth-stucco-ao.png',
  smoothStuccoPreview: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/development/apps/web/public/textures/smooth-stucco/smooth-stucco-preview.jpg',
  get(target: Exclude<keyof typeof this, "get">) {
    return this[target];
  }
} as const;

console.log(smoothStucco.get("smoothStuccoNormalOgl"))

 */
