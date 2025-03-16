import type {
  AnimationOptions,
  DOMKeyframesDefinition,
  ElementOrSelector
} from "motion-dom";
import type { CSSWidthValue, TextElementTagUnion } from "./helpers";

/**
 *  Base SplitText props (animation-specific options omitted)
 */
export type BaseScatterTextProps = {
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
