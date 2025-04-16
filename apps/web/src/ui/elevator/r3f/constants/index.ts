import type { PBRTextureSet } from "@/ui/elevator/r3f/types";

// Texture definitions
export const TEXTURES = {
  stuccoWall: {
    albedo:
      "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/smooth-stucco/smooth-stucco-albedo.png",
    ao: "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/smooth-stucco/smooth-stucco-ao.png",
    metalness:
      "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/smooth-stucco/smooth-stucco-Metallic.png",
    normal:
      "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/smooth-stucco/smooth-stucco-Normal-ogl.png",
    roughness:
      "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/smooth-stucco/smooth-stucco-Roughness.png"
  } satisfies PBRTextureSet,
  // could use with elevator doors
  brushedMetal: {
    albedo:
      "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/brushed-metal/brushed-metal-albedo.png",
    ao: "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/brushed-metal/brushed-metal-ao.png",
    metalness:
      "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/brushed-metal/brushed-metal-metallic.png",
    normal:
      "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/brushed-metal/brushed-metal-normal-ogl.png",
    roughness:
      "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/brushed-metal/brushed-metal-roughness.png"
  } satisfies PBRTextureSet
} as const;

// in ms
export const ANIMATION_TIMING = {
  BUTTON_PRESS: 391.813,
  DOOR_OPEN: 1848,
  ELEVATOR_SOUND: 1619.592,
  TRANSITION: 2768.98
};
