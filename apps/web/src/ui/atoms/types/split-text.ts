import type {
  AnimationOptions,
  DOMKeyframesDefinition,
  Easing,
  ElementOrSelector
} from "motion-dom";

/**
 * helper workup for use in XOR type below
 * makes properties from U optional and undefined in T, and vice versa
 */
export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

/**
 * enforces mutual exclusivity of T | U
 */
export type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;

/**
 * valid width values
 */
export type CSSWidthValue =
  | `${number}px`
  | `${number}%`
  | `${number}rem`
  | `${number}em`
  | `${number}vw`
  | `${number}dvw`
  | `${number}ch`
  | `${number}svw`
  | `${number}lvw`
  | `${number}vmin`
  | `${number}vmax`
  | `${number}lvmin`
  | `${number}lvmax`
  | `${number}svmin`
  | `${number}svmax`
  | `${number}dvmin`
  | `${number}dvmax`
  | `${number}vi`
  | `${number}lvi`
  | `${number}svi`
  | `${number}lvb`
  | `${number}svb`
  | `${number}dvb`
  | `${number}/${number}`
  | "full"
  | "fit"
  | "auto"
  | "none";

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
  type?: "decay" | "spring" | "keyframes" | "tween" | "inertia";
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
  as?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "p"
    | "span"
    | "div"
    | "pre"
    | "cite"
    | "address"
    | "aside"
    | "blockquote"
    | "caption"
    | "label"
    | "title"
    | "small"
    | "sub"
    | "li"
    | "i"
    | "kbd"
    | "summary";
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
 * Scatter Text props
 */
export type ScatterTextProps = BaseSplitTextProps & {
  animationOptions?: AnimationOptions;
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
