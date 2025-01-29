import type { FC } from "react";
import type { TsxExclude19 } from "@/types/react";
import { cn } from "@/lib/utils";

export const ArLogo: FC<TsxExclude19<"svg", "viewBox" | "fill" | "xmlns">> = ({
  className,
  ...svg
}) => (
  <svg
    className={cn(`theme-transition`, className)}
    viewBox="0 0 38 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...svg}>
    <g clipPath="url(#clip0_2876_1896)">
      <path
        d="M37 19C37 9.05887 28.9411 1 19 1C9.05887 1 1 9.05887 1 19C1 28.9411 9.05887 37 19 37C28.9411 37 37 28.9411 37 19Z"
        stroke="currentColor"
      />
      <path
        d="M9 24.8054L14.2538 13.1943H15.4726L20.7264 24.8054H19.3264L17.9759 21.7585H11.701L10.334 24.8054H9ZM12.2116 20.5892H17.4654L14.8467 14.7095L12.2116 20.5892Z"
        fill="currentColor"
      />
      <path
        d="M19.4648 24.8056V13.2769H24.4221C25.8385 13.2769 26.931 13.6612 27.6996 14.4298C28.2925 15.0227 28.589 15.7912 28.589 16.7355C28.589 17.6578 28.3035 18.4044 27.7325 18.9754C27.1616 19.5463 26.404 19.9196 25.4597 20.0953L29.0007 24.8056H27.4031L24.0598 20.3259H20.7659V24.8056H19.4648ZM20.7659 19.1565H24.3069C25.1852 19.1565 25.8989 18.9424 26.4479 18.5142C26.9969 18.086 27.2714 17.4986 27.2714 16.752C27.2714 16.0383 27.0079 15.4838 26.4809 15.0885C25.9648 14.6823 25.2456 14.4792 24.3233 14.4792H20.7659V19.1565Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_2876_1896">
        <rect width="38" height="38" fill="white" />
      </clipPath>
    </defs>
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
