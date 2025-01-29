"use client";

import type React from "react";
import { createContext, useContext } from "react";
import type { AnimationState } from "@/hooks/use-animation-state";
import { useAnimationState } from "@/hooks/use-animation-state";

export interface AnimationContextType {
  animationStates: {
    hasTypewriterPlayed: boolean;
    hasHeroAnimationPlayed?: boolean;
    hasScrollAnimationPlayed?: boolean;
  };
  setAnimationComplete: (animationType: keyof AnimationState) => void;
  resetAnimations: () => void;
  resetTypewriterAnimation: () => void;
  animationRefs: {
    typewriter: boolean;
    hero: boolean;
    scroll: boolean;
  };
}

const AnimationContext = createContext<AnimationContextType | undefined>(
  undefined
);

export const useAnimationContext = () => {
  const context = useContext(AnimationContext);
  if (typeof context === "undefined") {
    throw new Error(
      "useAnimationContext must be used within an AnimationContextProvider"
    );
  }
  return context;
};

export const AnimationContextProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const animationState = useAnimationState();

  return (
    <AnimationContext.Provider value={animationState}>
      {children}
    </AnimationContext.Provider>
  );
};
