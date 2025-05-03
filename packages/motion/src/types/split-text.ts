import type {
  AnimationOptions,
  DOMKeyframesDefinition,
  AnimationGeneratorType,
  ElementOrSelector
} from "motion-dom";
import type { Easing } from "motion-utils";
import type { CSSWidthValue, TextElementTagUnion, XOR } from "./helpers";

/** Stagger config */
export type StaggerConfig = {
  /** Duration between each element */
  duration: number;
  /** Delay before the first element animates */
  startDelay?: number;
  /** Where to start the stagger from */
  from?: "first" | "last" | "center" | number;
  /** Easing function for the stagger timing */
  ease?: Easing;
};

/**
 * Base Animation Options without `delay`
 */
export type BaseAnimationOptions = Omit<
  AnimationOptions,
  "type" | "duration" | "bounce" | "delay"
> & {
  type?: AnimationGeneratorType;
  duration?: number;
  bounce?: number;
};

/**
 *  Base SplitText props (animation-specific options omitted)
 */
export type BaseSplitTextProps = {
  /** content to be split and animated */
  content: string;
  /** optional container className */
  className?: string;
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
};

/**
 * with stagger
 */
export type WithStaggerProps = {
  animationOptions?: BaseAnimationOptions;
  withStagger: StaggerConfig;
};

/**
 * with animation options field `delay`
 */
export type WithDelayProps = {
  animationOptions?: BaseAnimationOptions & {
    delay: number | ((i: number, total: number) => number);
  };
  withStagger?: undefined;
};

/**
 * SplitText props to be consumed with mutually exclusive enforcement of stagger vs delay animation options
 */
export type SplitTextProps = BaseSplitTextProps &
  XOR<WithStaggerProps, WithDelayProps>;
