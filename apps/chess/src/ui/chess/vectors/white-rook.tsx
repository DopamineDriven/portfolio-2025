import { FC } from "react";
import type { TsxExclude } from "@/types/helpers";

export const WhiteRook: FC<TsxExclude<"svg", "fill" | "viewBox" | "xmlns">> = ({
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
      fill="white"
      stroke="black"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 28V24H25V28H4Z"
      fill="white"
      stroke="black"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 6V1H7V3H12V1H17V3H22V1H26V6"
      fill="white"
    />
    <path
      d="M3 6V1H7V3H12V1H17V3H22V1H26V6"
      stroke="black"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M26 6L23 9H6L3 6"
      fill="white"
    />
    <path
      d="M26 6L23 9H6L3 6"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M23 9V21.5H6V9"
      fill="white"
    />
    <path d="M23 9V21.5H6V9" stroke="black" strokeWidth="1.5" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M23 21.5L24.5 24H4.5L6 21.5"
      fill="white"
    />
    <path
      d="M23 21.5L24.5 24H4.5L6 21.5"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M3 6H26" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
