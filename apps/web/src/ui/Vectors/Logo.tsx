import type { FC, SVGProps } from "react";
import { cn } from "@/lib/utils";

export const Logo: FC<
  Omit<SVGProps<SVGSVGElement>, "fill" | "viewBox" | "xmlns">
> = ({ className, ...svg }) => (
  <svg
    viewBox="0 0 65 65"
    fill="none"
    className={cn("h-9 w-9", className)}
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