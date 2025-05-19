import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

export function VercelIcon({
  className,
  ...rest
}: Omit<SVGProps<SVGSVGElement>, "viewBox" | "xmlns" | "fill" | "role">) {
  return (
    <svg
      fill="none"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1155 1000"
      className={cn("size-12", className)}
      {...rest}>
      <path d="m577.3 0 577.4 1000H0z" fill="#fff" />
    </svg>
  );
}

VercelIcon.displayName = "VercelIcon";
