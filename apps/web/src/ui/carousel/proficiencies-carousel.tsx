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

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const updateCarousel = () => {
        const firstChild = container.firstElementChild as HTMLElement;
        if (firstChild) {
          const isMobile = window.innerWidth < 640;
          const visibleItems = isMobile ? 3 : 5;
          const animationDuration = 60; // seconds
          const elementWidth = firstChild.offsetWidth;
          const totalWidth = elementWidth * proficiencies.length;
          container.style.setProperty("--total-width", `${totalWidth}px`);
          container.style.setProperty(
            "--animation-duration",
            `${animationDuration}s`
          );
          container.style.setProperty(
            "--visible-items",
            visibleItems.toString()
          );
        }
      };

      updateCarousel();
      window.addEventListener("resize", updateCarousel);
      return () => window.removeEventListener("resize", updateCarousel);
    }
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <div ref={containerRef} className="animate-carousel flex">
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
