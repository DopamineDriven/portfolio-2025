import type { FC } from "react";
import type { SVGProperties } from "@/types";

const WhiteRook: FC<SVGProperties> = ({ ...svg }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...svg}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1 22.9578H22.8182V20.7578H1V22.9578Z"
      fill="white"
      stroke="black"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.42383 20.7615V17.8281H20.3935V20.7615H3.42383Z"
      fill="white"
      stroke="black"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.61621 4.6276V0.960938H5.84853V2.4276H9.88894V0.960938H13.9293V2.4276H17.9697V0.960938H21.2021V4.6276"
      fill="white"
    />
    <path
      d="M2.61621 4.6276V0.960938H5.84853V2.4276H9.88894V0.960938H13.9293V2.4276H17.9697V0.960938H21.2021V4.6276"
      stroke="black"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21.2021 4.63281L18.7778 6.83281H5.04045L2.61621 4.63281"
      fill="white"
    />
    <path
      d="M21.2021 4.63281L18.7778 6.83281H5.04045L2.61621 4.63281"
      stroke="black"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.7774 6.82812V15.9948H5.04004V6.82812"
      fill="white"
    />
    <path d="M18.7774 6.82812V15.9948H5.04004V6.82812" stroke="black" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.7776 15.9922L19.9897 17.8255H3.82812L5.04025 15.9922"
      fill="white"
    />
    <path
      d="M18.7776 15.9922L19.9897 17.8255H3.82812L5.04025 15.9922"
      stroke="black"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M2.61621 4.63281H21.2021" stroke="black" strokeLinecap="round" />
  </svg>
);

WhiteRook.displayName = "WhiteRook";

export default WhiteRook;
