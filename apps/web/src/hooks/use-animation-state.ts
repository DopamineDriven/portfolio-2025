"use client";

import { useCallback, useRef, useState } from "react";

export type InferAnimationStateKeys<T> =
  T extends `has${infer U}AnimationPlayed`
    ? Lowercase<U>
    : T extends `has${infer U}Played`
      ? Lowercase<U>
      : T;

export interface AnimationState {
  hasTypewriterPlayed: boolean;
  hasHeroAnimationPlayed?: boolean;
  hasScrollAnimationPlayed?: boolean;
  hasLoadingAnimationPlayed: boolean;
}

export const useAnimationState = () => {
  const [animationStates, setAnimationStates] = useState<AnimationState>({
    hasTypewriterPlayed: false,
    hasHeroAnimationPlayed: false,
    hasScrollAnimationPlayed: false,
    hasLoadingAnimationPlayed: false
  });

  // Use refs to track animation status across rerenders
  const animationRefs = useRef({
    typewriter: false,
    hero: false,
    scroll: false,
    loading: false
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
      if (animationType === "hasLoadingAnimationPlayed") {
        animationRefs.current.loading = true;
      }
      // Add other animation types as needed
    },
    []
  );

  const resetAnimations = useCallback(() => {
    setAnimationStates({
      hasTypewriterPlayed: false,
      hasHeroAnimationPlayed: false,
      hasScrollAnimationPlayed: false,
      hasLoadingAnimationPlayed: false
    });
    animationRefs.current = {
      typewriter: false,
      hero: false,
      scroll: false,
      loading: false
    };
  }, []);

  const resetTypewriterAnimation = useCallback(() => {
    setAnimationStates(prev => ({
      ...prev,
      hasTypewriterPlayed: false
    }));
    animationRefs.current.typewriter = false;
  }, []);

  const resetLoadingAnimation = useCallback(() => {
    setAnimationStates(prev => ({
      ...prev,
      hasLoadingAnimationPlayed: false
    }));
    animationRefs.current.loading = false;
  }, []);

  return {
    animationStates,
    setAnimationComplete,
    resetAnimations,
    resetTypewriterAnimation,
    resetLoadingAnimation,
    animationRefs: animationRefs
  };
};
