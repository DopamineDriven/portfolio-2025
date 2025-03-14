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
  | `${number}/${number}`
  | "full"
  | "fit"
  | "auto"
  | "none";

// Define stagger configuration
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
 * SplitText props to be consumed with mutually exclusive enforcement of stagger vs delay animation options
 */
export type SplitTextProps = BaseSplitTextProps &
  XOR<WithStaggerProps, WithDelayProps>;

/*

  // Old version of single entity


  type SplitTextProps = {
  content: string;
  className?: string;
  headingClassName?: string;
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

  initialElement?: ElementOrSelector;
  withStagger?:
    | false
    | {

        duration?: number;
        startDelay?: number;
        from?: "first" | "last" | "center" | number;
        ease?: Easing;
      };
  keyframes?: DOMKeyframesDefinition;
  animateTarget?: "words" | "chars" | "lines";
  animationOptions?: Omit<
    AnimationOptions,
    "type" | "duration" | "bounce" | "delay"
  > & {
    type?: "decay" | "spring" | "keyframes" | "tween" | "inertia";
    duration?: number;
    bounce?: number;
    delay?: number | ((i: number, total: number) => number);
  };
  maxWidth?:
    | `${number}px`
    | `${number}%`
    | `${number}rem`
    | `${number}em`
    | `${number}vw`
    | `${number}dvw`
    | `${number}ch`
    | `${number}/${number}`
    | "full"
    | "fit"
    | "auto"
    | "none";
};
  */
