import type { FC } from "react";
import type { SVGProperties } from "@/types";

const BlackRook: FC<SVGProperties> = ({ ...svg }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...svg}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.875 23.25H22.125V21H1.875V23.25Z"
      fill="black"
      stroke="black"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.5 18L5.625 16.125H18.375L19.5 18H4.5Z"
      fill="black"
      stroke="black"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.125 21V18H19.875V21H4.125Z"
      fill="black"
      stroke="black"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.625 16.125V6.375H18.375V16.125H5.625Z"
      fill="black"
      stroke="black"
      strokeWidth="1.5"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.625 6.375L3.375 4.5H20.625L18.375 6.375H5.625Z"
      fill="black"
      stroke="black"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.375 4.5V0.75H6.375V2.25H10.125V0.75H13.875V2.25H17.625V0.75H20.625V4.5H3.375Z"
      fill="black"
      stroke="black"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M4.125 20.625H19.875"
      stroke="white"
      strokeWidth="0.75"
      strokeLinecap="round"
    />
    <path
      d="M4.875 17.625H19.125"
      stroke="white"
      strokeWidth="0.75"
      strokeLinecap="round"
    />
    <path
      d="M5.625 16.125H18.375"
      stroke="white"
      strokeWidth="0.75"
      strokeLinecap="round"
    />
    <path
      d="M5.625 6.375H18.375"
      stroke="white"
      strokeWidth="0.75"
      strokeLinecap="round"
    />
    <path
      d="M3.375 4.5H20.625"
      stroke="white"
      strokeWidth="0.75"
      strokeLinecap="round"
    />
  </svg>
);

BlackRook.displayName = "BlackRook";

export default BlackRook;
