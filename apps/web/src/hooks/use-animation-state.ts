"use client";

import { useCallback, useRef, useState } from "react";

export interface AnimationState {
  hasTypewriterPlayed: boolean;
  hasHeroAnimationPlayed?: boolean;
  hasScrollAnimationPlayed?: boolean;
}

export const useAnimationState = () => {
  const [animationStates, setAnimationStates] = useState<AnimationState>({
    hasTypewriterPlayed: false,
    hasHeroAnimationPlayed: false,
    hasScrollAnimationPlayed: false
  });

  // Use refs to track animation status across rerenders
  const animationRefs = useRef({
    typewriter: false,
    hero: false,
    scroll: false
  });

  const setAnimationComplete = useCallback(
    (animationType: keyof AnimationState) => {
      setAnimationStates(prev => ({
        ...prev,
        [animationType]: true
      }));
      // Also update the ref
      if (animationType === "hasTypewriterPlayed") {
        animationRefs.current.typewriter = true;
      }
      // Add other animation types as needed
    },
    []
  );

  const resetAnimations = useCallback(() => {
    setAnimationStates({
      hasTypewriterPlayed: false,
      hasHeroAnimationPlayed: false,
      hasScrollAnimationPlayed: false
    });
    animationRefs.current = {
      typewriter: false,
      hero: false,
      scroll: false
    };
  }, []);

  const resetTypewriterAnimation = useCallback(() => {
    setAnimationStates(prev => ({
      ...prev,
      hasTypewriterPlayed: false
    }));
    animationRefs.current.typewriter = false;
  }, []);

  return {
    animationStates,
    setAnimationComplete,
    resetAnimations,
    resetTypewriterAnimation,
    animationRefs: animationRefs.current
  };
};
