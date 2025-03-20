"use client";

import type { UseInViewOptions } from "motion/react";
import type { CSSProperties } from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import { AnimatePresence, useInView } from "motion/react";
import type { GentleTextProps } from "@/types/gentle-text";
import { useGentleTextEffect } from "@/hooks/use-gentle-text-effect";
import { useResizeObserver } from "@/hooks/use-resize-observer";

/**
 * creates a soft, subtle text animation
 */
export default function GentleText({
  content,
  containerClassName,
  textClassName,
  as: Tag = "p",
  containerStyles,
  textStyles,
  initialElement,
  keyframes,
  animateTarget = "chars",
  maxWidth = "full",
  debug = false,
  duration = 1,
  staggerDelay = 0.04,
  yOffset = 10,
  initialScale = 0.9,
  blurAmount = 4,
  autoPlay = true,
  allowOverflow = false,
  animationOptions,
  animateOnlyInView = false,
  inViewThreshold = 0.5,
  inViewMargin = "0px",
  onAnimationStart,
  onAnimationComplete
}: GentleTextProps) {
  const containerClassNameMemo = useMemo(
    () => containerClassName,
    [containerClassName]
  );
  const textClassNameMemo = useMemo(() => textClassName, [textClassName]);

  const [containerElement, setContainerElement] =
    useState<HTMLDivElement | null>(null);
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    setContainerElement(node);
  }, []);

  const { width: containerWidth } = useResizeObserver({
    current: containerElement
  });

  const elementRef = useRef<HTMLElement | null>(null);
  const textRef = useCallback(
    (node: HTMLElement | null) => {
      if (node && !initialElement) {
        elementRef.current = node;
      }
    },
    [initialElement]
  );

  // Use inView hook to detect when the element is in the viewport
  const inViewRef = useRef<HTMLDivElement | null>(null);

  const isInView = useInView(inViewRef, {
    amount: inViewThreshold,
    margin: inViewMargin,
    once: !(animationOptions?.repeat ?? 0) // Only trigger once if not repeating
  } satisfies UseInViewOptions);

  // Determine if we should animate based on inView status
  const shouldAnimate = useMemo(
    () => (animateOnlyInView ? isInView : true),
    [animateOnlyInView, isInView]
  );

  const {
    playAnimation,
    isPlaying,
    hasPlayed,
    resetAnimation,
    pauseAnimation,
    resumeAnimation,
    stopAnimation,
    getAnimationControls: _getAnimationControls
  } = useGentleTextEffect({
    elementRef,
    animateTarget,
    duration,
    staggerDelay,
    yOffset,
    initialScale,
    blurAmount,
    autoPlay,
    animationOptions,
    keyframes,
    inView: shouldAnimate,
    onAnimationStart,
    onAnimationComplete
  });

  // Handle manual replay
  const handleReplay = useCallback(() => {
    if (!isPlaying) {
      resetAnimation();
      setTimeout(() => {
        playAnimation();
      }, 10); // Small delay to ensure state updates
    }
  }, [isPlaying, resetAnimation, playAnimation]);

  // Handle pause/resume
  const handlePauseResume = useCallback(() => {
    if (isPlaying) {
      pauseAnimation();
    } else {
      resumeAnimation();
    }
  }, [isPlaying, pauseAnimation, resumeAnimation]);

  const memoizedContainerStyles = useMemo(
    () =>
      ({
        display: containerStyles?.display ?? "flex",
        position: containerStyles?.position ?? "relative",
        flexDirection: containerStyles?.flexDirection ?? "column",
        rowGap: containerStyles?.rowGap ?? "0.5rem",
        justifyContent: "center",
        alignItems: containerStyles?.alignItems ?? "start",
        overflow: allowOverflow ? "visible" : "hidden",
        width: containerStyles?.width ?? "100%",
        maxWidth:
          containerStyles?.maxWidth ??
          (maxWidth === "fit"
            ? "fit-content"
            : maxWidth === "full"
              ? "100%"
              : `${maxWidth}`),
        textAlign: containerStyles?.textAlign ?? "left",
        ...(containerStyles ?? {})
      }) satisfies CSSProperties,
    [containerStyles, maxWidth, allowOverflow]
  );

  const memoizedTextStyles = useMemo(
    () =>
      ({
        lineHeight: textStyles?.lineHeight ?? 1.2,
        letterSpacing: textStyles?.letterSpacing ?? "-0.01em",
        willChange: textStyles?.willChange ?? "transform, opacity, filter",
        ...(textStyles ?? {})
      }) satisfies CSSProperties,
    [textStyles]
  );

  return (
    <div
      className={containerClassNameMemo}
      ref={node => {
        // combine
        containerRef(node);
        if (inViewRef) {
          inViewRef.current = node;
        }
      }}
      style={memoizedContainerStyles}>
      <AnimatePresence>
        <Tag
          ref={textRef}
          className={textClassNameMemo}
          style={memoizedTextStyles}
          onClick={handleReplay}>
          {content}
        </Tag>
      </AnimatePresence>

      {debug && (
        <div
          className="debug-gentle"
          style={{
            borderRadius: "0.25rem",
            paddingInline: "0.25rem",
            maxWidth: "",
            marginTop: "0.5rem",
            fontSize: "0.75rem",
            lineHeight: 1.3333,
            letterSpacing: "-0.04em",
            position: "relative",
            backgroundColor: "oklch(0% 0 0 / 50%)",
            color: "oklch(70.7% 0.022 261.325)"
          }}>
          Width: {containerWidth.toFixed(0)}px |
          {isInView ? " In view" : " Not in view"} |
          {hasPlayed ? " Has played" : " Not played"} |
          {isPlaying ? " Playing" : " Not playing"} |
          <button onClick={handleReplay} className="ml-1 underline">
            Replay
          </button>
          <button onClick={handlePauseResume} className="ml-1 underline">
            {isPlaying ? "Pause" : "Resume"}
          </button>
          <button onClick={stopAnimation} className="ml-1 underline">
            Stop
          </button>
        </div>
      )}
    </div>
  );
}

GentleText.displayName = "GentleText";
