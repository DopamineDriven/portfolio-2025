"use client";

import type * as THREE from "three";
import type { UseVolumetricSpotLightProps } from "@/ui/elevator/r3f/hooks/use-volumetric-spot-light";
import { useVolumetricSpotLight } from "@/ui/elevator/r3f/hooks/use-volumetric-spot-light";
import { useEffect, useRef } from "react";
import { useControls } from "leva";

type PositionProps =
  | THREE.Vector3
  | [x: number, y: number, z: number]
  | Readonly<
      number | THREE.Vector3 | [x: number, y: number, z: number] | undefined
    >;

type CeilingLightProps = {
  showHelper?: boolean;
  intensity?: number;
  color?: string;
  position?: PositionProps;
  debug?: boolean;
};

export function CeilingLight({
  showHelper = true,
  intensity = 9.0, // Updated to optimal value
  color = "#ffffff",
  position = [0, 4.5, 1],
  debug = false
}: CeilingLightProps) {
  // Using the optimized values from your screenshot as defaults
  const {
    coneOpacity,
    helperColor,
    targetHeight,
    lightAngle,
    lightDistance,
    lightIntensity,
    showHelper: showHelperLeva = showHelper
  } = useControls("CeilingLight", {
    showHelper: {
      value: false,
      label: "Show Helper"
    },
    helperColor: {
      value: "#ff00ff", // Magenta as shown in screenshot
      label: "Helper Color"
    },
    lightIntensity: {
      value: 9.0, // Optimized value from screenshot
      min: 0,
      max: 10,
      step: 0.1
    },
    lightDistance: {
      value: 20.0, // Optimized value from screenshot
      min: 1,
      max: 30,
      step: 0.5
    },
    lightAngle: {
      value: 1.07, // Optimized value from screenshot
      min: 0.1,
      max: Math.PI / 2,
      step: 0.01
    },
    coneOpacity: {
      value: 0.6, // Optimized value from screenshot
      min: 0,
      max: 1,
      step: 0.05
    },
    targetHeight: {
      value: -5.0, // Optimized value from screenshot
      min: -10,
      max: 0,
      step: 0.1
    }
  } as const);

  const targetRef = useRef<THREE.Object3D>(null);

  // Even if Leva controls don't work, use the optimized values
  const effectiveIntensity = lightIntensity ?? intensity ?? 9.0;
  const effectiveDistance = lightDistance ?? 20.0;
  const effectiveAngle = lightAngle ?? 1.07;
  const effectiveOpacity = coneOpacity ?? 0.6;
  const effectiveTargetHeight = targetHeight ?? -5.0;
  const effectiveHelperColor = helperColor ?? "#ff00ff";

  const { spotlight, spotlightRef, volumetricElement } = useVolumetricSpotLight(
    {
      opacity: effectiveOpacity,
      angle: effectiveAngle,
      showHelper: showHelperLeva,
      color,
      distance: effectiveDistance,
      intensity: effectiveIntensity,
      helperColor: effectiveHelperColor,
      debug
    } satisfies UseVolumetricSpotLightProps
  );

  useEffect(() => {
    if (targetRef.current) {
      spotlight.target = targetRef.current;
      spotlight.target.updateMatrixWorld();
    }
  }, [spotlight]);

  return (
    <group position={position}>
      {/* Fixture */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
        <meshStandardMaterial color="#222" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Spotlight primitive + volumetric */}
      <primitive object={spotlight} ref={spotlightRef} position={[0, 0, 0]}>
        {volumetricElement}
      </primitive>

      {/* Target */}
      <object3D ref={targetRef} position={[0, effectiveTargetHeight, 0]} />
    </group>
  );
}
