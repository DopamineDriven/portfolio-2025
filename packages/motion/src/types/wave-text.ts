import type {
  AnimationOptions,
  DOMKeyframesDefinition,
  ElementOrSelector
} from "motion-dom";
import type { CSSWidthValue, TextElementTagUnion } from "./helpers";

/**
 *  Base SplitText props (animation-specific options omitted)
 */
export type BaseWavyTextProps = {
  /** content to be split and animated */
  content: string;
  /** content preceding content to be split and animated */
  contentBefore?: string;
  /** content following content to be split and animated */
  contentAfter?: string;
  /** optional container className */
  className?: string;
  /** optional text element className */
  headingClassName?: string;
  /** HTML tag to be used for the text element */
  as?: TextElementTagUnion;
  /** optional initial element or selector for splitText */
  initialElement?: ElementOrSelector;
  initialSpanArr?: HTMLSpanElement[];
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
export type WavyTextProps = BaseWavyTextProps & {
  /** Animation options for the motion library */
  animationOptions?: AnimationOptions;
};
