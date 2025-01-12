"use client";

import { useState } from "react";
import { Button, useDisclosure } from "@nextui-org/react";
import { default as GameSelectionModal } from "./game-selection-modal";

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedGameMode, setSelectedGameMode] = useState("");

  const openModal = (gameMode: string) => {
    setSelectedGameMode(gameMode);
    onOpen();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8">
      <h1 className="text-3xl font-black text-gray-100">Knightly</h1>
      <div className="flex items-center justify-center gap-4">
        <Button
          color="success"
          variant="ghost"
          onClick={e => {
            e.preventDefault();
            openModal("computer");
          }}>
          Start Playing
        </Button>
      </div>
      <GameSelectionModal
        isOpen={isOpen}
        onClose={onClose}
        selectedGameMode={selectedGameMode}
      />
    </main>
  );
}
