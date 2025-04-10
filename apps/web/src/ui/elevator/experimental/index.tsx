"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ContactShadows,
  PerspectiveCamera,
  useTexture
} from "@react-three/drei";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import Cookies from "js-cookie";
import { animate, useSpring } from "motion/react";
import * as THREE from "three";
import type { ThreeElement } from "@react-three/fiber";
import { useCookies } from "@/context/cookie-context";
import { getCookieDomain } from "@/lib/site-domain";
import { AudioController } from "./audio-controller";
import { CombinedCameraController } from "./combined-camera-controller";
import { ElevatorTransitionEventDetail } from "./custom-event";
import { TriangleGeometry } from "./triangle-geometry";

// Extend the TriangleGeometry so R3F knows about it
extend({ TriangleGeometry });

// Add types to ThreeElements so TypeScript understands triangleGeometry
declare module "@react-three/fiber" {
  interface ThreeElements {
    triangleGeometry: ThreeElement<typeof TriangleGeometry>;
  }
}

type PBRTextureSet = {
  albedo: string;
  ao: string;
  metalness: string;
  normal: string;
  roughness: string;
};

// Texture definitions
const TEXTURES = {
  stuccoWall: {
    albedo:
      "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/smooth-stucco/smooth-stucco-albedo.png",
    ao: "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/smooth-stucco/smooth-stucco-ao.png",
    metalness:
      "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/smooth-stucco/smooth-stucco-Metallic.png",
    normal:
      "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/smooth-stucco/smooth-stucco-Normal-ogl.png",
    roughness:
      "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/textures/smooth-stucco/smooth-stucco-Roughness.png"
  } as const satisfies PBRTextureSet
};

// in ms
const ANIMATION_TIMING = {
  BUTTON_PRESS: 391.813,
  DOOR_OPEN: 1848,
  ELEVATOR_SOUND: 1619.592,
  TRANSITION: 2768.98
};

// Memoized material component
function PBRMaterial({
  textures,
  repeat = [1, 1],
  color = "#ffffff",
  metalness = 0.5,
  roughness = 0.5
}: {
  textures: PBRTextureSet;
  repeat?: [number, number];
  color?: string;
  metalness?: number;
  roughness?: number;
}) {
  // Load all textures in one call for better performance
  const textureProps = useTexture({
    map: textures.albedo,
    aoMap: textures.ao,
    metalnessMap: textures.metalness,
    normalMap: textures.normal,
    roughnessMap: textures.roughness
  });

  // Configure texture properties
  useEffect(() => {
    Object.values(textureProps).forEach(tex => {
      if (tex) {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(...repeat);
        tex.flipY = false;
      }
    });

    // Cleanup function
    return () => {
      Object.values(textureProps).forEach(tex => {
        if (tex) tex.dispose();
      });
    };
  }, [textureProps, repeat]);

  return (
    <meshStandardMaterial
      {...textureProps}
      color={color}
      metalness={metalness}
      roughness={roughness}
    />
  );
}

// Elevator door component
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

// Floor indicator component with triangle
const FloorIndicator = ({ activated }: { activated: boolean }) => {
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

// Call button component with diamond
const CallButton = ({
  activated,
  onClick
}: {
  activated: boolean;
  onClick: () => void;
}) => {
  return (
    <group position={[0.9, 0, 0.1]}>
      <mesh position={[0, 0, 0]} castShadow onClick={onClick}>
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

// Elevator frame component
const ElevatorFrame = () => {
  return (
    <group>
      {/* Outer frame */}
      <mesh position={[0, 0, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 3, 0.1]} />
        <meshStandardMaterial color="#444" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Inner frame */}
      <mesh position={[0, 0, 0.06]} castShadow receiveShadow>
        <boxGeometry args={[1, 2.6, 0.1]} />
        <meshStandardMaterial color="#555" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Top header */}
      <mesh position={[0, 1.4, 0.07]} castShadow receiveShadow>
        <boxGeometry args={[1, 0.2, 0.1]} />
        <meshStandardMaterial color="#444" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
};

// Ceiling light component
const CeilingLight = () => {
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

// Fluorescent light fixture component
const FluorescentLight = ({ intensity = 1 }: { intensity?: number }) => {
  const lightRef = useRef<THREE.MeshStandardMaterial>(null);

  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.emissiveIntensity = intensity;
    }
  }, [intensity]);

  return (
    <group>
      {/* Light fixture frame */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.9, 0.05, 0.4]} />
        <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Light panel */}
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

// Elevator interior component with ceiling light
const ElevatorInterior = ({ activated }: { activated: boolean }) => {
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
      {/* Back wall */}
      <mesh position={[0, 0, -0.05]} receiveShadow>
        <boxGeometry args={[1, 2.5, 0.05]} />
        <meshStandardMaterial color="#777" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Side walls */}
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

      {/* Ceiling with fluorescent light fixture */}
      <group position={[0, 1.25, -0.025]}>
        {/* Ceiling panel */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[1, 0.5]} />
          <meshStandardMaterial color="#666" roughness={0.9} metalness={0.1} />
        </mesh>

        {/* Fluorescent light fixture */}
        <group position={[0, -0.02, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
          <FluorescentLight intensity={lightIntensity.get()} />
        </group>
      </group>

      {/* Floor */}
      <mesh
        position={[0, -1.25, -0.025]}
        rotation={[Math.PI / 2, 0, 0]}
        receiveShadow>
        <planeGeometry args={[1, 0.5]} />
        <meshStandardMaterial color="#333" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Interior lights */}
      <pointLight
        ref={primaryLightRef}
        position={[0, 1.2, 0.1]}
        intensity={0}
        distance={3}
        decay={2}
        color="#f0f0ff" // Slightly blue tint for fluorescent light
      />

      {/* Secondary fill light to better illuminate the interior */}
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

// Baseboard component
const Baseboard = () => {
  return (
    <mesh position={[0, -1.5, 0]} receiveShadow>
      <boxGeometry args={[8, 0.2, 0.3]} />
      <meshStandardMaterial color="#111" metalness={0.3} roughness={0.7} />
    </mesh>
  );
};

// Main wall component
const Wall = () => {
  return (
    <group>
      {/* Main wall */}
      <mesh position={[0, 0, -0.1]} receiveShadow>
        <boxGeometry args={[8, 4, 0.2]} />
        <PBRMaterial
          textures={TEXTURES.stuccoWall}
          repeat={[8, 4]}
          color="#b8b8b8"
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>

      {/* Floor */}
      <mesh
        position={[0, -2, 0.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow>
        <planeGeometry args={[8, 2]} />
        <meshStandardMaterial color="#222" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Baseboard */}
      <Baseboard />
    </group>
  );
};

// Main scene component
function ElevatorScene() {
  const [activated, setActivated] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [_loading, setLoading] = useState(true);
  const audioControllerRef = useRef<AudioController | null>(null);

  // Initialize audio controller
  useEffect(() => {
    audioControllerRef.current = new AudioController();

    return () => {
      if (audioControllerRef.current) {
        audioControllerRef.current.stopAll();
      }
    };
  }, []);

  // Add a loading state handler
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    if (activated || isTransitioning) return;

    // Start the sequence
    setActivated(true);

    // Play audio sequence
    if (audioControllerRef.current) {
      audioControllerRef.current.playSequence();
    }

    // Start transition after door open and elevator sounds
    const transitionDelay =
      ANIMATION_TIMING.BUTTON_PRESS +
      ANIMATION_TIMING.DOOR_OPEN +
      ANIMATION_TIMING.ELEVATOR_SOUND;

    setTimeout(() => {
      setIsTransitioning(true);

      // Animate transition progress
      const startTime = Date.now();
      const duration = ANIMATION_TIMING.TRANSITION;

      const updateTransition = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        setTransitionProgress(progress);

        if (progress < 1) {
          requestAnimationFrame(updateTransition);
        } else {
          // Reset after transition completes
          setTimeout(() => {
            setActivated(false);
            setIsTransitioning(false);
            setTransitionProgress(0);
          }, 1000);
        }
      };

      requestAnimationFrame(updateTransition);
    }, transitionDelay);
  };

  return (
    <group>
      <Wall />
      <ElevatorFrame />
      <FloorIndicator activated={activated} />
      <CallButton activated={activated} onClick={handleClick} />

      {/* Elevator doors */}
      <ElevatorDoor position={0} isLeft={true} activated={activated} />
      <ElevatorDoor position={0} isLeft={false} activated={activated} />

      {/* Interior visible when doors open */}
      <ElevatorInterior activated={activated} />

      {/* Ceiling lights */}
      <CeilingLight />

      {/* Camera controller */}
      <CombinedCameraController
        isTransitioning={isTransitioning}
        transitionProgress={transitionProgress}
      />

      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.2} />
    </group>
  );
}

// Main component
export default function ElevatorApp() {
  const [loading, setLoading] = useState(true);
  const [fadeOpacity, setFadeOpacity] = useState(0);
  const { pathOfIntent, clearPathOfIntent } = useCookies();
  const pathOfIntentRef = useRef<string>("/");
  const memoizedCookieDomain = useMemo(() => getCookieDomain(), []);
  const isSecure = useMemo(() => process.env.NODE_ENV !== "development", []);
  const navigationTriggeredRef = useRef(false);

  useEffect(() => {
    if (pathOfIntent) {
      pathOfIntentRef.current = pathOfIntent;
      console.log("[CLIENT] Path of intent from context:", pathOfIntent);
    } else {
      // Fallback: Try to read directly from cookies if context doesn't have it
      const poiCookie = Cookies.get("poi");
      if (poiCookie) {
        pathOfIntentRef.current = poiCookie;
      }
    }
  }, [pathOfIntent]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  const router = useRouter();

  // Listen for transition events from the scene
  useEffect(() => {
    const handleTransition = (
      e: CustomEvent<ElevatorTransitionEventDetail>
    ) => {
      setFadeOpacity(e.detail.progress);
      if (e.detail.progress >= 0.95 && !navigationTriggeredRef.current) {
        navigationTriggeredRef.current = true;

        // Set the has-visited cookie
        Cookies.set("has-visited", "true", {
          path: "/",
          sameSite: "lax",
          secure: isSecure,
          domain: memoizedCookieDomain
        });
        const destination = pathOfIntentRef.current ?? "/";
        if (clearPathOfIntent) {
          clearPathOfIntent();
        }
        setTimeout(() => {
          console.log("[CLIENT] router.push event to: ", destination);
          router.push(decodeURIComponent(destination));
          router.refresh();
        }, 1000);
      }
    };

    window.addEventListener(
      "elevator-transition",
      handleTransition as EventListener
    );

    return () => {
      window.removeEventListener(
        "elevator-transition",
        handleTransition as EventListener
      );
    };
  }, [isSecure, memoizedCookieDomain, router, clearPathOfIntent]);
  return (
    <>
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80">
          <div className="text-xl text-white">Loading Elevator...</div>
        </div>
      )}

      {/* Fade overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 bg-black transition-opacity duration-500"
        style={{ opacity: fadeOpacity }}
      />

      <Canvas
        className="absolute left-0 min-h-[100dvh] min-w-screen top-0 z-20 items-center justify-center bg-black/80"
        shadows
        camera={{ fov: 60, near: 0.1, far: 1000, position: [0, 1.6, 5] }}>
        <Suspense fallback={null}>
          <PerspectiveCamera
            makeDefault
            position={[0, 0, 6]}
            fov={30}
            near={0.1}
            far={100}
          />
          <ElevatorScene />
          <ContactShadows
            position={[0, -2, 0]}
            opacity={0.5}
            scale={10}
            blur={2}
            far={4}
            resolution={256}
          />
        </Suspense>
      </Canvas>
    </>
  );
}
// // Camera controller for smooth transitions
// const CameraController = ({
//   isTransitioning,
//   transitionProgress,
//   defaultZ
// }: {
//   isTransitioning: boolean;
//   transitionProgress: number;
//   defaultZ: number;
// }) => {
//   const { camera } = useThree();

//   const cameraRef = useRef<
//     | ((THREE.OrthographicCamera | THREE.PerspectiveCamera) & {
//         manual?: boolean;
//       })
//     | null
//   >(null);
//   const initialPosition = useMemo(
//     () => new THREE.Vector3(0, 0, defaultZ),
//     [defaultZ]
//   );

//   // Similarly, derive the target position relative to defaultZ.
//   // For example, you might want to move the camera slightly closer.
//   const targetPosition = useMemo(
//     () => new THREE.Vector3(0, 0, defaultZ - 1.5),
//     [defaultZ]
//   );
//   // Store camera reference on first render
//   useEffect(() => {
//     cameraRef.current = camera;
//   }, [camera]);
//   // Initial camera position

//   useFrame(() => {
//     if (!cameraRef.current) return;
//     if (isTransitioning) {
//       // Interpolate camera position
//       cameraRef.current.position.lerpVectors(
//         initialPosition,
//         targetPosition,
//         transitionProgress
//       );

//       // Check if camera is a PerspectiveCamera before adjusting FOV
//       if (cameraRef.current instanceof THREE.PerspectiveCamera) {
//         // Slightly adjust FOV for a subtle zoom effect
//         cameraRef.current.fov = 30 - transitionProgress * 2;
//         cameraRef.current.updateProjectionMatrix();
//       }
//       // Dispatch transition progress event for fade effect
//       dispatchElevatorTransition(transitionProgress);
//     } else {
//       // Reset camera
//       cameraRef.current.position.copy(initialPosition);

//       // Check if camera is a PerspectiveCamera before resetting FOV
//       if (cameraRef.current instanceof THREE.PerspectiveCamera) {
//         cameraRef.current.fov = 30;
//         cameraRef.current.updateProjectionMatrix();
//       }
//       // Reset transition progress
//       dispatchElevatorTransition(0);
//     }
//   });

//   return null;
// };
