import { kebabToCamel } from "@/lib/to-title-case";
import { Fs } from "@d0paminedriven/fs";


const keysHelper = <const F extends string, const Arg extends string>(file: F, argv3: Arg) => {
  return (file.replace(`${argv3}-`, "").split(/\./g)[0] ?? "").toLowerCase();
}

const handleKeys = <const F extends string, const Arg extends string>(
  file: F,
  argv3: Arg
) => {
  if (/(?:([A-Za-z-]+-normal-ogl\.?)[a-z]{3,4}$)/gi.test(file)) {
    return keysHelper(file, argv3).replace(
      "-ogl",
      ""
    );
  } else if (/(?:([A-Za-z-]+-(metallic|Metallic)\.?)[a-z]{3,4}$)/gi.test(file)) {
    return keysHelper(file, argv3).replace(
      "metallic",
      "metalness"
    );
  }
   else return keysHelper(file, argv3);
};

const files = (target: string) => {
  const fs = new Fs(process.cwd());
  return Object.fromEntries(
    fs.readDir(`public/textures/${target}`).map(file => {
      return [
        handleKeys(file, target),
        `https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/${target}/${file}`
      ] as const;
    })
  );
};


const templateIt = <const V extends string>(argv3: V) => {
  const getObj = files(argv3);
  // prettier-ignore
  return `
export const ${kebabToCamel(argv3)} = ${JSON.stringify(getObj, null, 2)} as const
`
}

function write<const V extends string>(argv3: V) {
  const fs = new Fs(process.cwd());

  fs.withWs(`src/utils/__generated__/textures/${argv3}.ts`, templateIt(argv3));
}
const argv3 = process.argv[3];
if (argv3) {
  write(argv3);
}

const whiteMarble = {
  whiteMarbleAlbedo:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/white-marble/white-marble-albedo.png",
  whiteMarbleAo:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/white-marble/white-marble-ao.png",
  whiteMarbleHeight:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/white-marble/white-marble-height.png",
  whiteMarbleMetallic:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/white-marble/white-marble-metallic.png",
  whiteMarbleNormalOgl:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/white-marble/white-marble-normal-ogl.png",
  whiteMarblePreview:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/white-marble/white-marble-preview.jpg",
  whiteMarbleRoughness:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/white-marble/white-marble-roughness.png"
} as const;

const _getWhiteMarble = <const T extends keyof typeof whiteMarble>(target: T) =>
  whiteMarble[target];

const brushedMetal = {
  brushedMetalAlbedo:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/brushed-metal/brushed-metal-albedo.png",
  brushedMetalAo:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/brushed-metal/brushed-metal-ao.png",
  brushedMetalMetallic:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/brushed-metal/brushed-metal-metallic.png",
  brushedMetalNormalOgl:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/brushed-metal/brushed-metal-normal-ogl.png",
  brushedMetalPreview:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/brushed-metal/brushed-metal-preview.jpg",
  brushedMetalRoughness:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/brushed-metal/brushed-metal-roughness.png"
} as const;

const _getBrushedMetal = <const T extends keyof typeof brushedMetal>(
  target: T
) => brushedMetal[target];

const smoothStucco = {
  smoothStuccoHeight:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/smooth-stucco/smooth-stucco-Height.png",
  smoothStuccoMetallic:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/smooth-stucco/smooth-stucco-Metallic.png",
  smoothStuccoNormalOgl:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/smooth-stucco/smooth-stucco-Normal-ogl.png",
  smoothStuccoRoughness:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/smooth-stucco/smooth-stucco-Roughness.png",
  smoothStuccoAlbedo:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/smooth-stucco/smooth-stucco-albedo.png",
  smoothStuccoAo:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/smooth-stucco/smooth-stucco-ao.png",
  smoothStuccoPreview:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/smooth-stucco/smooth-stucco-preview.jpg"
} as const;

const _getSmoothStucco = <const T extends keyof typeof smoothStucco>(
  target: T
) => smoothStucco[target];

/**
 const brushedMetal: PBRTextureSet = {
  albedo: "/textures/brushed-metal/brushed-metal-albedo.png",
  ao: "/textures/brushed-metal/brushed-metal-ao.png",
  metalness: "/textures/brushed-metal/brushed-metal-metallic.png",
  normal: "/textures/brushed-metal/brushed-metal-normal-ogl.png",
  roughness: "/textures/brushed-metal/brushed-metal-roughness.png"
};

const smoothStucco: PBRTextureSet = {
  albedo: "/textures/smooth-stucco/smooth-stucco-albedo.png",
  ao: "/textures/smooth-stucco/smooth-stucco-ao.png",
  metalness: "/textures/smooth-stucco/smooth-stucco-Metallic.png",
  normal: "/textures/smooth-stucco/smooth-stucco-Normal-ogl.png",
  roughness: "/textures/smooth-stucco/smooth-stucco-Roughness.png"
};
 */

/**
  works but is...questionable


  const smoothStucco = {
  smoothStuccoHeight: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/smooth-stucco/smooth-stucco-Height.png',
  smoothStuccoMetallic: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/smooth-stucco/smooth-stucco-Metallic.png',
  smoothStuccoNormalOgl: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/smooth-stucco/smooth-stucco-Normal-ogl.png',
  smoothStuccoRoughness: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/smooth-stucco/smooth-stucco-Roughness.png',
  smoothStuccoAlbedo: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/smooth-stucco/smooth-stucco-albedo.png',
  smoothStuccoAo: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/smooth-stucco/smooth-stucco-ao.png',
  smoothStuccoPreview: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/smooth-stucco/smooth-stucco-preview.jpg',
  get(target: Exclude<keyof typeof this, "get">) {
    return this[target];
  }
} as const;

console.log(smoothStucco.get("smoothStuccoNormalOgl"))

 */
