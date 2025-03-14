"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate, AnimationOptions, stagger } from "motion";
import { splitText } from "motion-plus";
import type { WavyTextProps } from "@/ui/atoms/types/wave-text";
import { cn } from "@/lib/utils";

export default function WavyText({
  initialElement,
  content,
  contentBefore = "",
  contentAfter = "",
  className,
  headingClassName,
  as: Tag = "h1",
  keyframes = { y: 0 },
  animationOptions = {
    repeat: Number.POSITIVE_INFINITY,
    repeatType: "mirror",
    ease: "easeInOut",
    duration: 2,
    bounce: 0,
    delay: 0
  },
  initialSpanArr,
  maxWidth,
  animateTarget = "words"
}: WavyTextProps) {
  const [containerElement, setContainerElement] =
    useState<HTMLDivElement | null>(null);

  const charsRef = useRef<HTMLSpanElement[] | null>(initialSpanArr ?? null);
  const elementRef = useRef(initialElement ?? null);
  const keyframesRef = useRef(keyframes);
  const animationRef = useRef(animationOptions);
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

  const charsRefCb = useCallback(
    (node: HTMLSpanElement[] | null) => {
      if (node && !initialSpanArr) {
        charsRef.current = node;
      }
    },
    [initialSpanArr]
  );
  useEffect(() => {
    animationRef.current = animationOptions;
  }, [animationOptions]);

  useEffect(() => {
    keyframesRef.current = keyframes;
  }, [keyframes]);

  const animateWavyText = useCallback(async () => {
    try {
      await document.fonts.ready;
      if (!containerElement || !elementRef.current) return;
      setFontsVisible(true);
      const splitResult = splitText(elementRef.current);

      const staggerDelay = 0.15;
      charsRefCb(splitResult[animateTarget]);
      const dynamicKeyframes = {
        ...keyframesRef.current,
        y: [-20, 20]
      };
      if (charsRef.current) {
        const dynamicAnimation = {
          ...animationRef.current,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "mirror",
          ease: "easeInOut",
          duration: 2,
          delay: stagger(staggerDelay, {
            startDelay: -staggerDelay * charsRef.current.length
          })
        } satisfies AnimationOptions;
        animate(charsRef.current, dynamicKeyframes, dynamicAnimation);
      }
    } catch (err) {
      console.error(`Error animating wavy text: `, err);
    }
  }, [charsRefCb, animateTarget, containerElement]);

  useEffect(() => {
    if (containerElement && elementRef.current) {
      animateWavyText();
    }
  }, [animateWavyText, containerElement]);

  return (
    <div
      className={cn(
        "container flex w-full items-center justify-center",
        className,
        maxWidth
          ? maxWidth !== "full" &&
            maxWidth !== "auto" &&
            maxWidth !== "none" &&
            maxWidth !== "fit"
            ? `max-w-[${maxWidth}]`
            : `max-w-${maxWidth}`
          : `500px`,
        fontsVisible ? "visible" : "invisible"
      )}
      ref={containerRef}>
        <Tag className={headingClassName}>      {contentBefore ?? null}</Tag>&nbsp;
      <Tag
        ref={textRef}
        className={cn("will-change-[transform,opacity]", headingClassName)}>
        {content}
      </Tag>
      <Tag className={headingClassName}>      {contentAfter ?? null}</Tag>
    </div>
  );
}
