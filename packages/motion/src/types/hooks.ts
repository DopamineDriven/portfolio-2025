import type { AnimationOptions, DOMKeyframesDefinition } from "motion-dom";
import type { RefObject } from "react";

export type UseGentleTextEffect = {
  elementRef: RefObject<HTMLElement | null>;
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
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
};
