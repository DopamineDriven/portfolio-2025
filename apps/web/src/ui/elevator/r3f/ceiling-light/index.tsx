"use client";

export const CeilingLight = () => {
  return (
    <group position={[0, 3, 3]}>
      {/* Light fixture */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
        <meshStandardMaterial color="#222" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Light source */}
      <spotLight
        position={[0, 0, 0]}
        angle={0.5}
        penumbra={0.5}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        target-position={[0, 0, 0]}
      />
    </group>
  );
};
