"use client";

import { useEffect, useRef } from "react";
import { DockerIcon } from "@/ui/svg/docker";
import { NextjsIcon } from "@/ui/svg/nextjs";
import { NodejsIcon } from "@/ui/svg/nodejs";
import { ReactIcon } from "@/ui/svg/react";
import { TailwindIcon } from "@/ui/svg/tailwind";
import { TypeScriptIcon } from "@/ui/svg/typescript";
import { VercelIcon } from "@/ui/svg/vercel";

const proficiencies = [
  { name: "Next.js", icon: NextjsIcon },
  { name: "TypeScript", icon: TypeScriptIcon },
  { name: "React", icon: ReactIcon },
  { name: "Node.js", icon: NodejsIcon },
  { name: "Docker", icon: DockerIcon },
  { name: "Tailwind", icon: TailwindIcon },
  { name: "Vercel", icon: VercelIcon }
] as const;

export function ProficienciesCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | undefined>(undefined);
  const offsetRef = useRef(0);
  const speedRef = useRef(0); // pixels per ms

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateCarousel = () => {
      const firstChild = container.firstElementChild as HTMLElement;
      if (!firstChild) return;
      const isMobile = window.innerWidth < 640;
      const _visibleItems = isMobile ? 3 : 5;
      const elementWidth = firstChild.offsetWidth;
      const totalWidth = elementWidth * proficiencies.length;
      const animationDuration = 60 * 1000; // 60 seconds in milliseconds

      speedRef.current = totalWidth / animationDuration;

      // Reset the transform and offset when updating
      container.style.transform = "translate3d(0, 0, 0)";
      offsetRef.current = 0;
    };

    updateCarousel();
    window.addEventListener("resize", updateCarousel);

    let lastTime = performance.now();

    function step(currentTime: number) {
      const delta = currentTime - lastTime;
      lastTime = currentTime;

      // Increase the offset and wrap around using modulo
      offsetRef.current =
        (offsetRef.current + delta * speedRef.current) %
        (containerRef.current?.scrollWidth ?? 0);
      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
      }

      rafIdRef.current = requestAnimationFrame(step);
    }

    rafIdRef.current = requestAnimationFrame(step);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener("resize", updateCarousel);
    };
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <div ref={containerRef} className="flex">
        {[...proficiencies, ...proficiencies].map((item, index) => (
          <div
            key={index}
            className="min-w-0 flex-[0_0_33.333%] sm:flex-[0_0_20%]">
            <div className="bg-muted/50 dark:bg-muted/20 hover:bg-muted/70 dark:hover:bg-muted/30 mx-2 flex h-full flex-col items-center justify-center rounded-lg p-6 text-center backdrop-blur-sm transition-colors">
              <item.icon />
              <span className="mt-2 text-sm font-medium">{item.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
