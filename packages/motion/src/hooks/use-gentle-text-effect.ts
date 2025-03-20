"use client";

import type {
  AnimationOptions,
  AnimationPlaybackControls,
  AnimationPlaybackControlsWithFinished,
  DOMKeyframesDefinition
} from "motion-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { animate, stagger } from "motion";
import { splitText } from "motion-plus";
import type { UseGentleTextEffect } from "@/types/hooks";
/**
 * Custom hook to handle the gentle text animation effect
 */
export function useGentleTextEffect({
  elementRef,
  animateTarget = "chars",
  duration = 1,
  staggerDelay = 0.04,
  yOffset = 10,
  initialScale = 0.9,
  blurAmount = 4,
  autoPlay = true,
  animationOptions,
  keyframes,
  inView = true,
  onAnimationStart,
  onAnimationComplete
}: UseGentleTextEffect) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const animationRef = useRef<
    AnimationPlaybackControls | AnimationPlaybackControlsWithFinished | null
  >(null);
  const splitTextRef = useRef<{
    readonly chars: HTMLSpanElement[];
    readonly words: HTMLSpanElement[];
    readonly lines: HTMLSpanElement[];
  } | null>(null);

  // Split text when element is available
  useEffect(() => {
    if (elementRef.current) {
      splitTextRef.current = splitText(elementRef.current);
      setIsReady(true);
    }
  }, [elementRef]);

  // Clean up any ongoing animations when component unmounts
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, []);

  // Create merged keyframes with defaults and custom keyframes
  const getMergedKeyframes = useCallback(() => {
    // Default gentle animation keyframes
    const defaultKeyframes = {
      opacity: [0, 1],
      y: [yOffset, 0],
      scale: [initialScale, 1],
      filter: [`blur(${blurAmount}px)`, "blur(0px)"]
    } satisfies DOMKeyframesDefinition;

    // If custom keyframes are provided, merge them with defaults
    if (keyframes) {
      return {
        opacity: keyframes?.opacity ?? [0, 1],
        y: keyframes?.y ?? [yOffset, 0],
        scale: keyframes?.scale ?? [initialScale, 1],
        filter: keyframes?.filter ?? [`blur(${blurAmount}px)`, "blur(0px)"],
        ...keyframes
      } satisfies DOMKeyframesDefinition;
    }

    return defaultKeyframes satisfies DOMKeyframesDefinition;
  }, [keyframes, yOffset, initialScale, blurAmount]);

  const getMergedAnimationOptions = useCallback(() => {
    const defaultAnimateOptions = {
      duration,
      delay: stagger(staggerDelay),
      ease: "easeOut",
      onComplete: () => {
        setIsPlaying(false);
        setHasPlayed(true);
        onAnimationComplete?.();
      }
    } satisfies AnimationOptions;

    if (animationOptions) {
      return {
        duration: animationOptions?.duration ?? duration,
        delay: animationOptions?.delay
          ? typeof animationOptions.delay === "number"
            ? stagger(animationOptions.delay)
            : animationOptions.delay
          : stagger(staggerDelay),
        ease: animationOptions?.ease ?? "easeOut",
        ...animationOptions,
        onComplete: () => {
          setIsPlaying(false);
          setHasPlayed(true);
          onAnimationComplete?.();
          // Call the original onComplete if provided
          animationOptions?.onComplete?.();
        }
      } satisfies AnimationOptions;
    } else return defaultAnimateOptions;
  }, [animationOptions, duration, onAnimationComplete, staggerDelay]);

  // Play animation function
  const playAnimation = useCallback(() => {
    if (
      !elementRef.current ||
      !splitTextRef.current ||
      isPlaying ||
      (hasPlayed && !(animationOptions?.repeat ?? 0))
    )
      return;

    // Stop any existing animation
    if (animationRef.current) {
      animationRef.current.stop();
    }

    setIsPlaying(true);
    onAnimationStart?.();

    const textElements = splitTextRef.current[animateTarget];

    // Reset any previous animations
    animate(
      textElements,
      {
        opacity: 0,
        y: yOffset,
        scale: initialScale,
        filter: `blur(${blurAmount}px)`
      },
      { duration: 0 }
    );

    // Get merged keyframes
    const mergedKeyframes = getMergedKeyframes();

    // Merge animation options
    const mergedAnimationOptions = getMergedAnimationOptions();

    // Animate with gentle effect
    const animation = animate(
      textElements,
      mergedKeyframes,
      mergedAnimationOptions
    );

    // Store the animation controls
    animationRef.current = animation;

    return animation;
  }, [
    elementRef,
    animateTarget,
    yOffset,
    getMergedAnimationOptions,
    initialScale,
    blurAmount,
    isPlaying,
    hasPlayed,
    animationOptions,
    getMergedKeyframes,
    onAnimationStart
  ]);

  // Reset animation state
  const resetAnimation = useCallback(() => {
    setHasPlayed(false);
    setIsPlaying(false);
  }, []);

  // Get current animation controls
  const getAnimationControls = useCallback(() => {
    return animationRef.current;
  }, []);

  // Auto-play animation on mount if enabled and in view
  useEffect(() => {
    if (isReady && autoPlay && inView && !hasPlayed) {
      playAnimation();
    }
  }, [isReady, autoPlay, inView, hasPlayed, playAnimation]);

  return {
    playAnimation,
    isPlaying,
    isReady,
    hasPlayed,
    resetAnimation,
    getAnimationControls,
    pauseAnimation: () => animationRef.current?.pause(),
    resumeAnimation: () => animationRef.current?.play(),
    stopAnimation: () => animationRef.current?.stop(),
    completeAnimation: () => animationRef.current?.complete(),
    cancelAnimation: () => animationRef.current?.cancel()
  };
}
