"use client"

import type { EmblaOptionsType } from "embla-carousel"
import useEmblaCarousel from "embla-carousel-react"
import AutoScroll from "embla-carousel-auto-scroll"
import { cn } from "@/lib/utils"

interface TechnologiesCarouselProps {
  technologies: string[]
}

export function TechnologiesCarousel({ technologies }: TechnologiesCarouselProps) {
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      skipSnaps: false,
    } satisfies EmblaOptionsType,
    [
      AutoScroll({
        playOnInit: true,
        stopOnInteraction: false,
        startDelay: 0,
        speed: 1,
      }),
    ],
  )

  return (
    <div className="w-full overflow-hidden px-0.5 select-none">
      <div className="embla">
        <div className="embla__viewport__posts" ref={emblaRef}>
          <div className="embla__container__posts">
            {technologies.map((tech, index) => (
              <div
                key={`${tech}-${index}`}
                className={cn(
                  "embla__slide__posts",
                  index === 0 ? "ml-0.5" : index === technologies.length - 1 ? "mr-0.5" : "",
                )}
              >
                <div
                  className={cn(
                    "bg-secondary text-secondary-foreground flex h-full items-center justify-center rounded-full px-3 py-1 text-sm whitespace-nowrap backdrop-blur-sm transition-colors",
                    index === 0 ? "mr-2" : index === technologies.length - 1 ? "mr-3 ml-2" : "mx-2",
                  )}
                >
                  {"#" + tech}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

