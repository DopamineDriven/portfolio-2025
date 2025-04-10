"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export const FluorescentLight = ({ intensity = 1 }: { intensity?: number }) => {
  const lightRef = useRef<THREE.MeshStandardMaterial>(null);

  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.emissiveIntensity = intensity;
    }
  }, [intensity]);

  return (
    <group>
      {/* light fixture frame */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.9, 0.05, 0.4]} />
        <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* light fixture panel */}
      <mesh position={[0, -0.01, 0]}>
        <boxGeometry args={[0.8, 0.02, 0.3]} />
        <meshStandardMaterial
          ref={lightRef}
          color="#fff"
          emissive="#fff"
          emissiveIntensity={intensity}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};
