"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/ui/atoms/button";

interface ChatWidgetProps {
  messages: { username: string; content: string }[];
  onSendMessageAction: (message: string) => void;
}

export default function ChatWidget({
  messages,
  onSendMessageAction
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem(
      "message"
    ) as HTMLInputElement;
    if (input.value.trim() !== "") {
      onSendMessageAction(input.value);
      input.value = "";
    }
  };

  return (
    <div className="fixed bottom-1.5 left-4 z-50 hidden sm:block">
      {isOpen ? (
        <div className="flex h-96 w-80 flex-col rounded-lg bg-gray-700">
          <div className="flex items-center justify-between border-b border-gray-600 p-4">
            <h2 className="text-xl font-bold text-white">Chat</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex-grow overflow-y-auto p-4">
            {messages.map((msg, index) => (
              <div key={index} className="mb-2">
                <span className="font-bold text-white">{msg.username}: </span>
                <span className="text-gray-300">{msg.content}</span>
              </div>
            ))}
          </div>
          <form
            onSubmit={handleSubmit}
            className="border-t border-gray-600 p-4">
            <input
              type="text"
              name="message"
              className="w-full rounded bg-gray-600 px-3 py-2 text-white"
              placeholder="Type a message..."
            />
          </form>
        </div>
      ) : (
        <Button
          variant="default"
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={() => setIsOpen(true)}>
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
