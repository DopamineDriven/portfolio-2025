"use client";

import type { ThreeEvent } from "@react-three/fiber";

export const ElevatorButton = ({
  activated,
  onClickAction
}: {
  activated: boolean;
  onClickAction:
    | ((event: ThreeEvent<MouseEvent>) => void)
    | Readonly<((event: ThreeEvent<MouseEvent>) => void) | undefined>;
}) => {
  return (
    <group position={[0.9, 0, 0.1]} ref={null}>
      <mesh position={[0, 0, 0]} castShadow onClick={onClickAction}>
        <boxGeometry args={[0.15, 0.4, 0.05]} />
        <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.026]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[0.06, 0.06]} />
        <meshStandardMaterial
          color="#000"
          emissive="#ff6e00"
          emissiveIntensity={activated ? 1 : 0.5}
        />
      </mesh>
    </group>
  );
};
