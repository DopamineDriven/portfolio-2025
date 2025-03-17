"use client";

import type { AnimationOptions, DOMKeyframesDefinition } from "motion/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { animate, hover } from "motion";
import { splitText } from "motion-plus";
import { useMotionValue } from "motion/react";
import type { ScatterTextProps } from "@/ui/atoms/types/scatter-text";
import { useResizeObserver } from "@/hooks/use-resize-observer";
import { cn } from "@/lib/utils";
import throttle from "lodash/throttle";

export default function ScatterText({
  initialElement,
  content,
  animateTarget = "chars",
  animationOptions = { type: "spring", stiffness: 100, damping: 50 },
  as: Tag = "h1",
  className,
  headingClassName,
  keyframes = { x: 0, y: 0 },
  maxWidth = "420px",
  debug = false,
  allowOverflow = false
}: ScatterTextProps) {
  const [containerElement, setContainerElement] =
    useState<HTMLDivElement | null>(null);
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    setContainerElement(node);
  }, []);

  const { width: containerWidth } = useResizeObserver({
    current: containerElement
  });
  const elementRef = useRef<HTMLElement | null>(null);

  // Memoized callback for the text element ref
  const textRef = useCallback(
    (node: HTMLElement | null) => {
      if (node && !initialElement) {
        elementRef.current = node;
      }
    },
    [initialElement]
  );

  const keyframesRef = useRef(keyframes);
  const animationRef = useRef(animationOptions);
  const velocityX = useMotionValue(0);
  const velocityY = useMotionValue(0);
  const prevEvent = useRef(0);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    keyframesRef.current = keyframes;
  }, [keyframes]);

  useEffect(() => {
    animationRef.current = animationOptions;
  }, [animationOptions]);

  useEffect(() => {
    if (debug) {
      console.log(`[${maxWidth}]: ${containerWidth}px`);
    }
  }, [maxWidth, containerWidth, debug]);

    const splitTextRef = useRef<{
      readonly chars: HTMLSpanElement[];
      readonly words: HTMLSpanElement[];
      readonly lines: HTMLSpanElement[];
  } | null>(null);

    // Re-split when `content` changes
    useEffect(() => {
      if (elementRef.current) {
        splitTextRef.current = splitText(elementRef.current);
      }
    }, [content]);

  const animateScatterText = useCallback(() => {
    if (!containerElement || !elementRef.current) return;
    if (!splitTextRef.current) return;
    try {
      const target = splitTextRef.current;
      const handlePointerMove = throttle((event: PointerEvent) => {
        const now = performance.now();
        const timeSinceLastEvent = Math.max(
          0.001,
          (now - prevEvent.current) / 1000
        );
        prevEvent.current = now;
        velocityX.set(event.movementX / timeSinceLastEvent);
        velocityY.set(event.movementY / timeSinceLastEvent);
      }, 50);

      containerElement.addEventListener("pointermove", handlePointerMove);

      const handleHoverStart = (element: Element, _event: PointerEvent) => {
        const speed = Math.sqrt(
          velocityX.get() * velocityX.get() + velocityY.get() * velocityY.get()
        );
        const angle = Math.atan2(velocityY.get(), velocityX.get());
        const distance = speed * 0.1;

        const dynamicKeyframes = {
          ...keyframesRef.current,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance
        } satisfies DOMKeyframesDefinition;

        const dynamicAnimationOpts = {
          ...animationRef.current,
          type: "spring",
          stiffness: 100,
          damping: 50
        } satisfies AnimationOptions;

        animate(element, dynamicKeyframes, dynamicAnimationOpts);

        return (event: PointerEvent) => {
          event;
          // Optional hover end handler
        };
      };

      hover(target[animateTarget], handleHoverStart);

      return () => {
        document.removeEventListener("pointermove", handlePointerMove);
      };
    } catch (err) {
      console.error("Error in ScatterText useCallback: ", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [animateTarget, containerElement, velocityX, velocityY]);

  useEffect(() => {
    if (containerElement && elementRef.current) {
      animateScatterText();
    }
  }, [containerElement, animateScatterText]);

  if (error) {
    return (
      <div className="text-red-500">
        <p>Error rendering animated text: {error.message}</p>
        <p>{content}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative container flex flex-col items-center justify-center space-y-2 text-left",
        allowOverflow ? "overflow-visible" : "overflow-hidden",
        maxWidth
          ? maxWidth !== "full" &&
            maxWidth !== "auto" &&
            maxWidth !== "none" &&
            maxWidth !== "fit"
            ? `max-w-[${maxWidth}]`
            : `max-w-${maxWidth}`
          : `420px`,
        className
      )}
      ref={containerRef}
      aria-label={`Interactive text: ${content}`}
      style={{
        maxWidth: maxWidth,

      }}>
      <Tag
        ref={textRef}
        className={cn(
          "leading-none tracking-[-0.04em] will-change-[transform,opacity]",
          headingClassName
        )}>
        {content}
      </Tag>
      {debug && (
        <div className="relative mt-2 rounded bg-black/50 px-1 text-xs text-gray-400">
          Width: {containerWidth.toFixed(0)}px
        </div>
      )}
    </div>
  );
}
