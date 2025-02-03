"use client";

import type { EmblaOptionsType } from "embla-carousel";
import AutoScroll from "embla-carousel-auto-scroll";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";
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
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      skipSnaps: false
    } satisfies EmblaOptionsType,
    [
      AutoScroll({
        playOnInit: true,
        stopOnInteraction: false,
        startDelay: 0,
        speed: 1
      })
    ]
  );

  return (
    <div className="w-full overflow-hidden">
      <div className="embla">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {proficiencies.map((item, index) => (
              <div
                key={index}
                className={cn(
                  `embla__slide`,
                  index === 0
                    ? "ml-0.5"
                    : index === proficiencies.length - 1
                      ? "mr-0.5"
                      : ""
                )}>
                <div
                  className={cn(
                    "bg-muted/50 dark:bg-muted/20 hover:bg-muted/70 dark:hover:bg-muted/30 flex h-full flex-col items-center justify-center rounded-lg p-6 text-center backdrop-blur-sm transition-colors",
                    index === 0
                      ? "mr-2"
                      : index === proficiencies.length - 1
                        ? "mr-3 ml-2"
                        : "mx-2"
                  )}>
                  <item.icon />
                  <span className="mt-2 text-sm font-medium">{item.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
