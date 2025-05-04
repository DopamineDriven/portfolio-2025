import type { DOMKeyframesDefinition } from "motion-dom";
import type { RefObject } from "react";
import { StaggerOrDelayXOR } from "./helpers";

export type UseGentleTextEffectProps = StaggerOrDelayXOR<{
  elementRef: RefObject<HTMLElement | null>;
  animateTarget?: "words" | "chars" | "lines";
  duration?: number;
  yOffset?: number;
  initialScale?: number;
  blurAmount?: number;
  autoPlay?: boolean;
  keyframes?: DOMKeyframesDefinition;
  inView?: boolean;
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
}>;
