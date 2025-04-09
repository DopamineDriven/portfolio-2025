"use client";

import { useRef } from "react";
import { useAnimationFrame } from "motion/react";
import { cn } from "@/lib/utils";

export default function UseAnimationFrame() {
  const ref = useRef<HTMLDivElement>(null);

  useAnimationFrame(t => {
    if (!ref.current) return;

    const rotate = Math.sin(t / 10000) * 200;
    const y = (1 + Math.sin(t / 1000)) * -50;
    ref.current.style.transform = `translateY(${y}px) rotateX(${rotate}deg) rotateY(${rotate}deg)`;
  });

  const baseVariant = {
    side: "absolute w-full h-full bg-[#ff0000]/60 ",
    front: "[transform:rotateY(0deg)_translateZ(100px)] bg-[#ff008844]",
    right: "[transform:rotateY(90deg)_translateZ(100px)] bg-[#dd00ee44]",
    back: "[transform:rotateY(180deg)_translateZ(100px)] bg-[#9911ff44]",
    left: "[transform:rotateY(-90deg)_translateZ(100px)] bg-[#0d63f844]",
    top: "[transform:rotateX(90deg)_translateZ(100px)] bg-[#0cdcf744]",
    bottom: "[transform:rotateX(-90deg)_translateZ(100px)] bg-[#8df0cc44]"
  } as const;

  function s<const T extends keyof typeof baseVariant>(props: T) {
    return baseVariant[props];
  }

  return (

      <div className="w-[12.5rem] h-[12.5rem] [perspective:800px]">
        <div className="relative size-[12.5rem] [transform-style:preserve-3d]" ref={ref}>
          <div className={cn(s("side"), s("front"))} />
          <div className={cn(s("side"), s("left"))} />
          <div className={cn(s("side"), s("right"))} />
          <div className={cn(s("side"), s("top"))} />
          <div className={cn(s("side"), s("bottom"))} />
          <div className={cn(s("side"), s("back"))} />
        </div>
      </div>
  );
}
