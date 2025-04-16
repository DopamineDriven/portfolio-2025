"use client";

import type { RefObject } from "react";
import { useEffect, useMemo, useRef } from "react";
import { useHelper } from "@react-three/drei";
import { SpotLightMaterial } from "@react-three/drei/materials/SpotLightMaterial";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SpotLightHelper as SpotLightHelperImpl } from "three";

/** no-op Drei helper helper */
class DreiHelperHelper extends THREE.Object3D {
  update() {}
  dispose() {}
}

// 🔧 Safe wrapper for useHelper that doesn't violate the rules of hooks
const useSpotLightHelperImpl = (
  ref: RefObject<THREE.SpotLight>,
  showHelper: boolean,
  color?: THREE.ColorRepresentation
) => {
  const helperConstructor = (
    process.env.NODE_ENV !== "production" && showHelper
      ? SpotLightHelperImpl
      : DreiHelperHelper
  ) satisfies typeof DreiHelperHelper | typeof SpotLightHelperImpl;

  return useHelper(ref, helperConstructor, color);
};

export type UseVolumetricSpotLightProps = {
  debug?: boolean;
  showHelper?: boolean;
  color?: string | number | THREE.Color;
  distance?: number;
  angle?: number;
  attenuation?: number;
  /** default &rarr; intensity = 1 */
  intensity?: number;
  anglePower?: number;
  helperColor?: string | number | THREE.Color;
  opacity?: number;
  radiusTop?: number;
  radiusBottom?: number;
  shadowMapSize?: number;
};

interface VolumetricSpotUniforms extends Record<string, THREE.IUniform<any>> {
  lightColor: THREE.IUniform<THREE.Color>;
  opacity: THREE.IUniform<number>;
  attenuation: THREE.IUniform<number>;
  anglePower: THREE.IUniform<number>;
  spotPosition: THREE.IUniform<THREE.Vector3>;
  cameraNear: THREE.IUniform<number>;
  cameraFar: THREE.IUniform<number>;
  resolution: THREE.IUniform<[number, number]>;
}

export function useVolumetricSpotLight({
  debug = false,
  showHelper = process.env.NODE_ENV !== "production",
  color = "white",
  distance = 20.0,
  angle = 1.07,
  attenuation = 7,
  anglePower = 5,
  intensity = 9.0,
  opacity = 0.6,
  radiusTop = 0.05,
  helperColor = "#ff00ff",
  radiusBottom = undefined,
  shadowMapSize = 1024
}: UseVolumetricSpotLightProps) {
  const spotlight = useMemo(
    () => new THREE.SpotLight(color, intensity),
    [color, intensity]
  );
  const volumetricMesh = useRef<THREE.Mesh>(null);
  const spotlightRef = useRef<THREE.SpotLight>(spotlight);

  const material = useMemo(() => new SpotLightMaterial(), []);
  const uniforms = material.uniforms as VolumetricSpotUniforms;

  const vec = useMemo(() => new THREE.Vector3(), []);
  const camera = useThree(state => state.camera);
  const size = useThree(state => state.size);
  const dpr = useThree(state => state.viewport.dpr);

  useSpotLightHelperImpl(spotlightRef, showHelper, helperColor);

  useEffect(() => {
    spotlight.castShadow = true;
    spotlight.shadow.mapSize.set(shadowMapSize, shadowMapSize);
    spotlight.angle = angle;
    spotlight.distance = distance;
    spotlight.penumbra = 0.5;
    spotlight.decay = 2;
    spotlight.intensity = intensity;
  }, [spotlight, shadowMapSize, angle, distance, intensity]);

  useFrame(() => {
    if (!volumetricMesh.current) return;
    uniforms.spotPosition.value.copy(
      volumetricMesh.current.getWorldPosition(vec)
    );
    volumetricMesh.current.lookAt(spotlight.target.getWorldPosition(vec));
  });

  const meshGeometry = useMemo(() => {
    const geom = new THREE.CylinderGeometry(
      radiusTop,
      radiusBottom ?? angle * 7,
      distance,
      128,
      64,
      true
    );
    geom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -distance / 2, 0));
    geom.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    return geom;
  }, [angle, distance, radiusBottom, radiusTop]);

  useEffect(() => {
    uniforms.opacity.value = opacity;
    uniforms.lightColor.value.set(color);
    uniforms.attenuation.value = attenuation;
    uniforms.anglePower.value = anglePower;
    uniforms.cameraNear.value = camera.near;
    uniforms.cameraFar.value = camera.far;
    uniforms.resolution.value = [size.width * dpr, size.height * dpr];
  }, [
    uniforms,
    color,
    opacity,
    attenuation,
    anglePower,
    camera.near,
    camera.far,
    size,
    dpr
  ]);

  const volumetricElementMemo = useMemo(
    () => (
      <mesh
        ref={volumetricMesh}
        geometry={meshGeometry}
        raycast={() => null}
        visible={!debug}>
        <primitive object={material} attach="material" />
      </mesh>
    ),
    [debug, material, meshGeometry]
  );

  return {
    spotlight,
    spotlightRef,
    volumetricElement: volumetricElementMemo
  };
}
