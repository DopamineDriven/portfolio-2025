import type { DOMKeyframesDefinition, ElementOrSelector } from "motion-dom";
import type {
  CSSWidthValue,
  StaggerOrDelayXOR,
  TextElementTagUnion
} from "./helpers";

/**
 * SplitText props to be consumed with mutually exclusive enforcement of stagger vs delay animation options
 */
export type SplitTextProps = StaggerOrDelayXOR<{
  /** content to be split and animated */
  content: string;
  /** optional container className */
  className?: string;
  /** optional text element className */
  headingClassName?: string;
  /** HTML tag to be used for the text element */
  as?: TextElementTagUnion;
  /** animation duration */
  duration?: number;
  /** optional initial element or selector for splitText */
  initialElement?: ElementOrSelector;
  /** Animation keyframes */
  keyframes?: DOMKeyframesDefinition;
  /** animation target &rarr; `"words" | "chars" | "lines"` */
  animateTarget?: "words" | "chars" | "lines";
  /** allowed max width of the container */
  maxWidth?: CSSWidthValue;
}>;
