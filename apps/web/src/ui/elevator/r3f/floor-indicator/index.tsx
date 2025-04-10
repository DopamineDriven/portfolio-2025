"use client";

export const FloorIndicator = ({ activated }: { activated: boolean }) => {
  return (
    <group position={[0, 1.4, 0.06]}>
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.5, 0.2, 0.05]} />
        <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.026]} rotation={[0, 0, Math.PI]}>
        <triangleGeometry args={[0.08, 0.08]} />
        <meshStandardMaterial
          color="#000"
          emissive="#ff6e00"
          emissiveIntensity={activated ? 1 : 0.5}
          transparent
          opacity={1}
        />
      </mesh>
    </group>
  );
};
