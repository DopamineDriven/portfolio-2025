"use client";

import { useEffect } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { PBRTextureSet } from "../types";

export function PBRMaterial({
  textures,
  repeat = [1, 1],
  color = "#ffffff",
  metalness = 0.5,
  roughness = 0.5
}: {
  textures: PBRTextureSet;
  repeat?: [number, number];
  color?: string;
  metalness?: number;
  roughness?: number;
}) {
  // TODO utilize onload callback (second optional arg in useTexture)
  const textureProps = useTexture({
    map: textures.albedo,
    aoMap: textures.ao,
    metalnessMap: textures.metalness,
    normalMap: textures.normal,
    roughnessMap: textures.roughness
  });

  useEffect(() => {
    Object.values(textureProps).forEach(tex => {
      if (tex) {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(...repeat);
        tex.flipY = false;
      }
    });

    return () => {
      Object.values(textureProps).forEach(tex => {
        if (tex) tex.dispose();
      });
    };
  }, [textureProps, repeat]);

  return (
    <meshStandardMaterial
      {...textureProps}
      color={color}
      metalness={metalness}
      roughness={roughness}
    />
  );
}
