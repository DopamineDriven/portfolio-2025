"use client";

import { useEffect, useRef, useState } from "react";
import { AudioController } from "@/ui/elevator/r3f/audio-controller";
import { CeilingLight } from "@/ui/elevator/r3f/ceiling-light";
import { CombinedCameraController } from "@/ui/elevator/r3f/combined-camera-controller";
import { ANIMATION_TIMING } from "@/ui/elevator/r3f/constants";
import { ElevatorButton } from "@/ui/elevator/r3f/elevator-button";
import { ElevatorDoor } from "@/ui/elevator/r3f/elevator-door";
import { ElevatorFrame } from "@/ui/elevator/r3f/elevator-frame";
import { ElevatorInterior } from "@/ui/elevator/r3f/elevator-interior";
import { FloorIndicator } from "@/ui/elevator/r3f/floor-indicator";
import { Wall } from "@/ui/elevator/r3f/wall";
import { SoftWallLight } from "../soft-wall-light";

export function ElevatorScene() {
  const [activated, setActivated] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [_loading, setLoading] = useState(true);
  const audioControllerRef = useRef<AudioController | null>(null);

  // audio controller init
  useEffect(() => {
    audioControllerRef.current = new AudioController();

    return () => {
      if (audioControllerRef.current) {
        audioControllerRef.current.stopAll();
      }
    };
  }, []);

  // loading state handler
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    if (activated || isTransitioning) return;

    // start sequence
    setActivated(true);

    // play sequence
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

      // transition progress
      const startTime = Date.now();
      const duration = ANIMATION_TIMING.TRANSITION;

      const updateTransition = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        setTransitionProgress(progress);

        if (progress < 1) {
          requestAnimationFrame(updateTransition);
        } else {
          // reset on transition completion
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
    <group position={[0, -0.5, 0]}>
      <Wall />
      <ElevatorFrame />
      <ElevatorDoor position={0} isLeft={true} activated={activated} />
      <ElevatorDoor position={0} isLeft={false} activated={activated} />
      <ElevatorInterior activated={activated} />
      <FloorIndicator activated={activated} />
      <ElevatorButton activated={activated} onClickAction={handleClick} />
      <CeilingLight />
      <pointLight
        position={[2, 1, 3]}
        intensity={0.7}
        distance={7}
        decay={2}
        color="#ffffff"
      />
      <pointLight
        position={[-2, 1, 3]}
        intensity={0.7}
        distance={7}
        decay={2}
        color="#ffffff"
      />
      <ambientLight intensity={0.7} color="#1e222c" />
      <pointLight
        position={[2, 1, 3]}
        intensity={0.7}
        distance={7}
        decay={2}
        color="#ffffff"
        castShadow={false}
      />
      <pointLight
        position={[-2, 1, 3]}
        intensity={0.7}
        distance={7}
        decay={2}
        color="#ffffff"
        castShadow={false}
      />
      <spotLight
        position={[0, 2, -2.5]}
        angle={0.5}
        intensity={0.5}
        penumbra={0.3}
        color="#eeeeee"
        castShadow={false}
      />
      <SoftWallLight />
      <CombinedCameraController
        isTransitioning={isTransitioning}
        transitionProgress={transitionProgress}
      />
    </group>
  );
}
