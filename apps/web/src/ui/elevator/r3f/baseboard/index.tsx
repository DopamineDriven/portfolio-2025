"use client";

export const Baseboard = () => {
  return (
    <mesh position={[0, -1.5, 0]} receiveShadow>
      <boxGeometry args={[8, 0.2, 0.3]} />
      <meshStandardMaterial  color="#111" metalness={0.3} roughness={0.7} />
    </mesh>
  );
};
