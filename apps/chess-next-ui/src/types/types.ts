import type { CSSProperties } from "react";

export interface Message {
  username: string;
  content: string;
}

export type MovesKit = { white: string; black: string }[];

export interface OptionSquares {
  [key: string]: {
    background: string;
    borderRadius: string;
  };
}

export interface RightClickedSquares {
  [key: string]:
    | {
        backgroundColor: string;
      }
    | undefined;
}

export const convertCSSPropertiesToStringObject = (
  cssProperties: CSSProperties
): Record<string, string> => {
  const stringObject: Record<string, string> = {};
  for (const key in cssProperties) {
    if (typeof cssProperties[key as keyof typeof cssProperties] === "string") {
      stringObject[key] = cssProperties[
        key as keyof typeof cssProperties
      ] as string;
    }
  }
  return stringObject;
};
