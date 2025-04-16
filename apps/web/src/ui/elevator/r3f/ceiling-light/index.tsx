"use client";

import type { UseVolumetricSpotLightProps } from "@/ui/elevator/r3f/hooks/use-volumetric-spot-light";
import { useVolumetricSpotLight } from "@/ui/elevator/r3f/hooks/use-volumetric-spot-light";
import { useEffect, useRef } from "react";
import { useControls } from "leva";
import * as THREE from "three";

type PositionProps =
  | THREE.Vector3
  | [x: number, y: number, z: number]
  | Readonly<
      number | THREE.Vector3 | [x: number, y: number, z: number] | undefined
    >;

type CeilingLightProps = {
  showHelper?: boolean;
  intensity?: number;
  color?: string | number | THREE.Color;
  position?: PositionProps;
  debug?: boolean;
};

export function CeilingLight({
  showHelper = process.env.NODE_ENV !== "production",
  intensity = 9.0,
  color = "#ffffff",
  position = [0, 4.5, 1],
  debug = false
}: CeilingLightProps) {
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

// export function CeilingLight({
//   showHelper = process.env.NODE_ENV !== "production",
//   intensity = 9.0,
//   color = "#ffffff",
//   position = [0, 4.5, 1],
//   debug = false
// }: CeilingLightProps) {
//   const {
//     coneOpacity,
//     helperColor,
//     targetHeight,
//     lightAngle,
//     groupPosition,
//     lightDistance,
//     lightIntensity,
//     showHelper: showHelperLeva = showHelper
//   } = useControls("CeilingLight", {
//     groupPosition: {
//       value: { x: 0, y: 4.5, z: 1 },
//       x: { step: 0.1, min: -10, max: 10 },
//       y: { step: 0.1, min: 0, max: 10 },
//       z: { step: 0.1, min: -10, max: 10 }
//     },
//     showHelper: {
//       value: true,
//       label: "Show Helper"
//     },
//     helperColor: {
//       value: "#ff00ff",
//       label: "Helper Color"
//     },
//     lightIntensity: {
//       value: 1.5,
//       min: 0,
//       max: 10,
//       step: 0.1
//     },
//     lightDistance: {
//       value: 20,
//       min: 1,
//       max: 30,
//       step: 0.5
//     },
//     lightAngle: {
//       value: 1.07,
//       min: 0.1,
//       max: Math.PI / 2,
//       step: 0.01
//     },
//     coneOpacity: {
//       value: 0.6,
//       min: 0,
//       max: 1,
//       step: 0.05
//     },
//     targetHeight: {
//       value: -5.0,
//       min: -10,
//       max: 0,
//       step: 0.1
//     }
//   } as const);

//   const targetRef = useRef<THREE.Object3D>(null);

//   const { spotlight, spotlightRef, volumetricElement } = useVolumetricSpotLight(
//     {
//       opacity: coneOpacity,
//       angle: lightAngle,
//       showHelper: showHelperLeva,
//       color,
//       distance: lightDistance,
//       intensity: lightIntensity ?? intensity,
//       helperColor,
//       debug
//     } satisfies UseVolumetricSpotLightProps
//   );

//   useEffect(() => {
//     if (targetRef.current) {
//       spotlight.target = targetRef.current;
//       spotlight.target.updateMatrixWorld();
//     }
//   }, [spotlight]);

//   return (
//     <group position={[groupPosition.x, groupPosition.y, groupPosition.z]}>
//       {/* Fixture */}
//       <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
//         <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
//         <meshStandardMaterial color="#222" metalness={0.7} roughness={0.3} />
//       </mesh>

//       {/* Spotlight primitive + volumetric */}
//       <primitive object={spotlight} ref={spotlightRef} position={[0, 0, 0]}>
//         {volumetricElement}
//       </primitive>

//       {/* Target */}
//       <object3D ref={targetRef} position={[0, targetHeight, 0]} />
//     </group>
//   );
// }
