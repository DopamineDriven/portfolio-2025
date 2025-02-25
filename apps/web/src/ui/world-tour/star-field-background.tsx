"use client";

import type { FC } from "react";
import { starFieldBackgroundProps } from "@/ui/world-tour/constants";
import { cn } from "@/lib/utils";

const StarFieldBackground: FC<{ height: number }> = ({ height }) => {
  return (
    <div className="absolute w-full" style={{ height: `${height}px` }}>
      <svg
        className={cn("relative right-1/2 left-1/2 -mx-[50vw] w-screen h-full")}
        role="img"
        xmlns="http://www.w3.org/2000/svg">
        {starFieldBackgroundProps.map((star, index) => (
          <circle
            key={index}
            cx={star.cx}
            cy={star.cy}
            r={star.r}
            fill="#ffffff"
            className="animate-twinkle"
            style={{ animationDelay: star.animationDelay }}
          />
        ))}
      </svg>
    </div>
  );
};

StarFieldBackground.displayName = "StarFieldBackground";

export default StarFieldBackground;
