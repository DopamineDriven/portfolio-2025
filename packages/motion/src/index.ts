import type { ScatterTextProps } from "@/types/scatter-text";
export { useResizeObserver } from "@/hooks/use-resize-observer";
export type {
  CSSWidthValue,
  TextElementTagUnion,
  Without,
  XOR
} from "@/types/helpers";
export type {
  BaseScatterTextProps,
  ScatterTextProps
} from "@/types/scatter-text";
export type {
  BaseAnimationOptions,
  BaseSplitTextProps,
  SplitTextProps,
  StaggerConfig,
  WithDelayProps,
  WithStaggerProps
} from "@/types/split-text";
export type { BaseWavyTextProps, WavyTextProps } from "@/types/wave-text";
export { default as ScatterText } from "@/ui/scatter-text";

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "animatedText": ScatterTextProps;
    }
  }
}

export{};
