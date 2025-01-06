import { FC } from "react";
import type { TsxExclude } from "@/types/helpers";

export const BlackRook: FC<TsxExclude<"svg", "fill" | "viewBox" | "xmlns">> = ({
  ...svg
}) => (
  <svg
    viewBox="0 0 29 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...svg}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1 31H28V28H1V31Z"
      fill="black"
      stroke="black"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.5 24L6 21.5H23L24.5 24H4.5Z"
      fill="black"
      stroke="black"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 28V24H25V28H4Z"
      fill="black"
      stroke="black"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 21.5V8.5H23V21.5H6Z"
      fill="black"
      stroke="black"
      strokeWidth="1.5"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 8.5L3 6H26L23 8.5H6Z"
      fill="black"
      stroke="black"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 6V1H7V3H12V1H17V3H22V1H26V6H3Z"
      fill="black"
      stroke="black"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M4 27.5H25" stroke="white" strokeLinecap="round" />
    <path d="M5 23.5H24" stroke="white" strokeLinecap="round" />
    <path d="M6 21.5H23" stroke="white" strokeLinecap="round" />
    <path d="M6 8.5H23" stroke="white" strokeLinecap="round" />
    <path d="M3 6H26" stroke="white" strokeLinecap="round" />
  </svg>
);
