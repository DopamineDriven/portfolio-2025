"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { Size } from "@react-three/fiber";
import { useMobile } from "@/hooks/use-mobile";
import { dispatchElevatorTransition } from "@/ui/elevator/r3f/custom-event";

export function CombinedCameraController({
  isTransitioning,
  transitionProgress
}: {
  isTransitioning: boolean;
  transitionProgress: number;
}) {
  const { size, camera } = useThree();
  const isMobile = useMobile();
  const [defaultZ, setDefaultZ] = useState(5);
  const cameraRef = useRef<
    | ((THREE.OrthographicCamera | THREE.PerspectiveCamera) & {
        manual?: boolean;
      })
    | null
  >(null);
  const sizeRef = useRef<Size | null>(null);

  useEffect(() => {
    cameraRef.current = camera;
    sizeRef.current = size;
  }, [camera, size]);

  useLayoutEffect(() => {
    if (!cameraRef.current || !sizeRef.current) return;
    if (!(cameraRef.current instanceof THREE.PerspectiveCamera)) return;
    const aspect = sizeRef.current.width / sizeRef.current.height;
    let newZ: number;

    if (isMobile) {
      // Mobile logic as before
      if (aspect < 0.6)
        newZ = 6.5; // extremely narrow
      else if (aspect < 1) newZ = 5.5;
      else newZ = 5; // e.g., phone in landscape
    } else {
      // Desktop logic (pull back more if aspect is wide, for instance)
      // You can experiment with these numbers
      if (aspect < 1) {
        // e.g. small laptop or near square
        newZ = 5.5;
      } else if (aspect < 1.6) {
        // typical ~16:10 screen
        newZ = 4.5;
      } else {
        // super widescreen or very large monitors
        newZ = 4;
      }
    }
    setDefaultZ(newZ);
    cameraRef.current.position.z = newZ;
    cameraRef.current.aspect = aspect;
    cameraRef.current.updateProjectionMatrix();
  }, [size, camera, isMobile]);

  const initialPosition = useMemo(
    () => new THREE.Vector3(0, 0, defaultZ),
    [defaultZ]
  );
  const targetPosition = useMemo(
    () => new THREE.Vector3(0, 0, defaultZ - 1.5),
    [defaultZ]
  );

  useFrame(() => {
    if (!cameraRef.current) return;
    if (isTransitioning) {
      cameraRef.current.position.lerpVectors(
        initialPosition,
        targetPosition,
        transitionProgress
      );
      if (cameraRef.current instanceof THREE.PerspectiveCamera) {
        cameraRef.current.fov = 30 - transitionProgress * 2;
        cameraRef.current.updateProjectionMatrix();
      }
      dispatchElevatorTransition(transitionProgress);
    } else {
      cameraRef.current.position.copy(initialPosition);
      if (cameraRef.current instanceof THREE.PerspectiveCamera) {
        cameraRef.current.fov = 30;
        cameraRef.current.updateProjectionMatrix();
      }
      dispatchElevatorTransition(0);
    }
  });

  return null;
}
