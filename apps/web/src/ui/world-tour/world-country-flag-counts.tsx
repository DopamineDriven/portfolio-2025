"use client";

import type { FC } from "react";
import { useCallback, useMemo } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import type { FlagAspectRatioUnion } from "@d0paminedriven/iso-3166-1";
import { shimmer } from "@/lib/shimmer";
import { cn } from "@/lib/utils";
import { UsersIcon } from "@/ui/svg/users";

interface WorldCountryFlagCountsProps {
  flagUrl: string;
  countryName: string;
  visitors: string | number;
  flagAspectRatio: FlagAspectRatioUnion;
}

type InferAspectRatioSplit<T> = T extends `${infer X}/${infer Y}`
  ? [X, Y]
  : never;

const flagWidth = 72;

export const WorldCountryFlagCounts: FC<WorldCountryFlagCountsProps> = ({
  countryName,
  flagUrl,
  visitors,
  flagAspectRatio
}) => {
  const aspectClassName = `aspect-[${flagAspectRatio}]`;

  const aspectRatioHelper = useCallback(
    (flagAspectRatio: FlagAspectRatioUnion) => {
      const [width, height] = flagAspectRatio.split(
        "/"
      ) as InferAspectRatioSplit<FlagAspectRatioUnion>;
      return /\./g.test(width) === false
        ? Number.parseInt(width, 10) / Number.parseInt(height, 10)
        : Number.parseFloat(width) / Number.parseInt(height, 10);
    },
    []
  );

  const flagHeight = useMemo(() => {
    const aspectRatio = aspectRatioHelper(flagAspectRatio);
    return flagWidth / aspectRatio;
  }, [flagAspectRatio, aspectRatioHelper]);

  return (
    <motion.div
      className="container flex max-w-3xl items-center space-x-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}>
      <motion.div
        className={cn("h-auto w-[4.5rem] shrink-0 overflow-hidden")}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}>
        <Image
          src={flagUrl ?? "/en.svg"}
          alt={`Flag of ${countryName}`}
          width={flagWidth}
          height={flagHeight}
          placeholder="blur"
          loading="eager"
          blurDataURL={shimmer([flagWidth, flagHeight])}
          className={cn("h-auto w-full object-cover", aspectClassName)}
          priority
        />
      </motion.div>
      <div className="flex flex-col space-y-0.5 whitespace-nowrap sm:space-y-1">
        <AnimatePresence mode="wait">
          <motion.p
            key={countryName}
            className="text-base font-medium text-white sm:text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}>
            {/^(United Kingdom of Great Britain and Northern Ireland)$/g.test(
              countryName
            ) === true
              ? "United Kingdom"
              : countryName}
          </motion.p>
        </AnimatePresence>
        <div className="flex flex-row items-center space-x-1 sm:space-x-1.5">
          <UsersIcon className="size-4 text-white sm:size-5" />
          <AnimatePresence mode="wait">
            <motion.p
              key={visitors}
              className="text-base text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}>
              {visitors}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
