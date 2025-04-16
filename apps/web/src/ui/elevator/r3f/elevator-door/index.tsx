"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { animate, useSpring } from "motion/react";
import * as THREE from "three";

export const ElevatorDoor = ({
  position,
  isLeft,
  activated
}: {
  position: number;
  isLeft: boolean;
  activated: boolean;
}) => {
  const doorRef = useRef<THREE.Mesh>(null);
  const targetX = isLeft
    ? activated
      ? -0.55
      : -0.025
    : activated
      ? 0.55
      : 0.025;
  const doorX = useSpring(isLeft ? -0.025 : 0.025, {
    stiffness: 80,
    damping: 20
  });

  useEffect(() => {
    animate(doorX, targetX, { stiffness: 80, damping: 20 });
  }, [activated, doorX, targetX]);

  useFrame(() => {
    if (doorRef.current) doorRef.current.position.x = doorX.get();
  });

  return (
    <mesh
      ref={doorRef}
      position={[isLeft ? -0.025 : 0.025, 0, position]}
      castShadow
      receiveShadow>
      <boxGeometry args={[0.5, 2.5, 0.05]} />
      <meshStandardMaterial color="#8c9399" metalness={0.6} roughness={0.3} />
    </mesh>
  );
};
