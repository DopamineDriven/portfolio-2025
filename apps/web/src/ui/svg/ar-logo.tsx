import type { FC, SVGAttributes } from "react";
import { cn } from "@/lib/utils";

export const ArLogo: FC<
  Omit<SVGAttributes<SVGSVGElement>, "viewBox" | "fill" | "role" | "xmlns">
> = ({ className, ...svg }) => (
  <svg
    viewBox="0 0 512 512"
    className={cn("theme-transition", className)}
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="AR Logo Dark"
    fill="none"
    {...svg}>
    <path
      fill="currentColor"
      d="M107.701 334.338L177.229 173.979H202.963L272.49 334.338H243.144L227.117 295.897H152.397L136.144 334.338H107.701ZM162.556 271.103H216.959L189.644 207.417L162.556 271.103Z"
    />
    <path
      fill="currentColor"
      d="M258.93 334.336V175.112H329.36C347.717 175.112 362.089 179.699 372.476 188.873C382.86 198.05 388.055 210.368 388.055 225.838C388.055 238.426 384.669 248.775 377.897 256.886C371.125 265 361.945 270.725 350.354 274.061L393.021 334.339H360.286L321.011 278.839H286.699V334.339H258.933L258.93 334.336ZM286.695 254.042H327.325C337.258 254.042 345.162 251.619 351.031 246.762C356.897 241.912 359.838 235.315 359.838 226.973C359.838 218.482 356.978 211.958 351.26 207.412C345.541 202.862 337.487 200.586 327.103 200.586H286.699V254.039L286.695 254.042Z"
    />
    <path
      fill="currentColor"
      d="M256 512C394.144 512 512 394.144 512 256C512 117.856 394.144 0 256 0C117.856 0 0 117.856 0 256C0 394.144 117.856 512 256 512ZM256 500C124.935 500 12 387.065 12 256C12 124.935 124.935 12 256 12C387.065 12 500 124.935 500 256C500 387.065 387.065 500 256 500Z"
    />
  </svg>
);

export const ArLogoOld: FC<
  Omit<SVGAttributes<SVGSVGElement>, "viewBox" | "fill" | "role" | "xmlns">
> = ({ className, ...svg }) => (
  <svg
    role="img"
    viewBox="0 0 65 65"
    fill="none"
    className={cn("theme-transition", className)}
    xmlns="http://www.w3.org/2000/svg"
    {...svg}>
    <circle
      cx="32.5"
      cy="32.5"
      r="31.5"
      strokeWidth="2"
      stroke="currentColor"
    />
    <path
      fill="currentColor"
      d="M30.116 39H32.816L27.956 26.238H25.076L20.18 39H22.808L23.87 36.084H29.054L30.116 39ZM26.462 28.992L28.226 33.816H24.698L26.462 28.992ZM40.7482 39H43.5202L40.7842 33.78C42.4582 33.294 43.5022 31.944 43.5022 30.162C43.5022 27.948 41.9182 26.238 39.4342 26.238H34.4482V39H36.9502V34.086H38.2462L40.7482 39ZM36.9502 31.944V28.398H38.9662C40.2262 28.398 40.9642 29.1 40.9642 30.18C40.9642 31.224 40.2262 31.944 38.9662 31.944H36.9502Z"
    />
  </svg>
);
