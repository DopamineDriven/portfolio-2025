"use client";

import { INDICATOR_COLORS } from "@/ui/elevator/r3f/constants/indicator-colors";

export const FloorIndicator = ({ activated }: { activated: boolean }) => {
  return (
    <group position={[0, 1.5, 0.2]} renderOrder={20}>
      {/* Indicator housing - Severance style rectangular panel */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.55, 0.3, 0.05]} />
        <meshStandardMaterial
          color={INDICATOR_COLORS.PANEL_HOUSING}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Down triangle with Severance style internal illumination */}
      <group position={[0, 0, 0.026]} renderOrder={22}>
        {/* Background for the indicator */}
        <mesh>
          <planeGeometry args={[0.45, 0.22]} />
          <meshStandardMaterial color="#333" metalness={0.2} roughness={0.8} />
        </mesh>

        {/* Down triangle - larger and with Severance amber color */}
        <mesh position={[0, 0, 0.1]}>
          <downTriangleGeometry args={[0.18, 0.18]} />
          <meshStandardMaterial
            color={
              activated
                ? INDICATOR_COLORS.ACTIVE_EMISSIVE
                : INDICATOR_COLORS.INACTIVE_BASE
            }
            emissive={activated ? INDICATOR_COLORS.ACTIVE_EMISSIVE : "#000000"}
            emissiveIntensity={
              activated
                ? INDICATOR_COLORS.ACTIVE_INTENSITY
                : INDICATOR_COLORS.INACTIVE_INTENSITY
            }
            metalness={0.3}
            roughness={0.4}
            toneMapped={false}
          />
        </mesh>
        {/* subtle base glow under inactive state */}
        {!activated && (
          <mesh position={[0, 0, 0.099]}>
            <downTriangleGeometry args={[0.18, 0.18]} />
            <meshBasicMaterial
              color="#222"
              opacity={0.6}
              transparent
              toneMapped={false}
            />
          </mesh>
        )}
      </group>
    </group>
  );
};

// "use client";

// export const FloorIndicator = ({ activated }: { activated: boolean }) => {
//   return (
//     <group position={[0, 1.4, 0.06]}>
//       <mesh position={[0, 0, 0]} castShadow>
//         <boxGeometry args={[0.5, 0.2, 0.05]} />
//         <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
//       </mesh>
//       <mesh position={[0, 0, 0.026]}>

//         <meshStandardMaterial
//           color="#000"
//           emissive="#ff6e00"
//           emissiveIntensity={activated ? 1 : 0.5}
//           transparent
//           opacity={1}
//         />
//       </mesh>
//     </group>
//   );
// };
