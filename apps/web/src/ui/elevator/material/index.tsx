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
  const [map, aoMap, metalnessMap, normalMap, roughnessMap] = useTexture([
    textures.albedo,
    textures.ao,
    textures.metalness,
    textures.normal,
    textures.roughness
  ] as const);

  useEffect(() => {
    const maps = [map, aoMap, metalnessMap, normalMap, roughnessMap] as const;
    maps.forEach(tex => {
      if (tex) {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(...repeat);
        tex.flipY = false;
      }
    });
  }, [map, aoMap, metalnessMap, normalMap, roughnessMap, repeat]);

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
