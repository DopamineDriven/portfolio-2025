"use client";

import { useCallback, useEffect, useState } from "react";
import AutoScroll from "embla-carousel-auto-scroll";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "motion/react";

export function TechnologiesCarousel({
  technologies
}: {
  technologies: string[];
}) {
  // Create multiple copies to ensure seamless looping
  const duplicatedTechnologies = [
    ...technologies,
    ...technologies,
    ...technologies
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      containScroll: false,
      watchDrag: false // Disable drag detection for smoother scrolling
    },
    [
      AutoScroll({
        playOnInit: true,
        stopOnInteraction: true,
        startDelay: 0,
        speed: 0.5,
        rootNode: emblaRoot =>
          emblaRoot.parentElement && (emblaRoot.parentElement as HTMLElement)
      })
    ]
  );

  const [_scrollProgress, setScrollProgress] = useState(0);

  const onScroll = useCallback(() => {
    if (!emblaRef || !emblaApi) return;
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
    setScrollProgress(progress * 100);
  }, [emblaRef, emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onScroll();
    emblaApi.on("scroll", onScroll);
    emblaApi.on("reInit", onScroll);

    // Reset scroll position when reaching the end
    const handleSelect = () => {
      const lastIndex = emblaApi.scrollSnapList().length - 1;
      const currentIndex = emblaApi.selectedScrollSnap();

      if (currentIndex === lastIndex) {
        emblaApi.scrollTo(0, true);
      }
    };

    emblaApi.on("select", handleSelect);
    return () => {
      emblaApi.off("select", handleSelect);
    };
  }, [emblaApi, onScroll]);

  return (
    <div className="relative w-full">
      <div className="w-full overflow-hidden" ref={emblaRef}>
        <div className="flex w-[400%] gap-3">
          {" "}
          {/* Ensure container is wide enough */}
          {duplicatedTechnologies.map((tech, index) => (
            <motion.div
              key={`${tech}-${index}`}
              className="flex-none"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}>
              <span className="bg-secondary text-secondary-foreground mx-2 my-0 inline-block rounded-full px-3 py-1 text-sm whitespace-nowrap">
                {"#" + tech}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
      <style jsx>{`
        /* Ensure content fills viewport width */
        .embla__container {
          display: flex;
          flex-wrap: nowrap;
          min-width: 100%;
        }

        /* Hide scrollbar but allow scrolling */
        .embla__viewport {
          overflow: hidden;
          width: 100%;
        }
      `}</style>
    </div>
  );
}
