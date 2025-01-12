"use client";

import type { FC } from "react";
import { useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { IN, US } from "country-flag-icons/react/3x2";
import type { Message } from "@/types/types";
import { useBoardStore } from "@/app/store";
import { default as ChessboardBot } from "@/components/chessboard-bot";
import { default as SideBoardComponent } from "@/components/side-board-component";
import { shimmer } from "@/lib/shimmer";

const AgainstComputer: FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const searchParams = useSearchParams();
  const stockfishLevel = Number.parseInt(
    searchParams.get("stockfishLevel") ?? "5",
    10
  );
  const stockfishLevelSymbol =
    stockfishLevel === 2
      ? "lvl2"
      : stockfishLevel === 5
        ? "lvl5"
        : stockfishLevel === 10
          ? "lvl10"
          : stockfishLevel === 15
            ? "lvl15"
            : "lvl20";
  const { userName, profilePhoto } = useBoardStore(
    (state => ({
      userName: state.userName,
      profilePhoto: state.profilePhoto
    }))
  );
  const handleSendMessage = (message: string) => {
    if (message.trim() !== "") {
      const newMessage = {
        username: userName,
        content: message
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
    }
  };

  return (
    <div className="flex h-screen flex-col gap-4 bg-gray-800 px-4 py-2 text-white sm:flex-row sm:gap-8 sm:px-6">
      {/* Chessboard */}
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex w-full justify-start gap-1 py-1">
          <Image
            src="/stockfish.jpeg"
            width={100}
            height={100}
            quality={100}
            alt={shimmer([100, 100])}
            className="rounded-md object-contain"
          />
          <div className="flex items-start justify-center gap-1 font-semibold">
            StockFish
            <span className="font-light text-gray-300">
              ({stockfishLevelSymbol})
            </span>
            <span>
              <IN className="mx-1 mt-1 h-4 w-4" />
            </span>
          </div>
        </div>
        <ChessboardBot />
        <div className="flex w-full justify-start gap-1">
          <Image
            src={profilePhoto}
            width={100}
            height={100}
            alt={shimmer([100, 100])}
            className="rounded-md object-cover"
            quality={100}
          />
          <div className="flex items-start justify-center gap-1 font-semibold">
            {userName}
            <span>
              <US className="mx-1 mt-1 h-4 w-4" />
            </span>
          </div>
        </div>
      </div>

      {/* SideBoard */}
      <div className="h-full w-full">
        <SideBoardComponent
          onSendMessage={handleSendMessage}
          messages={messages}
        />
      </div>
    </div>
  );
};

export default AgainstComputer;
