"use client";

import type {
  AnimationOptions,
  DOMKeyframesDefinition,
  MotionValue
} from "motion-dom";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import throttle from "lodash.throttle";
import { animate, hover } from "motion";
import { splitText } from "motion-plus";
import { useMotionValue } from "motion/react";
import type { ScatterTextProps } from "@/types/scatter-text";
import { useResizeObserver } from "@/hooks/use-resize-observer";

export default function ScatterText({
  initialElement,
  content,
  animateTarget = "chars",
  animationOptions,
  as: Tag = "h1",
  containerClassName,
  containerStyles,
  containerId,
  headingId,
  headingStyles,
  headingClassName,
  keyframes = { x: 0, y: 0 },
  maxWidth = "420px",
  debug = false,
  allowOverflow = false
}: ScatterTextProps) {
  const containerIdMemo = useMemo(() => containerId, [containerId]);

  const headingIdMemo = useMemo(() => headingId, [headingId]);

  const [containerElement, setContainerElement] =
    useState<HTMLDivElement | null>(null);

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    setContainerElement(node);
  }, []);

  const containerClassNameMemo = useMemo(
    () => containerClassName,
    [containerClassName]
  );
  const headingClassNameMemo = useMemo(
    () => headingClassName,
    [headingClassName]
  );

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

  const velocityX = useMotionValue(0);
  const velocityY = useMotionValue(0);

  const prevEvent = useRef(0);

  const [error, setError] = useState<Error | null>(null);

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
          containerStyles?.maxWidth ??
          (maxWidth === "fit"
            ? "fit-content"
            : maxWidth === "full"
              ? "100%"
              : `${maxWidth}`),
        ...(containerStyles ?? {})
      }) satisfies CSSProperties,
    [containerStyles, maxWidth, allowOverflow]
  );

  const memoizedHeadingStyles = useMemo(
    () => ({
      lineHeight: 1,
      letterSpacing: "-0.04em",
      willChange: "transform,opacity",
      ...(headingStyles ?? {})
    }),
    [headingStyles]
  );

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

  const throttledHandlePointerMove = useMemo(
    () =>
      throttle((event: PointerEvent) => {
        const now = performance.now();
        const timeSinceLastEvent = Math.max(
          0.001,
          (now - prevEvent.current) / 1000
        );
        prevEvent.current = now;
        velocityX.set(event.movementX / timeSinceLastEvent);
        velocityY.set(event.movementY / timeSinceLastEvent);
      }, 0),
    [velocityX, velocityY]
  );

  const mergedAnimationOptions = useMemo(
    () =>
      ({
        type: animationOptions?.type ?? "spring",
        stiffness: animationOptions?.stiffness ?? 100,
        damping: animationOptions?.damping ?? 50,
        ...animationOptions
      }) satisfies AnimationOptions,
    [animationOptions]
  );

  const mergedKeyFrameOptions = useCallback(
    (velocityX: MotionValue<number>, velocityY: MotionValue<number>) => {
      const speed = Math.sqrt(
        velocityX.get() * velocityX.get() + velocityY.get() * velocityY.get()
      );
      const angle = Math.atan2(velocityY.get(), velocityX.get());
      const distance = speed * 0.1;

      const dynamicKeyframes = {
        ...keyframes,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance
      } satisfies DOMKeyframesDefinition;
      return dynamicKeyframes;
    },
    [keyframes]
  );
  const animateScatterText = useCallback(() => {
    if (!containerElement || !elementRef.current) return;
    if (!splitTextRef.current) return;
    try {
      const target = splitTextRef.current;
      containerElement.addEventListener(
        "pointermove",
        throttledHandlePointerMove
      );

      const handleHoverStart = (element: Element, _event: PointerEvent) => {
        animate(
          element,
          mergedKeyFrameOptions(velocityX, velocityY),
          mergedAnimationOptions
        );

        return () => {};
      };

      hover(target[animateTarget], handleHoverStart);
      return () => {
        containerElement.removeEventListener(
          "pointermove",
          throttledHandlePointerMove
        );
        throttledHandlePointerMove.cancel();
      };
    } catch (err) {
      console.error("Error in ScatterText useCallback: ", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [
    animateTarget,
    velocityX,
    velocityY,
    containerElement,
    throttledHandlePointerMove,
    mergedAnimationOptions,
    mergedKeyFrameOptions
  ]);

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
      id={containerIdMemo}
      className={containerClassNameMemo}
      ref={containerRef}
      style={memoizedContainerStyles}>
      <Tag
        ref={textRef}
        id={headingIdMemo}
        className={headingClassNameMemo}
        style={memoizedHeadingStyles}>
        {content}
      </Tag>

      {debug && (
        <div
          className={"debug-scatter"}
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
          Width: {containerWidth.toFixed(0)}px
        </div>
      )}
    </div>
  );
}

ScatterText.displayName = "ScatterText";
