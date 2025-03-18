"use client";

import type {
  AnimationOptions,
  DOMKeyframesDefinition,
  ElementOrSelector
} from "motion-dom";
import type React from "react";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import cn from "clsx";
import { animate, stagger } from "motion";
import { splitText } from "motion-plus";
import { AnimatePresence, useInView } from "motion/react";
import type { CSSWidthValue } from "@/types/helpers";
import { useResizeObserver } from "@/hooks/use-resize-observer";

type MarginValue = `${number}${"px" | "%"}`;
type MarginType =
  | MarginValue
  | `${MarginValue} ${MarginValue}`
  | `${MarginValue} ${MarginValue} ${MarginValue}`
  | `${MarginValue} ${MarginValue} ${MarginValue} ${MarginValue}`;
/**
 * GentleText component props
 */
export type GentleTextProps = {
  /** Text content to animate */
  content: string;
  /** Optional container className */
  containerClassName?: string;
  /** Optional text element className */
  textClassName?: string;
  /** HTML tag to be used for the text element */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  /** Optional container styles */
  containerStyles?: CSSProperties;
  /** Optional text styles */
  textStyles?: CSSProperties;
  /** Optional initial element or selector for splitText */
  initialElement?: ElementOrSelector;
  /** Animation keyframes */
  keyframes?: DOMKeyframesDefinition;
  /** Animation target */
  animateTarget?: "words" | "chars" | "lines";
  /** Max width of the container */
  maxWidth?: CSSWidthValue;
  /** Enable debug mode */
  debug?: boolean;
  /** Animation duration in seconds */
  duration?: number;
  /** Animation stagger delay in seconds */
  staggerDelay?: number;
  /** Initial y offset in pixels */
  yOffset?: number;
  /** Initial scale value */
  initialScale?: number;
  /** Initial blur amount in pixels */
  blurAmount?: number;
  /** Auto-play animation on mount */
  autoPlay?: boolean;
  /** Allow overflow */
  allowOverflow?: boolean;
  /** Animation options for the motion library */
  animationOptions?: Omit<AnimationOptions, "duration" | "delay">;
  /** Only animate when in view */
  animateOnlyInView?: boolean;
  /** Amount of element that needs to be in view before animating (0-1) */
  inViewThreshold?: number;
  /** Margin around the element for inView detection */
  inViewMargin?: MarginType;
};

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
  inView = true
}: {
  elementRef: React.RefObject<HTMLElement | null>;
  animateTarget?: "words" | "chars" | "lines";
  duration?: number;
  staggerDelay?: number;
  yOffset?: number;
  initialScale?: number;
  blurAmount?: number;
  autoPlay?: boolean;
  animationOptions?: AnimationOptions;
  keyframes?: DOMKeyframesDefinition;
  inView?: boolean;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const animationRef = useRef<{ stop: () => void } | null>(null);
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
        opacity: keyframes.opacity ?? [0, 1],
        y: keyframes.y ?? [yOffset, 0],
        scale: keyframes.scale ?? [initialScale, 1],
        filter: keyframes.filter ?? [`blur(${blurAmount}px)`, "blur(0px)"],
        ...keyframes
      } satisfies DOMKeyframesDefinition;
    }

    return defaultKeyframes;
  }, [keyframes, yOffset, initialScale, blurAmount]);

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
    const mergedKeyframes = getMergedKeyframes();
    // Merge animation options
    const mergedOptions: AnimationOptions = {
      duration,
      delay: stagger(staggerDelay),
      ease: "easeOut",
      ...animationOptions,
      onComplete: () => {
        setIsPlaying(false);
        setHasPlayed(true);
        // Call the original onComplete if provided
        animationOptions?.onComplete?.();
      }
    };

    // Animate with gentle effect
    const animation = animate(textElements, mergedKeyframes, mergedOptions);

    animationRef.current = animation;

    return animation;
  }, [
    elementRef,
    animateTarget,
    duration,
    staggerDelay,
    yOffset,
    initialScale,
    blurAmount,
    getMergedKeyframes,
    isPlaying,
    hasPlayed,
    animationOptions
  ]);

  // Reset animation state
  const resetAnimation = useCallback(() => {
    setHasPlayed(false);
    setIsPlaying(false);
  }, []);

  // Auto-play animation on mount if enabled and in view
  useEffect(() => {
    if (isReady && autoPlay && inView && !hasPlayed) {
      playAnimation();
    }
  }, [isReady, autoPlay, inView, hasPlayed, playAnimation]);

  return { playAnimation, isPlaying, isReady, hasPlayed, resetAnimation };
}

/**
 * GentleText component - creates a soft, subtle text animation
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
  maxWidth = "auto",
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
  inViewMargin = "0px"
}: GentleTextProps) {
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
  });

  // Determine if we should animate based on inView status
  const shouldAnimate = animateOnlyInView ? isInView : true;

  const { playAnimation, isPlaying, hasPlayed, resetAnimation } =
    useGentleTextEffect({
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
      inView: shouldAnimate
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

  const memoizedContainerStyles = useMemo(
    () =>
      ({
        display: "flex",
        position: "relative",
        flexDirection: "column",
        rowGap: "0.5rem",
        justifyContent: "center",
        alignItems: containerStyles?.alignItems ?? "center",
        overflow: allowOverflow ? "visible" : "hidden",
        width: containerStyles?.width ?? "100%",
        maxWidth:
          maxWidth === "auto"
            ? "auto"
            : maxWidth === "fit"
              ? "fit"
              : maxWidth === "full"
                ? "full"
                : maxWidth === "none"
                  ? "none"
                  : `${maxWidth}`,
        textAlign: "left",
        ...(containerStyles ?? {})
      }) satisfies CSSProperties,
    [containerStyles, maxWidth, allowOverflow]
  );

  const memoizedTextStyles = useMemo(
    () => ({
      lineHeight: 1.2,
      letterSpacing: "-0.01em",
      willChange: "transform, opacity, filter",
      ...(textStyles ?? {})
    }),
    [textStyles]
  );

  return (
    <div
      className={cn("gentle-text-container", containerClassName)}
      ref={node => {
        // Combine refs
        containerRef(node);
        if (inViewRef && node) {
          inViewRef.current = node;
        }
      }}
      style={memoizedContainerStyles}>
      <AnimatePresence>
        <Tag
          ref={textRef}
          className={cn("gentle-text", textClassName)}
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
        </div>
      )}
    </div>
  );
}

GentleText.displayName = "GentleText";
