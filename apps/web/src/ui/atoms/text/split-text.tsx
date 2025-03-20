"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { animate, stagger } from "motion";
import { splitText } from "motion-plus";
import type {
  BaseAnimationOptions,
  SplitTextProps
} from "@/ui/atoms/types/split-text";
import { cn } from "@/lib/utils";

/**
 * @internal
 */
type CompleteAnimationOptions = BaseAnimationOptions & {
  delay?: number | ((i: number, total: number) => number);
};

function SplitText({
  content,
  className,
  headingClassName,
  as: Tag = "h1",
  initialElement,
  keyframes = { opacity: [0, 1], y: [10, 0] },
  animationOptions = {
    type: "spring",
    duration: 2,
    bounce: 0
  },
  maxWidth = "420px",
  animateTarget = "words",
  withStagger
}: SplitTextProps) {
  const [containerElement, setContainerElement] =
    useState<HTMLDivElement | null>(null);

  const elementRef = useRef(initialElement ?? null);

  const [fontsVisible, setFontsVisible] = useState(false);

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    setContainerElement(node);
  }, []);

  const textRef = useCallback(
    (node: HTMLElement | null) => {
      if (node && !initialElement) {
        elementRef.current = node;
      }
    },
    [initialElement]
  );

  const processedAnimationOptions = useMemo(() => {
    // use the internally available type to bypass XOR-mediated constraints -- internal use only
    const options: CompleteAnimationOptions = { ...animationOptions };

    if (withStagger) {
      const { duration, startDelay, from, ease } = withStagger;
      options.delay = stagger(duration, { startDelay, from, ease });
    }

    return options;
  }, [withStagger, animationOptions]);

  const animateText = useCallback(async () => {
    try {
      // Wait for fonts to load
      await document.fonts.ready;

      if (!containerElement || !elementRef.current) return;

      setFontsVisible(true);

      const splitResult = splitText(elementRef.current);

      // Animate the words
      animate(splitResult[animateTarget], keyframes, processedAnimationOptions);
    } catch (err) {
      console.error("Error animating text: ", err);
    }
  }, [processedAnimationOptions, keyframes, containerElement, animateTarget]);

  useEffect(() => {
    if (containerElement && elementRef.current) {
      animateText();
    }
  }, [animateText, containerElement]);

  return (
    <div
      className={cn(
        "flex w-full items-start justify-center text-left",
        maxWidth
          ? maxWidth !== "full" &&
            maxWidth !== "auto" &&
            maxWidth !== "none" &&
            maxWidth !== "fit"
            ? `max-w-[${maxWidth}]`
            : `max-w-${maxWidth}`
          : `max-w-[420px]`,
        fontsVisible ? "visible" : "invisible",
        className
      )}
      ref={containerRef}>
      <Tag
        ref={textRef}
        className={cn("will-change-[transform,opacity]", headingClassName)}>
        {content}
      </Tag>
    </div>
  );
}


export default SplitText;
