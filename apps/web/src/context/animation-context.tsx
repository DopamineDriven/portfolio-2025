"use client";

import type React from "react";
import { createContext, useContext } from "react";
import { useAnimationState } from "@/hooks/use-animation-state";

interface AnimationContextType {
  animationStates: {
    hasTypewriterPlayed: boolean;
    hasHeroAnimationPlayed?: boolean;
    hasScrollAnimationPlayed?: boolean;
  };
  setAnimationComplete: (animationType: string) => void;
  resetAnimations: () => void;
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
