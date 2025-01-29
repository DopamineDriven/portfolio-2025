"use client";

import { useCallback, useRef, useState } from "react"

interface AnimationState {
  hasTypewriterPlayed: boolean
  // Add other animation states as needed
  hasHeroAnimationPlayed?: boolean
  hasScrollAnimationPlayed?: boolean
}

export const useAnimationState = () => {
  const [animationStates, setAnimationStates] = useState<AnimationState>({
    hasTypewriterPlayed: false,
    hasHeroAnimationPlayed: false,
    hasScrollAnimationPlayed: false,
  })

  // Use refs to track animation status across rerenders
  const animationRefs = useRef({
    typewriter: false,
    hero: false,
    scroll: false,
  })

  const setAnimationComplete = useCallback((animationType: keyof AnimationState) => {
    setAnimationStates((prev) => ({
      ...prev,
      [animationType]: true,
    }))
    // Also update the ref
    if (animationType === "hasTypewriterPlayed") {
      animationRefs.current.typewriter = true
    }
    // Add other animation types as needed
  }, [])

  const resetAnimations = useCallback(() => {
    setAnimationStates({
      hasTypewriterPlayed: false,
      hasHeroAnimationPlayed: false,
      hasScrollAnimationPlayed: false,
    })
    animationRefs.current = {
      typewriter: false,
      hero: false,
      scroll: false,
    }
  }, [])

  return {
    animationStates,
    setAnimationComplete,
    resetAnimations,
    animationRefs: animationRefs.current,
  }
}

