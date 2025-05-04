import type { DOMKeyframesDefinition, ElementOrSelector } from "motion-dom";
import type { UseInViewOptions } from "motion/react";
import type { CSSProperties } from "react";
import type {
  CSSWidthValue,
  StaggerOrDelayXOR,
  TextElementTagUnion
} from "@/types/helpers";

/**
 * GentleText props
 *
 * You must choose either stagger-mode _or_ delay-mode.
 */
export type GentleTextProps = StaggerOrDelayXOR<{
  /** Container element id */
  containerId?: string;
  /** Text element id */
  textId?: string;
  /** Text content to animate */
  content: string;
  /** Optional container className */
  containerClassName?: string;
  /** Optional text element className */
  textClassName?: string;
  /** HTML tag to be used for the text element */
  as?: TextElementTagUnion;
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
  /** Only animate when in view */
  animateOnlyInView?: boolean;
  /** Amount of element that needs to be in view before animating (0-1) */
  inViewThreshold?: UseInViewOptions["amount"];
  /** Margin around the element for inView detection */
  inViewMargin?: UseInViewOptions["margin"];
  /** Callback when animation starts */
  onAnimationStart?: () => void;
  /** Callback when animation completes */
  onAnimationComplete?: () => void;
}>;
