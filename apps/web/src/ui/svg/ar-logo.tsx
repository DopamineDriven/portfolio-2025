import type { FC } from "react";
import type { TsxExclude19 } from "@/types/react";
import { cn } from "@/lib/utils";

export const ArLogo: FC<TsxExclude19<"svg", "viewBox" | "fill" | "xmlns">> = ({
  className,
  ...svg
}) => (
  <svg
    viewBox="0 0 512 512"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("theme-transition", className)}
    {...svg}>
    <g clipPath="url(#clip0_2912_1761)">
      <mask
        id="mask0_2912_1761"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="512"
        height="512">
        <path d="M512 0H0V512H512V0Z" fill="white" />
      </mask>
      <g mask="url(#mask0_2912_1761)">
        <path
          d="M498.527 256C498.527 122.056 389.944 13.4736 256.001 13.4736C122.057 13.4736 13.4746 122.056 13.4746 256C13.4746 389.943 122.057 498.526 256.001 498.526C389.944 498.526 498.527 389.943 498.527 256Z"
          stroke="white"
          strokeWidth="2"
        />
        <path
          d="M121.264 334.22L192.052 177.775H208.473L279.261 334.22H260.398L242.202 293.167H157.656L139.238 334.22H121.264ZM164.536 277.412H235.324L200.04 198.191L164.536 277.412Z"
          fill="white"
        />
        <path
          d="M262.264 334.223V178.889H329.057C348.141 178.889 362.861 184.067 373.217 194.422C381.205 202.411 385.2 212.766 385.2 225.489C385.2 237.916 381.354 247.975 373.66 255.668C365.968 263.361 355.76 268.39 343.037 270.758L390.747 334.223H369.222L324.175 273.865H279.794V334.223H262.264ZM279.794 258.109H327.505C339.339 258.109 348.955 255.224 356.352 249.454C363.749 243.685 367.447 235.771 367.447 225.711C367.447 216.095 363.897 208.624 356.796 203.298C349.843 197.825 340.152 195.088 327.726 195.088H279.794V258.109Z"
          fill="white"
        />
      </g>
    </g>
    <defs>
      <clipPath id="clip0_2912_1761">
        <rect width="512" height="512" fill="white" />
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
