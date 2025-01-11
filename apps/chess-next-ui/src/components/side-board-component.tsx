"use client";

import type { EmojiClickData } from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Tab, Tabs, useDisclosure } from "@nextui-org/react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import toast from "react-hot-toast";
import { BsArrowRepeat } from "react-icons/bs";
import {
  MdAdd,
  MdOutlinedFlag,
  MdOutlineEmojiEmotions,
  MdOutlineSettings,
  MdOutlineShare
} from "react-icons/md";
import type { Message } from "@/types/types";
import { useBoardStore } from "@/app/store";
import { default as GameModal } from "./game-modal";
import { default as SettingsModal } from "./settings-modal";

interface SideBoardProps {
  onSendMessage: (message: string) => void;
  messages: Message[];
}

const SideBoardComponent: React.FC<SideBoardProps> = ({
  onSendMessage,
  messages
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState("");
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const moves = useBoardStore(state => state.moves);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showGameModal, setShowGameModal] = useState(false);
  const gameOver = useBoardStore(state => state.gameOver);
  const setGameOver = useBoardStore(state => state.setGameOver);
  const onNewGame = useBoardStore(state => state.onNewGame);
  const gameResult = useBoardStore(state => state.gameResult);
  const currentFEN = useBoardStore(state => state.currentFEN);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiPickerRef]);

  const handleEmojiClick = (emojiObject: EmojiClickData) => {
    const emoji = emojiObject.emoji;
    setMessage(prevMessage => prevMessage + emoji);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleLikeButtonClick = () => {
    navigator.clipboard
      .writeText(currentFEN)
      .then(() => {
        toast.success("Pgn Copied!");
      })
      .catch(err => console.error(err));
  };

  return (
    <>
      <div className="my-1 flex h-full w-full flex-col rounded-md bg-slate-900 sm:my-4 sm:h-[95%] sm:w-3/4">
        <Tabs key="underlined" variant="underlined" aria-label="Tabs">
          <Tab key="moves" title="Moves">
            {/* Moves Section */}
            <div className="flex max-h-[460px] flex-col space-y-2 overflow-y-auto">
              <ol className="list-inside list-decimal px-4">
                {moves.map(
                  (move, index) =>
                    index % 2 === 0 && (
                      <li key={index / 2} className="font-semibold">
                        <span className="mx-4 text-blue-400">{move}</span>
                        {index + 1 < moves.length && (
                          <span className="mx-4 text-yellow-400">
                            {moves[index + 1]}
                          </span>
                        )}
                      </li>
                    )
                )}
              </ol>
            </div>
          </Tab>
          <Tab key="chat" title="Chat" className="flex h-full flex-col">
            {/* Chat Messages */}
            <div className="max-h-[480px] flex-1 overflow-y-auto px-4 py-1">
              <div className="flex flex-col-reverse space-y-1">
                {messages
                  .slice()
                  .reverse()
                  .map((msg, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-yellow-400">{msg.username}:</span>
                      <span className="px-1">{msg.content}</span>
                    </div>
                  ))}
              </div>
            </div>
            {/* Chat Input */}
            <div className="relative mt-auto" ref={emojiPickerRef}>
              <input
                type="text"
                placeholder="Type your message..."
                className="w-full border-t-[1px] border-gray-600 bg-slate-900 px-4 py-2 text-white focus:outline-none"
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyUp={handleKeyPress}
              />
              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="absolute bottom-12 right-0">
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    theme={"dark" as Theme}
                  />
                </div>
              )}

              {/* Smiley Icon */}
              <MdOutlineEmojiEmotions
                size={20}
                className="absolute bottom-3 right-3 cursor-pointer"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              />
            </div>
          </Tab>
        </Tabs>
        <div className="mt-auto flex flex-col rounded-md bg-slate-950 py-2">
          {gameOver && (
            <div className="flex justify-around py-2">
              <Button
                color="success"
                aria-label="Rematch"
                radius="none"
                size="lg"
                onClick={e => {
                  e.preventDefault();
                  onNewGame();
                  setGameOver(false);
                }}>
                <BsArrowRepeat size={24} />
                Rematch
              </Button>
              <Button
                color="success"
                variant="ghost"
                aria-label="New"
                radius="none"
                size="lg"
                onClick={() => router.push("/")}>
                <MdAdd size={24} />
                New Game
              </Button>
            </div>
          )}
          <div className="flex gap-2 px-1">
            <Button
              isIconOnly
              variant="light"
              aria-label="Share"
              onClick={handleLikeButtonClick}>
              <MdOutlineShare size={24} />
            </Button>
            <Button
              isIconOnly
              variant="light"
              aria-label="Settings"
              onClick={e => {
                e.preventDefault();
                onOpen();
              }}>
              <MdOutlineSettings size={24} />
            </Button>
            <Button
              variant="light"
              aria-label="Resign"
              className="ml-auto"
              onClick={e => {
                e.preventDefault();
                setShowGameModal(true);
                setGameOver(true);
              }}>
              <MdOutlinedFlag size={24} />
              Resign
            </Button>
          </div>
        </div>
      </div>
      <SettingsModal isOpen={isOpen} onClose={onClose} />
      <GameModal
        isOpen={showGameModal}
        onClose={() => setShowGameModal(false)}
        gameResult={gameResult}
        onNewGame={() => {
          onNewGame();
          setGameOver(false);
        }}
      />
    </>
  );
};

export default SideBoardComponent;
