"use client";

import { useMobile } from "@/hooks/use-mobile";
import { dispatchElevatorTransition } from "@/ui/elevator/r3f/custom-event";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export function CombinedCameraController({
  isTransitioning,
  transitionProgress
}: {
  isTransitioning: boolean;
  transitionProgress: number;
}) {
  const { size, camera: defaultCamera } = useThree();
  const isMobile = useMobile();

  const [defaultZ, setDefaultZ] = useState(5);
  const [_cameraReady, setCameraReady] = useState(false);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // ✅ useCallback for safe, dynamic ref assignment
  const assignCamera = useCallback((cam: THREE.Camera | null) => {
    if (cam && cam instanceof THREE.PerspectiveCamera) {
      cameraRef.current = cam;
      setCameraReady(true);
    }
  }, []);

  useLayoutEffect(() => {
    if (!cameraRef.current) return;

    const aspect = size.width / size.height;
    let newZ = 5;
    let newY = 0;
    let newFov = 30;

    if (isMobile) {
      if (aspect < 0.6) {
        newZ = 7;
        newY = 0.2;
        newFov = 35;
      } else if (aspect < 1) {
        newZ = 6.5;
        newY = 0.2;
        newFov = 33;
      } else {
        newZ = 5.5;
        newFov = 40;
      }
    } else {
      if (aspect < 1) {
        newZ = 6;
        newY = 0.2;
        newFov = 35;
      } else if (aspect < 1.6) {
        newZ = 5.5;
        newFov = 38;
      } else {
        newZ = 5;
        newFov = 42;
      }
    }

    const cam = cameraRef.current;
    cam.position.z = newZ;
    cam.position.y = newY;
    cam.fov = newFov;
    cam.aspect = aspect;
    cam.updateProjectionMatrix();
    setDefaultZ(newZ);
  }, [size, isMobile]);

  // ✅ Now safe to use in memo
  const initialPosition = useCallback(() => {
    return new THREE.Vector3(0, cameraRef.current?.position.y ?? 0, defaultZ);
  }, [defaultZ]);

  const targetPosition = useCallback(() => {
    return new THREE.Vector3(0, cameraRef.current?.position.y ?? 0, defaultZ - 1.5);
  }, [defaultZ]);

  useFrame(() => {
    const cam = cameraRef.current;
    if (!cam) return;

    if (isTransitioning) {
      cam.position.lerpVectors(initialPosition(), targetPosition(), transitionProgress);
      cam.fov = cam.fov - transitionProgress * 2;
      cam.updateProjectionMatrix();
      dispatchElevatorTransition(transitionProgress);
    } else {
      cam.position.copy(initialPosition());
      cam.updateProjectionMatrix();
      dispatchElevatorTransition(0);
    }
  });

  return (
    <primitive object={defaultCamera} ref={assignCamera} />
  );
}
