import type { AnimationOptions, DOMKeyframesDefinition, ElementOrSelector } from "motion-dom"

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

/**
 *  Base SplitText props (animation-specific options omitted)
 */
export type BaseWavyTextProps = {
  /** content to be split and animated */
  content: string;
  contentBefore?: string;
  contentAfter?: string;
  /** optional container className */
  className?: string
  /** optional text element className */
  headingClassName?: string
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
  initialSpanArr?: HTMLSpanElement[];
  /** Animation keyframes */
  keyframes?: DOMKeyframesDefinition
  /** animation target &rarr; `"words" | "chars" | "lines"` */
  animateTarget?: "words" | "chars" | "lines";
  /** allowed max width of the container */
  maxWidth?: CSSWidthValue;

}

/**
 * Scatter Text props
 */
export type WavyTextProps = BaseWavyTextProps & {
  /** Animation options for the motion library */
  animationOptions?: AnimationOptions
}

