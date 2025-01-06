import { FC } from "react";
import type { TsxExclude } from "@/types/helpers";

export const BlackKing: FC<TsxExclude<"svg", "fill" | "viewBox" | "xmlns">> = ({
  ...svg
}) => (
  <svg
    viewBox="0 0 35 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...svg}>
    <path
      d="M17.5 6.63V1"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.5005 20C17.5005 20 22.0005 12.5 20.5005 9.5C20.5005 9.5 19.5005 7 17.5005 7C15.5005 7 14.5005 9.5 14.5005 9.5C13.0005 12.5 17.5005 20 17.5005 20Z"
      fill="black"
      stroke="black"
      strokeWidth="1.5"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.50028 31.9986C12.0003 35.4986 22.0003 35.4986 27.5003 31.9986V24.9986C27.5003 24.9986 36.5003 20.4986 33.5003 14.4986C29.5003 7.99865 20.0003 10.9986 17.5003 18.4986C14.0003 10.9986 4.50028 7.99865 1.50028 14.4986C-1.49972 20.4986 6.50028 24.4986 6.50028 24.4986V31.9986Z"
      fill="black"
    />
    <path
      d="M17.5003 18.4986C20.0003 10.9986 29.5003 7.99865 33.5003 14.4986C36.5003 20.4986 27.5003 24.9986 27.5003 24.9986V31.9986C22.0003 35.4986 12.0003 35.4986 6.50028 31.9986V24.4986C6.50028 24.4986 -1.49972 20.4986 1.50028 14.4986C4.50028 7.99865 14.0003 10.9986 17.5003 18.4986ZM17.5003 18.4986V21.9986"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M15 3H20" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
    <path
      d="M27 24.4977C27 24.4977 35.5 20.4977 33.03 14.8477C29.15 8.99772 20 12.9977 17.5 19.4977M17.5 19.4977L17.51 21.5977M17.5 19.4977C15 12.9977 4.90602 8.99772 1.99702 14.8477C-0.499984 20.4977 6.85002 23.8477 6.85002 23.8477"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.5 25C12 22 22 22 27.5 25M6.5 28.5C12 25.5 22 25.5 27.5 28.5M6.5 32C12 29 22 29 27.5 32"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
