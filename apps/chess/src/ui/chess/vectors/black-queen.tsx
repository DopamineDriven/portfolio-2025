import { FC } from "react";
import type { TsxExclude } from "@/types/helpers";

export const BlackQueen: FC<
  TsxExclude<"svg", "fill" | "viewBox" | "xmlns">
> = ({ ...svg }) => (
  <svg
    viewBox="0 0 39 37"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...svg}>
    <path
      d="M3 9.75C4.51878 9.75 5.75 8.51878 5.75 7C5.75 5.48122 4.51878 4.25 3 4.25C1.48122 4.25 0.25 5.48122 0.25 7C0.25 8.51878 1.48122 9.75 3 9.75Z"
      fill="black"
    />
    <path
      d="M11 6.75C12.5188 6.75 13.75 5.51878 13.75 4C13.75 2.48122 12.5188 1.25 11 1.25C9.48122 1.25 8.25 2.48122 8.25 4C8.25 5.51878 9.48122 6.75 11 6.75Z"
      fill="black"
    />
    <path
      d="M19.5 5.75C21.0188 5.75 22.25 4.51878 22.25 3C22.25 1.48122 21.0188 0.25 19.5 0.25C17.9812 0.25 16.75 1.48122 16.75 3C16.75 4.51878 17.9812 5.75 19.5 5.75Z"
      fill="black"
    />
    <path
      d="M28 6.75C29.5188 6.75 30.75 5.51878 30.75 4C30.75 2.48122 29.5188 1.25 28 1.25C26.4812 1.25 25.25 2.48122 25.25 4C25.25 5.51878 26.4812 6.75 28 6.75Z"
      fill="black"
    />
    <path
      d="M36 9.75C37.5188 9.75 38.75 8.51878 38.75 7C38.75 5.48122 37.5188 4.25 36 4.25C34.4812 4.25 33.25 5.48122 33.25 7C33.25 8.51878 34.4812 9.75 36 9.75Z"
      fill="black"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 21C14.5 19.5 27 19.5 33 21L35.5 8.5L28 20L27.7 5.9L22.5 19.5L19.5 5L16.5 19.5L11.3 5.9L11 20L3.5 8.5L6 21Z"
      fill="black"
      stroke="black"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 21C6 23 7.5 23 8.5 25C9.5 26.5 9.5 26 9 28.5C7.5 29.5 7.5 31 7.5 31C6 32.5 8 33.5 8 33.5C14.5 34.5 24.5 34.5 31 33.5C31 33.5 32.5 32.5 31 31C31 31 31.5 29.5 30 28.5C29.5 26 29.5 26.5 30.5 25C31.5 23 33 23 33 21C24.5 19.5 14.5 19.5 6 21Z"
      fill="black"
      stroke="black"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M8 33.5C15.4478 36.091 23.5522 36.091 31 33.5"
      stroke="black"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M7.5 23.9432C15.2716 21.3523 23.7284 21.3523 31.5 23.9432"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 26.5H30"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 29C15.1427 31.3647 23.8573 31.3647 31 29"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.75 32C14.8229 34.8286 23.6771 34.8286 31.75 32"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
