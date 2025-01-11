import React from "react";
import Image from "next/image";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader
} from "@nextui-org/react";
import { shimmer } from "@/lib/shimmer";

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameResult: string | null;
  onNewGame: () => void;
}

const GameModal: React.FC<GameModalProps> = ({
  isOpen,
  onClose,
  gameResult,
  onNewGame
}) => {
  const handleNewGameClick = () => {
    onNewGame();
    onClose();
  };
  return (
    <>
      <Modal size="sm" isOpen={isOpen} onClose={onClose} isDismissable={false}>
        <ModalContent className="p-2">
          {() => (
            <>
              <ModalHeader className="flex justify-center text-3xl font-extralight">
                {gameResult && <p>{gameResult}</p>}
              </ModalHeader>
              <ModalBody>
                <div className="flex items-center justify-center gap-8">
                  <div className="flex flex-col items-center gap-1">
                    <Image
                      src="/stockfish.jpeg"
                      width={100}
                      height={100}
                      quality={100}
                      alt={shimmer([100, 100])}
                      className="rounded-md object-contain"
                    />
                    <p className="text-sm font-light">StockFish</p>
                  </div>
                  <div className="text-lg">Vs</div>
                  <div className="flex flex-col items-center gap-1">
                    <Image
                      src="/chess-default-2.png"
                      width={100}
                      height={100}
                      alt={shimmer([100, 100])}
                      className="rounded-md object-cover"
                      quality={100}
                    />
                    <p className="text-sm font-light">User</p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="flex justify-center">
                <Button
                  color="success"
                  variant="ghost"
                  onClick={handleNewGameClick}>
                  New Game
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default GameModal;
