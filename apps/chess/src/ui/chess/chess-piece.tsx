import React from "react";
import { motion } from "motion/react";
import type { Piece } from "@/types/chess";

interface ChessPieceProps {
  piece: Piece;
}

const ChessPiece: React.FC<ChessPieceProps> = ({ piece }) => {
  const getPieceSymbol = (type: string, color: string) => {
    const symbols: { [key: string]: string } = {
      "white-king": "♔",
      "white-queen": "♕",
      "white-rook": "♖",
      "white-bishop": "♗",
      "white-knight": "♘",
      "white-pawn": "♙",
      "black-king": "♚",
      "black-queen": "♛",
      "black-rook": "♜",
      "black-bishop": "♝",
      "black-knight": "♞",
      "black-pawn": "♟"
    };
    return symbols[`${color}-${type}`] ?? "";
  };

  return (
    <motion.div
      className={`text-4xl ${piece.color === "white" ? "text-white" : "text-black"}`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      {getPieceSymbol(piece.type, piece.color)}
    </motion.div>
  );
};

export default ChessPiece;

/*
type InferColor<T> = T extends `${infer U}-${Piece['type']}` ? U : T;

const ChessPiece: React.FC<ChessPieceProps> = ({ piece }) => {

  const symbols = {
    'white-king': '♔',
    'white-queen': '♕',
    'white-rook': '♖',
    'white-bishop': '♗',
    'white-knight': '♘',
    'white-pawn': '♙',
    'black-king': '♚',
    'black-queen': '♛',
    'black-rook': '♜',
    'black-bishop': '♝',
    'black-knight': '♞',
    'black-pawn': '♟',
  } as const;
  const getPieceSymbol = <const T extends keyof typeof symbols>(type: T, color: Piece['color']) => {
    const symbols = {
      'white-king': '♔',
      'white-queen': '♕',
      'white-rook': '♖',
      'white-bishop': '♗',
      'white-knight': '♘',
      'white-pawn': '♙',
      'black-king': '♚',
      'black-queen': '♛',
      'black-rook': '♜',
      'black-bishop': '♝',
      'black-knight': '♞',
      'black-pawn': '♟',
    } as const;

    return symbols[`${color}-${type}`] || '';
  };

*/
