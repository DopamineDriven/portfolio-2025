"use client";

import type { ThreeEvent } from "@react-three/fiber";
import { INDICATOR_COLORS } from "@/ui/elevator/r3f/constants/indicator-colors";

export const ElevatorButton = ({
  activated,
  onClickAction
}: {
  activated: boolean;
  onClickAction:
    | ((event: ThreeEvent<MouseEvent>) => void)
    | Readonly<((event: ThreeEvent<MouseEvent>) => void) | undefined>;
}) => {
  // Changed position from [1.2, -0.2, 0.1] to [0.75, -0.2, 0.1]
  // This reduces the distance between the button panel and elevator frame by approximately half
  return (
    <group position={[0.75, -0.2, 0.1]} renderOrder={15}>
      {/* Button panel - Severance style */}
      <mesh position={[0, 0, 0]} castShadow onClick={onClickAction}>
        <boxGeometry args={[0.2, 0.5, 0.05]} />
        <meshStandardMaterial
          color={INDICATOR_COLORS.PANEL_HOUSING}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Single button with down arrow */}
      <group position={[0, 0, 0.026]} renderOrder={16}>
        {/* Button border */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
          <meshStandardMaterial
            color={INDICATOR_COLORS.BUTTON_RING}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>

        {/* Button face */}
        <mesh position={[0, 0, 0.011]}>
          <cylinderGeometry args={[0.045, 0.045, 0.01, 16]} />
          <meshStandardMaterial
            color={INDICATOR_COLORS.BUTTON_FACE}
            emissive={INDICATOR_COLORS.ACTIVE_EMISSIVE_GREEN}
            emissiveIntensity={
              activated
                ? INDICATOR_COLORS.ACTIVE_INTENSITY
                : INDICATOR_COLORS.INACTIVE_INTENSITY
            }
            metalness={0.2}
            roughness={0.8}
          />
        </mesh>

        {/* Down arrow on button */}
        <mesh position={[0, 0, 0.016]} rotation={[0, 0, Math.PI]}>
          <downTriangleGeometry args={[0.03, 0.03]} />
          <meshBasicMaterial color="#fff" transparent opacity={0.9} />
        </mesh>
      </group>
    </group>
  );
};
