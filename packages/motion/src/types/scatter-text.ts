import type {
  AnimationOptions,
  DOMKeyframesDefinition,
  ElementOrSelector
} from "motion-dom";
import type { CSSWidthValue, TextElementTagUnion } from "./helpers";
import type { CSSProperties } from "react";

/**
 *  Base SplitText props (animation-specific options omitted)
 */
export type BaseScatterTextProps = {
  /** content to be split and animated */
  content: string;
  /** optional container className */
  containerClassName?: string;
  /** optional container styles */
  containerStyles?: CSSProperties;
  /** optional heading styles */
  headingStyles?: CSSProperties;
  /** optional text element className */
  headingClassName?: string;
  /** HTML tag to be used for the text element */
  as?: TextElementTagUnion;
  /** optional initial element or selector for splitText */
  initialElement?: ElementOrSelector;
  /** Animation keyframes */
  keyframes?: DOMKeyframesDefinition;
  /** animation target &rarr; `"words" | "chars" | "lines"` */
  animateTarget?: "words" | "chars" | "lines";
  /** allowed max width of the container */
  maxWidth?: CSSWidthValue;
  /** Enable debug mode to show width measurements */
  debug?: boolean;
  /** Allow characters to scatter outside their container */
  allowOverflow?: boolean;
};

/**
 * Scatter Text props
 */
export type ScatterTextProps = BaseScatterTextProps & {
  /** Animation options for the motion library */
  animationOptions?: AnimationOptions;
};



type GentleTextProps = {
  /** Text content to animate */
  /** Optional container className */
  containerClassName?: string
  /** Optional text element className */
  textClassName?: string
  /** HTML tag to be used for the text element */
  as?: TextElementTagUnion
  /** Optional container styles */
  containerStyles?: CSSProperties
  /** Optional text styles */
  textStyles?: CSSProperties
  /** Animation target */
  animateTarget?: "words" | "chars" | "lines"
  /** Max width of the container */
  maxWidth?: CSSWidthValue
  /** Animation keyframes */
  keyframes?: DOMKeyframesDefinition;

  initialElement?: ElementOrSelector;
  /** Enable debug mode */
  debug?: boolean
  /** Animation duration in seconds */
  duration?: number
  /** Animation stagger delay in seconds */
  staggerDelay?: number
  /** Initial y offset in pixels */
  yOffset?: number
  /** Initial scale value */
  initialScale?: number
  /** Initial blur amount in pixels */
  blurAmount?: number
  /** Auto-play animation on mount */
  autoPlay?: boolean
  /** Allow overflow */
  allowOverflow?: boolean
  /** Number of times to repeat the animation (default: 0 - play once) */
  repeat?: AnimationOptions['repeat']
  /** How to repeat the animation */
  repeatType?: AnimationOptions['repeatType']
  /** Delay between repetitions in seconds */
  repeatDelay?: AnimationOptions['repeatDelay']
  /** Only animate when in view */
  animateOnlyInView?: boolean
  /** Amount of element that needs to be in view before animating (0-1) */
  inViewThreshold?: number
  /** Margin around the element for inView detection */
  inViewMargin?: string
}
