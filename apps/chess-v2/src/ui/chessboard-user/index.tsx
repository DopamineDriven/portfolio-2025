"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import type { CapturedPiecesProps } from "@/types/values";
import type { ChessColor } from "@/utils/chess-types";
import type { CountryCodes } from "@/utils/flags";
import { toChessGroundColorHelper } from "@/lib/color-helper";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/atoms/avatar";
import CapturedPieces from "@/ui/captured-pieces";
import { countryCodeToFileName } from "@/utils/flags";

export type ChessboardUserProps<T extends "Stockfish" | "Player"> = {
  playerColor: ChessColor;
  children?: ReactNode;
  target: T;
  playerCountry?: string;
  materialScore: { black: number; white: number };
  capturedPieces: CapturedPiecesProps;
};

function ChessboardUser<const T extends "Stockfish" | "Player">({
  target,
  materialScore,
  playerColor,
  children,
  playerCountry = "US",
  capturedPieces
}: ChessboardUserProps<T>) {
  switch (target) {
    case "Stockfish": {
      return (
        <div className="my-2 flex w-full flex-row items-center justify-between px-2 sm:my-4">
          <div className="flex flex-row gap-x-2">
            <Avatar className="size-6 sm:size-9">
              <AvatarImage
                src="https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess-v2/public/chess-default-8.png"
                alt="Player"
              />
              <AvatarFallback>P</AvatarFallback>
            </Avatar>
            <div className="relative flex max-w-xs flex-col justify-around text-left lg:max-w-md">
              <div className="flex w-full flex-row justify-between gap-x-1">
                <h4 className="my-0 text-pretty font-sans text-[0.625rem] leading-normal tracking-tight sm:text-[1rem]">
                  Stockfish
                </h4>

                <Image
                  alt={`/flags/no`}
                  width={30}
                  height={20}
                  src={`https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess-v2/public/flags/no.svg`}
                  className="row-span-1 my-0 aspect-[3/2] h-2 w-3 object-cover sm:h-4 sm:w-6"
                />
              </div>
              <span className="text-pretty font-sans text-[0.625rem] leading-normal tracking-tight sm:text-[1rem]">
                <CapturedPieces
                  color={
                    toChessGroundColorHelper(playerColor) === "black"
                      ? "white"
                      : "black"
                  }
                  capturedPieces={
                    capturedPieces[
                      toChessGroundColorHelper(playerColor) === "white"
                        ? "white"
                        : "black"
                    ]
                  }
                  score={
                    toChessGroundColorHelper(playerColor) === "white"
                      ? materialScore.black - materialScore.white
                      : materialScore.white - materialScore.black
                  }
                  showScore={
                    toChessGroundColorHelper(playerColor) === "white"
                      ? materialScore.black > materialScore.white
                      : materialScore.white > materialScore.black
                  }
                />
              </span>
            </div>
          </div>
          {children ?? null}
        </div>
      );
    }
    case "Player": {
      const countryToFile = countryCodeToFileName(
        playerCountry as CountryCodes
      );
      return (
        <div className="mt-2 flex w-full flex-row items-center justify-between px-2 sm:mt-4">
          <div className="flex flex-row gap-x-2">
            <Avatar className="size-6 sm:size-9">
              <AvatarImage
                src="https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess-v2/public/chess-default-4.png"
                alt="Player"
              />
              <AvatarFallback>P</AvatarFallback>
            </Avatar>
            <div className="relative flex max-w-xs flex-col justify-around text-left">
              <div className="flex w-full flex-row justify-between gap-x-1">
                <h4 className="my-0 text-pretty font-sans text-[0.625rem] leading-normal tracking-tight sm:text-[1rem]">
                  Username
                </h4>
                <Image
                  alt={`/flags/${countryToFile}`}
                  width={30}
                  height={20}
                  src={`https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess-v2/public/flags/${countryToFile}.svg`}
                  className="row-span-1 my-0 aspect-[3/2] h-2 w-3 object-cover sm:h-4 sm:w-6"
                />
              </div>
              <span className="text-pretty font-sans text-[0.625rem] leading-normal tracking-tight sm:text-[1rem]">
                <CapturedPieces
                  color={
                    toChessGroundColorHelper(playerColor) === "black"
                      ? "black"
                      : "white"
                  }
                  capturedPieces={
                    capturedPieces[
                      toChessGroundColorHelper(playerColor) === "white"
                        ? "black"
                        : "white"
                    ]
                  }
                  score={
                    toChessGroundColorHelper(playerColor) === "white"
                      ? materialScore.white - materialScore.black
                      : materialScore.black - materialScore.white
                  }
                  showScore={
                    toChessGroundColorHelper(playerColor) === "white"
                      ? materialScore.white > materialScore.black
                      : materialScore.black > materialScore.white
                  }
                />
              </span>
            </div>
          </div>
          {children ?? null}
        </div>
      );
    }
    default: {
      return <></>;
    }
  }
}

export default ChessboardUser;
