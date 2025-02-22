import { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const EllipticalShadowContainer: FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className="relative flex items-center justify-center">
    <div className="pointer-events-none absolute top-0 left-1/2 h-6 w-[60%] -translate-x-1/2 rounded-full bg-black/40 blur-md"></div>
    <div className={cn("relative z-10", className)}>{children}</div>
  </div>
);
