"use client";

export const ElevatorFrame = () => {
  return (
    <group>
      {/* outer */}
      <mesh position={[0, 0, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 3, 0.1]} />
        <meshStandardMaterial color="#444" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* inner */}
      <mesh position={[0, 0, 0.06]} castShadow receiveShadow>
        <boxGeometry args={[1, 2.6, 0.1]} />
        <meshStandardMaterial color="#555" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* top header */}
      <mesh position={[0, 1.4, 0.07]} castShadow receiveShadow>
        <boxGeometry args={[1, 0.2, 0.1]} />
        <meshStandardMaterial color="#444" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
};
