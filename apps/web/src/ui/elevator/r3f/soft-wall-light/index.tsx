"use client";

import type { RefObject } from "react";
import { useEffect, useRef } from "react";
import { useHelper } from "@react-three/drei";
import { folder, useControls } from "leva";
import * as THREE from "three";
import { RectAreaLightHelper } from "three-stdlib";

// 🔧 Helper fallback for production
class DreiHelperHelper extends THREE.Object3D {
  update() {}
  dispose() {}
}

const useRectAreaLightHelperImpl = (
  ref: RefObject<THREE.RectAreaLight>,
  showHelper: boolean,
  color?: THREE.ColorRepresentation
) => {
  const helperConstructor =
    process.env.NODE_ENV !== "production" && showHelper
      ? RectAreaLightHelper
      : DreiHelperHelper;

  return useHelper(ref, helperConstructor, color);
};

export function SoftWallLight({
  position = [0, 2, 2],
  lookAt = [0, 0, 0],
  rotation = [0, -0.9, 0],
  showHelper = process.env.NODE_ENV !== "production",
  color = "#c9c7f1",
  intensity = 1.1,
  width = 0.7,
  height = 7.2,
  helperColor = "#ff00ff"
}: {
  position?: THREE.Vector3Tuple;
  lookAt?: THREE.Vector3Tuple;
  rotation?: [number, number, number];
  showHelper?: boolean;
  color?: THREE.ColorRepresentation;
  intensity?: number;
  width?: number;
  height?: number;
  helperColor?: THREE.ColorRepresentation;
}) {
  const lightRef = useRef<THREE.RectAreaLight>(
    new THREE.RectAreaLight(color, intensity, width, height)
  );

  const {
    showHelperLeva,
    helperColorLeva,
    lightColor,
    lightIntensity,
    widthLeva,
    heightLeva,
    rotationY
  } = useControls({
    SoftWallLight: folder(
      {
        showHelperLeva: {
          value: showHelper,
          label: "Show Helper"
        },
        helperColorLeva: {
          value: (helperColor as string) ?? "ff00ff",
          label: "Helper Color"
        },
        lightColor: {
          value: (color as string) ?? "c9c7f1",
          label: "Light Color"
        },
        lightIntensity: {
          value: intensity,
          min: 0,
          max: 10,
          step: 0.1
        },
        widthLeva: {
          value: width,
          min: 0.1,
          max: 10,
          step: 0.1,
          label: "Width"
        },
        heightLeva: {
          value: height,
          min: 0.1,
          max: 10,
          step: 0.1,
          label: "Height"
        },
        rotationY: {
          value: rotation[1],
          min: -Math.PI,
          max: Math.PI,
          step: 0.01,
          label: "Rotation Y"
        }
      } as const,
      { collapsed: true }
    )
  });

  // 🛠 Attach dev helper
  useRectAreaLightHelperImpl(lightRef, showHelperLeva, helperColorLeva);

  // 🎯 LookAt behavior
  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.lookAt(...lookAt);
    }
  }, [lookAt]);

  // 🎛 Sync Leva to light props
  useEffect(() => {
    const light = lightRef.current;
    if (!light) return;

    light.intensity = lightIntensity;
    light.color.set(lightColor);
    light.width = widthLeva;
    light.height = heightLeva;

    const [rx, _ry, rz] = rotation;
    light.rotation.set(rx, rotationY, rz);
  }, [lightIntensity, lightColor, widthLeva, heightLeva, rotationY, rotation]);

  return <softWallLight ref={lightRef} position={position} />;
}
