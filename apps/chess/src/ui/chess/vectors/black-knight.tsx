import { FC } from "react";
import type { TsxExclude } from "@/types/helpers";

export const BlackKnight: FC<
  TsxExclude<"svg", "fill" | "viewBox" | "xmlns">
> = ({ ...svg }) => (
  <svg
    viewBox="0 0 34 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...svg}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17 4C27.5 5 33.5 12 33 33H10C10 24 20 26.5 18 12"
      fill="black"
    />
    <path
      d="M17 4C27.5 5 33.5 12 33 33H10C10 24 20 26.5 18 12"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19 12C19.38 14.91 13.45 19.37 11 21C8 23 8.18 25.34 6 25C4.958 24.06 7.41 21.96 6 22C5 22 6.19 23.23 5 24C4 24 0.997002 25 1 20C1 18 7 8 7 8C7 8 8.89 6.1 9 4.5C8.27 3.506 8.5 2.5 8.5 1.5C9.5 0.5 11.5 4 11.5 4H13.5C13.5 4 14.28 2.008 16 1C17 1 17 4 17 4"
      fill="black"
    />
    <path
      d="M19 12C19.38 14.91 13.45 19.37 11 21C8 23 8.18 25.34 6 25C4.958 24.06 7.41 21.96 6 22C5 22 6.19 23.23 5 24C4 24 0.997002 25 1 20C1 18 7 8 7 8C7 8 8.89 6.1 9 4.5C8.27 3.506 8.5 2.5 8.5 1.5C9.5 0.5 11.5 4 11.5 4H13.5C13.5 4 14.28 2.008 16 1C17 1 17 4 17 4"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.5 19.5C4.5 19.6326 4.44732 19.7598 4.35355 19.8536C4.25979 19.9473 4.13261 20 4 20C3.86739 20 3.74021 19.9473 3.64645 19.8536C3.55268 19.7598 3.5 19.6326 3.5 19.5C3.5 19.3674 3.55268 19.2402 3.64645 19.1464C3.74021 19.0527 3.86739 19 4 19C4.13261 19 4.25979 19.0527 4.35355 19.1464C4.44732 19.2402 4.5 19.3674 4.5 19.5Z"
      fill="white"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.93338 9.75212C9.73447 10.0966 9.49809 10.4007 9.27623 10.5974C9.05438 10.7942 8.86522 10.8674 8.75038 10.8011C8.63554 10.7348 8.60443 10.5344 8.66388 10.2439C8.72332 9.95339 8.86847 9.59664 9.06738 9.25212C9.2663 8.90761 9.50268 8.60354 9.72454 8.40682C9.94639 8.21009 10.1355 8.13682 10.2504 8.20312C10.3652 8.26943 10.3963 8.46988 10.3369 8.76037C10.2774 9.05086 10.1323 9.40761 9.93338 9.75212Z"
      fill="white"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.5496 4.39844L19.0996 5.84844L19.5996 5.99844C22.7496 6.99844 25.2496 8.48844 27.4996 12.7484C29.7496 17.0084 30.7496 23.0584 30.2496 32.9984L30.1996 33.4984H32.4496L32.4996 32.9984C32.9996 22.9384 31.6196 16.1484 29.2496 11.6584C26.8796 7.16844 23.4596 5.01844 20.0596 4.49844L19.5496 4.39844Z"
      fill="white"
    />
  </svg>
);
