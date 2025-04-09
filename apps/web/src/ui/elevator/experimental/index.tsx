"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { ContactShadows, Environment, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { animate, useSpring } from "motion/react";
import * as THREE from "three";

type PBRTextureSet = {
  albedo: string;
  ao: string;
  metalness: string;
  normal: string;
  roughness: string;
};

// Memoized material component to prevent unnecessary re-renders
function ElevatorMaterial({
  textures,
  repeat = [1, 1]
}: {
  textures: PBRTextureSet;
  repeat?: [number, number];
}) {
  // Load all textures in one call for better performance
  const textureProps = useTexture({
    map: textures.albedo,
    aoMap: textures.ao,
    metalnessMap: textures.metalness,
    normalMap: textures.normal,
    roughnessMap: textures.roughness
  });

  // Configure texture properties so they tile correctly
  useEffect(() => {
    Object.values(textureProps).forEach(tex => {
      if (tex) {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(...repeat);
        tex.flipY = false;
      }
    });

    // Cleanup function to dispose textures when component unmounts
    return () => {
      Object.values(textureProps).forEach(tex => {
        if (tex) tex.dispose();
      });
    };
  }, [textureProps, repeat]);

  return <meshStandardMaterial {...textureProps} metalness={1} roughness={1} />;
}

// Texture definitions - moved to a separate constant
const TEXTURES = {
  brushedMetal: {
    albedo:
      "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/brushed-metal/brushed-metal-albedo.png",
    ao: "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/brushed-metal/brushed-metal-ao.png",
    metalness:
      "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/brushed-metal/brushed-metal-metallic.png",
    normal:
      "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/brushed-metal/brushed-metal-normal-ogl.png",
    roughness:
      "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/brushed-metal/brushed-metal-roughness.png"
  } as const satisfies PBRTextureSet
};

// Memoized elevator door component to improve performance
const ElevatorDoor = ({
  position,
  isLeft,
  activated
}: {
  position: number;
  isLeft: boolean;
  activated: boolean;
}) => {
  const doorRef = useRef<THREE.Mesh>(null);
  const targetX = isLeft ? (activated ? -1 : -0.5) : activated ? 1 : 0.5;
  const doorX = useSpring(isLeft ? -0.5 : 0.5, { stiffness: 80, damping: 20 });

  useEffect(() => {
    animate(doorX, targetX, { stiffness: 80, damping: 20 });
  }, [activated, doorX, targetX]);

  useFrame(() => {
    if (doorRef.current) doorRef.current.position.x = doorX.get();
  });

  return (
    <mesh ref={doorRef} position={[isLeft ? -0.5 : 0.5, 0, position]}>
      <planeGeometry args={[1, 2.5]} />
      <ElevatorMaterial textures={TEXTURES.brushedMetal} repeat={[2, 2]} />
    </mesh>
  );
};

// Memoized light component
const ElevatorLight = ({
  type,
  activated
}: {
  type: "ceiling" | "seam";
  activated: boolean;
}) => {
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const isSeam = type === "seam";
  const initialIntensity = isSeam ? 0.1 : 0.4;
  const targetIntensity = isSeam
    ? activated
      ? 1
      : 0.1
    : activated
      ? 1.5
      : 0.4;
  const intensity = useSpring(initialIntensity, {
    stiffness: isSeam ? 100 : 80,
    damping: isSeam ? 30 : 25
  });

  useEffect(() => {
    animate(intensity, targetIntensity, {
      stiffness: isSeam ? 100 : 80,
      damping: isSeam ? 30 : 25
    });
  }, [activated, intensity, targetIntensity, isSeam]);

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = intensity.get();
    }
  });

  if (isSeam) {
    return (
      <mesh position={[0, 0, 1.01]}>
        <planeGeometry args={[0.025, 2.5]} />
        <meshStandardMaterial
          ref={materialRef}
          emissive="#fff"
          emissiveIntensity={initialIntensity}
          color="#fff"
          toneMapped={false}
          transparent
        />
      </mesh>
    );
  }

  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 1.25, 0]} receiveShadow>
      <planeGeometry args={[2, 2]} />
      <meshStandardMaterial
        ref={materialRef}
        emissive="#fff"
        emissiveIntensity={initialIntensity}
        color="#ccc"
      />
    </mesh>
  );
};

function ElevatorInterior({ activated }: { activated: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Camera animation springs
  const camZ = useSpring(4, { stiffness: 60, damping: 25 });
  const camY = useSpring(1.5, { stiffness: 60, damping: 25 });

  // Update camera position when activation state changes
  useEffect(() => {
    animate(camZ, activated ? 2.5 : 4, { stiffness: 60, damping: 25 });
    animate(camY, activated ? 1.8 : 1.5, { stiffness: 60, damping: 25 });
  }, [activated, camZ, camY]);

  // Update camera position in animation frame
  useFrame(() => {
    camera.position.set(0, camY.get(), camZ.get());
    camera.lookAt(0, 1.25, 0);
  });

  // Memoize the elevator components to prevent unnecessary re-renders
  const elevatorWalls = useMemo(
    () => (
      <>
        {/* Back wall */}
        <mesh position={[0, 0, -1]} receiveShadow>
          <planeGeometry args={[2, 2.5]} />
          <ElevatorMaterial textures={TEXTURES.brushedMetal} repeat={[2, 2]} />
        </mesh>

        {/* Floor */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -1.25, 0]}
          receiveShadow>
          <planeGeometry args={[2, 2]} />
          <ElevatorMaterial textures={TEXTURES.brushedMetal} repeat={[2, 2]} />
        </mesh>

        {/* Side walls */}
        <mesh
          rotation={[0, Math.PI / 2, 0]}
          position={[-1, 0, 0]}
          receiveShadow>
          <planeGeometry args={[2, 2.5]} />
          <ElevatorMaterial textures={TEXTURES.brushedMetal} repeat={[2, 2]} />
        </mesh>
        <mesh
          rotation={[0, -Math.PI / 2, 0]}
          position={[1, 0, 0]}
          receiveShadow>
          <planeGeometry args={[2, 2.5]} />
          <ElevatorMaterial textures={TEXTURES.brushedMetal} repeat={[2, 2]} />
        </mesh>
      </>
    ),
    []
  );

  return (
    <group ref={groupRef} position={[0, 1.25, 0]}>
      {elevatorWalls}

      {/* Ceiling light */}
      <ElevatorLight type="ceiling" activated={activated} />

      {/* Elevator doors */}
      <ElevatorDoor position={1} isLeft={true} activated={activated} />
      <ElevatorDoor position={1} isLeft={false} activated={activated} />

      {/* Seam light */}
      <ElevatorLight type="seam" activated={activated} />
    </group>
  );
}

export default function ElevatorScene() {
  const [activated, setActivated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Add a loading state handler
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-screen w-full">
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80">
          <div className="text-xl text-white">Loading Elevator...</div>
        </div>
      )}

      <Canvas shadows camera={{ position: [0, 1.5, 4], fov: 60 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <spotLight
            position={[0, 2.5, 1]}
            angle={0.6}
            penumbra={0.6}
            intensity={1.1}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />

          <ElevatorInterior activated={activated} />

          <Environment
            files="https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/hdris/studio_small_08_2k.hdr"
            background={false}
            ground={{ height: 0, radius: 50, scale: 100 }}
          />
          <ContactShadows
            position={[0, -1.25, 0]}
            opacity={0.3}
            scale={10}
            blur={2}
            far={4}
            resolution={256}
          />
        </Suspense>
      </Canvas>

      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={() => setActivated(prev => !prev)}
          className="rounded bg-orange-500 px-4 py-2 text-white shadow transition-colors hover:bg-orange-600">
          {activated ? "Close Doors" : "Call Elevator"}
        </button>
      </div>
    </div>
  );
}
