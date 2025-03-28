import { FC } from "react";
import type { TsxExclude } from "@/types/helpers";

export const WhitePawn: FC<TsxExclude<"svg", "fill" | "viewBox" | "xmlns">> = ({
  ...svg
}) => (
  <svg
    viewBox="0 0 26 33"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...svg}>
    <path
      d="M13 1C10.79 1 9 2.79 9 5C9 5.89 9.29 6.71 9.78 7.38C7.83 8.5 6.5 10.59 6.5 13C6.5 15.03 7.44 16.84 8.91 18.03C5.91 19.09 1.5 23.58 1.5 31.5H24.5C24.5 23.58 20.09 19.09 17.09 18.03C18.56 16.84 19.5 15.03 19.5 13C19.5 10.59 18.17 8.5 16.22 7.38C16.71 6.71 17 5.89 17 5C17 2.79 15.21 1 13 1Z"
      fill="white"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
