"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { animate, useSpring } from "motion/react";
import * as THREE from "three";
import { FluorescentLight } from "@/ui/elevator/r3f/fluorescent-light";

export const ElevatorInterior = ({ activated }: { activated: boolean }) => {
  // Light intensity animation
  const lightIntensity = useSpring(0, { stiffness: 100, damping: 15 });
  const primaryLightRef = useRef<THREE.PointLight>(null);
  const secondaryLightRef = useRef<THREE.PointLight>(null);
  useEffect(() => {
    animate(lightIntensity, activated ? 1.5 : 0, {
      stiffness: 100,
      damping: 15,
      // Slight delay for light to turn on after doors start opening
      delay: activated ? 300 : 0
    });
  }, [activated, lightIntensity]);

  // update light intensity on each frame
  useFrame(() => {
    const currentIntensity = lightIntensity.get();
    if (primaryLightRef.current) {
      primaryLightRef.current.intensity = currentIntensity * 0.8;
    }
    if (secondaryLightRef.current) {
      secondaryLightRef.current.intensity = currentIntensity * 0.4;
    }
  });

  return (
    <group position={[0, 0, 0]} visible={true}>
      {/* back wall */}
      <mesh position={[0, 0, -0.05]} receiveShadow>
        <boxGeometry args={[1, 2.5, 0.05]} />
        <meshStandardMaterial color="#777" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* side walls */}
      <mesh
        position={[-0.5, 0, -0.025]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow>
        <boxGeometry args={[0.05, 2.5, 0.05]} />
        <meshStandardMaterial color="#777" metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh
        position={[0.5, 0, -0.025]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow>
        <boxGeometry args={[0.05, 2.5, 0.05]} />
        <meshStandardMaterial color="#777" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* ceiling + fluorescent light fixture group */}
      <group position={[0, 1.25, -0.025]}>
        {/* ceiling panel */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[1, 0.5]} />
          <meshStandardMaterial color="#666" roughness={0.9} metalness={0.1} />
        </mesh>

        {/* fluorescent light fixture */}
        <group position={[0, -0.02, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
          <FluorescentLight intensity={lightIntensity.get()} />
        </group>
      </group>

      {/* floor */}
      <mesh
        position={[0, -1.25, -0.025]}
        rotation={[Math.PI / 2, 0, 0]}
        receiveShadow>
        <planeGeometry args={[1, 0.5]} />
        <meshStandardMaterial color="#333" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* interior lights */}
      <pointLight
        ref={primaryLightRef}
        position={[0, 1.2, 0.1]}
        intensity={0}
        distance={3}
        decay={2}
        color="#f0f0ff" // subtly-blue hue for fluorescent light
      />

      {/* secondary fill light for enhanced illumination */}
      <pointLight
        ref={secondaryLightRef}
        position={[0, 0, 0.1]}
        intensity={0}
        distance={2}
        decay={2}
        color="#f0f0ff"
      />
    </group>
  );
};
