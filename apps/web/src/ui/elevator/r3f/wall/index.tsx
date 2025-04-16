"use client";

import { Baseboard } from "@/ui/elevator/r3f/baseboard";
import { TEXTURES } from "@/ui/elevator/r3f/constants";
import { PBRMaterial } from "@/ui/elevator/r3f/pbr-material";

export const Wall = () => {
  return (
    <group>
      {/* wall - made wider to fill more of the view */}
      <mesh position={[0, 0, -0.1]} receiveShadow>
        <boxGeometry args={[10, 5, 0.2]} />
        <PBRMaterial
          textures={TEXTURES.stuccoWall}
          repeat={[10, 5]}
          color="#b8b8b8"
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>

      {/* floor - made wider to fill more of the view */}
      <mesh
        position={[0, -2, 0.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow>
        <planeGeometry args={[10, 3]} />
        <meshStandardMaterial color="#222" roughness={0.9} metalness={0.1} />
      </mesh>
      <Baseboard />
    </group>
  );
};
