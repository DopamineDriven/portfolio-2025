import type { FC } from "react";
import type { TsxExclude19 } from "@/types/react";
import { cn } from "@/lib/utils";

export const ArLogo: FC<
  TsxExclude19<"svg", "viewBox" | "fill" | "role" | "xmlns">
> = ({ className, ...svg }) => (
  <svg
    className={cn(className, "theme-transition")}
    viewBox="0 0 512 512"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...svg}>
    <path
      d="M107.701 334.338L177.229 173.979H202.963L272.49 334.338H243.144L227.117 295.897H152.397L136.144 334.338H107.701ZM162.556 271.103H216.959L189.644 207.417L162.556 271.103Z"
      fill="currentColor"
    />
    <path
      d="M258.93 334.336V175.112H329.36C347.717 175.112 362.089 179.699 372.476 188.873C382.86 198.05 388.055 210.368 388.055 225.838C388.055 238.426 384.669 248.775 377.897 256.886C371.125 265 361.945 270.725 350.354 274.061L393.021 334.339H360.286L321.011 278.839H286.699V334.339H258.933L258.93 334.336ZM286.695 254.042H327.325C337.258 254.042 345.162 251.619 351.031 246.762C356.897 241.912 359.838 235.315 359.838 226.973C359.838 218.482 356.978 211.958 351.26 207.412C345.541 202.862 337.487 200.586 327.103 200.586H286.699V254.039L286.695 254.042Z"
      fill="currentColor"
    />
    <path
      d="M6 256C6 118.156 118.156 6 256 6C393.844 6 506 118.156 506 256C506 393.844 393.844 506 256 506C118.156 506 6 393.844 6 256Z"
      stroke="currentColor"
      strokeWidth="12"
    />
  </svg>
);

export const ArLogoOld: FC<
  TsxExclude19<"svg", "fill" | "viewBox" | "xmlns">
> = ({ className, ...svg }) => (
  <svg
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
