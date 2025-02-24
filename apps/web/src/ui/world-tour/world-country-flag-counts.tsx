"use client";

import type { FC } from "react";
import Image from "next/image";
import { shimmer } from "@/lib/shimmer";
import { cn } from "@/lib/utils";

export const WorldCountryFlagCounts: FC<{
  flagUrl: string;
  countryName: string;
  visitors: string | number;
}> = ({ countryName, flagUrl, visitors }) => {
  return (
    <div className="container flex items-center space-x-3">
      <div className="h-auto w-[4.5rem] shrink-0 overflow-hidden aspect-[3/2]">
        <Image
          src={flagUrl ?? "/en.svg"}
          alt={`Flag of ${countryName}`}
          width={72}
          height={48}
          placeholder="blur"
          loading="eager"
          blurDataURL={shimmer([72, 48])}
          className={cn("h-auto w-full rounded-xs object-cover", )}
          priority
        />
      </div>
      <div className="flex flex-col space-y-0.5 sm:space-y-1">
        <p className="text-base font-medium text-white sm:text-lg">
          {countryName}
        </p>
        <div className="flex flex-row items-center space-x-1 sm:space-x-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            role="img"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4 text-white sm:size-5">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <p className="text-base text-white">{visitors}</p>
        </div>
      </div>
    </div>
  );
};
