import type { AnimationGeneratorType, AnimationOptions } from "motion-dom";
import type { Easing } from "motion-utils";

/**
 * helper workup for use in XOR type below
 * makes properties from U optional and undefined in T, and vice versa
 */
export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

/**
 * enforces mutual exclusivity of T | U
 */
// prettier-ignore
export type XOR<T, U> =
  [T, U] extends [object, object]
    ? (Without<T, U> & U) | (Without<U, T> & T)
    : T | U

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
  duration?: number;
  type?: AnimationGeneratorType;
  bounce?: number;
};

/**
 * with stagger
 */
export type WithStaggerProps = {
  /** you can still tweak ease, type, bounce, but never `.delay` */
  animationOptions?: BaseAnimationOptions;
  /** you _opt into_ stagger mode by passing this */
  withStagger: StaggerConfig;
};

/**
 * with animation options field `delay`
 */
export type WithDelayProps = {
  /** you _opt out_ of stagger, so you control exact delay */
  animationOptions: BaseAnimationOptions & {
    delay: number | ((i: number, total: number) => number);
  };
  withStagger?: undefined;
};

/**
 * You must choose either stagger-mode _or_ delay-mode.
 */
export type StaggerOrDelayXOR<T> = T & XOR<WithStaggerProps, WithDelayProps>;

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
  | `calc(${number | string})`
  | "full"
  | "fit"
  | "none"
  | "-moz-initial"
  | "inherit"
  | "initial"
  | "revert"
  | "revert-layer"
  | "unset"
  | "-moz-fit-content"
  | "-moz-max-content"
  | "-moz-min-content"
  | "-webkit-fit-content"
  | "-webkit-max-content"
  | "-webkit-min-content"
  | "fit-content"
  | "intrinsic"
  | "max-content"
  | "min-content";

/** HTML tag to be used for the text element (not comprehensive)
 *
 * Note: the following omits void html Tags (they accept no children) and is more comprehensive but creates a complex union
 *
 * `Exclude<keyof React.JSX.IntrinsicElements, "area" | "base" | "br" | "col" | "command" | "embed" | "hr" | "img" | "input" | "keygen" | "link" | "meta" | "param" | "source" | "track" | "wbr">`
 */
export type TextElementTagUnion =
  | "a"
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
  | "button"
  | "caption"
  | "figcaption"
  | "code"
  | "article"
  | "header"
  | "mark"
  | "sup"
  | "label"
  | "title"
  | "small"
  | "sub"
  | "details"
  | "ins"
  | "del"
  | "figure"
  | "li"
  | "ol"
  | "ul"
  | "i"
  | "kbd"
  | "summary";
