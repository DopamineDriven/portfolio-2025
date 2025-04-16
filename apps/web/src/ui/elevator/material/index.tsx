"use client";

// components/ElevatorMaterial.tsx
import { useEffect } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export type PBRTextureSet = {
  albedo: string;
  ao: string;
  metalness: string;
  normal: string;
  roughness: string;
};

export function ElevatorMaterial({
  textures,
  repeat = [1, 1]
}: {
  textures: PBRTextureSet;
  repeat?: [number, number];
}) {
  const maps = useTexture([
    textures.albedo,
    textures.ao,
    textures.metalness,
    textures.normal,
    textures.roughness
  ] as const);

  useEffect(() => {
    maps.forEach(tex => {
      if (tex) {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(...repeat);
        tex.flipY = false;
      }
    });
  }, [maps, repeat]);
  const [map, aoMap, metalnessMap, normalMap, roughnessMap] = maps;

  return (
    <meshStandardMaterial
      map={map}
      aoMap={aoMap}
      metalnessMap={metalnessMap}
      normalMap={normalMap}
      roughnessMap={roughnessMap}
      metalness={1}
      roughness={1}
    />
  );
}
