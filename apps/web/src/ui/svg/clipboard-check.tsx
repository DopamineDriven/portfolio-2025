import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export function ClipboardCheck({
  stroke,
  className,
  ...svg
}: Omit<
  ComponentPropsWithoutRef<"svg">,
  "viewBox" | "xmlns" | "fill" | "role"
>) {
  return (
    <svg
      className={cn("", className)}
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      {...svg}>
      <path
        fill="none"
        stroke={stroke ?? "#15803d"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9l2 2l4-4"
      />
    </svg>
  );
}
ClipboardCheck.displayName = "ClipboardCheck";
