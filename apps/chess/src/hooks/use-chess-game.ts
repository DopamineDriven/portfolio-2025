"use-client";

import { useCallback, useEffect, useReducer } from "react";
import type {
  Board,
  GameAction,
  GameState,
  Piece,
  PieceColor
} from "@/types/chess";
import { useToast } from "@/hooks/use-toast";
import { BOARD_SIZE, INITIAL_BOARD, PIECE_VALUES } from "@/lib/constants";

const initialState: GameState = {
  board: INITIAL_BOARD,
  currentPlayer: "white",
  selectedSquare: null,
  possibleMoves: [],
  isCheck: false,
  isCheckmate: false,
  capturedPieces: {
    white: [],
    black: []
  },
  score: {
    white: 0,
    black: 0
  }
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SELECT_SQUARE": {
      const [row, col] = action.payload;
      const piece = state?.board?.[row]?.[col] ?? null;

      if (
        state.selectedSquare &&
        state.selectedSquare[0] === row &&
        state.selectedSquare[1] === col
      ) {
        return {
          ...state,
          selectedSquare: null,
          possibleMoves: []
        };
      }

      if (piece && piece.color === state.currentPlayer) {
        let possibleMoves = getPossibleMoves(state.board, row, col);

        if (state.isCheck) {
          possibleMoves = possibleMoves.filter(
            ([toRow, toCol]) =>
              !isKingInCheck(
                movePiece(state.board, row, col, toRow, toCol).newBoard,
                state.currentPlayer
              )
          );
        }

        return {
          ...state,
          selectedSquare: [row, col],
          possibleMoves
        };
      }

      if (state.selectedSquare && isValidMove(state.possibleMoves, row, col)) {
        const [fromRow, fromCol] = state.selectedSquare;
        const { newBoard, capturedPiece } = movePiece(
          state.board,
          fromRow,
          fromCol,
          row,
          col
        );
        const nextPlayer = state.currentPlayer === "white" ? "black" : "white";
        const isCheck = isKingInCheck(newBoard, nextPlayer);
        const isCheckmate = isCheck && isCheckmateState(newBoard, nextPlayer);

        // Update captured pieces and score
        const newCapturedPieces = { ...state.capturedPieces };
        const newScore = { ...state.score };

        if (capturedPiece) {
          const capturingColor = state.currentPlayer;
          newCapturedPieces[capturingColor] = [
            ...newCapturedPieces[capturingColor],
            capturedPiece
          ];
          newScore[capturingColor] += PIECE_VALUES[capturedPiece.type];
        }

        return {
          board: newBoard,
          currentPlayer: nextPlayer,
          selectedSquare: null,
          possibleMoves: [],
          isCheck,
          isCheckmate,
          capturedPieces: newCapturedPieces,
          score: newScore
        };
      }

      return {
        ...state,
        selectedSquare: null,
        possibleMoves: []
      };
    }

    case "RESET_GAME":
      return initialState;

    default:
      return state;
  }
}

function getPossibleMoves(
  board: Board,
  row: number,
  col: number
): [number, number][] {
  const piece = board?.[row]?.[col] ?? null;
  if (!piece) return [];

  switch (piece.type) {
    case "pawn":
      return getPawnMoves(board, row, col, piece.color);
    case "rook":
      return getRookMoves(board, row, col);
    case "knight":
      return getKnightMoves(board, row, col);
    case "bishop":
      return getBishopMoves(board, row, col);
    case "queen":
      return [
        ...getRookMoves(board, row, col),
        ...getBishopMoves(board, row, col)
      ];
    case "king":
      return getKingMoves(board, row, col);
    default:
      return [];
  }
}

function getPawnMoves(
  board: Board,
  row: number,
  col: number,
  color: PieceColor
): [number, number][] {
  const moves = Array.of<[number, number]>();
  const direction = color === "white" ? -1 : 1;

  if (
    row + direction >= 0 &&
    row + direction < BOARD_SIZE &&
    !board?.[row + direction]?.[col]
  ) {
    moves.push([row + direction, col]);

    if ((color === "white" && row === 6) || (color === "black" && row === 1)) {
      if (!board?.[row + 2 * direction]?.[col]) {
        moves.push([row + 2 * direction, col]);
      }
    }
  }

  for (const colOffset of [-1, 1]) {
    const newCol = col + colOffset;
    if (newCol >= 0 && newCol < BOARD_SIZE) {
      const targetPiece = board?.[row + direction]?.[newCol];
      if (targetPiece && targetPiece.color !== color) {
        moves.push([row + direction, newCol]);
      }
    }
  }

  return moves;
}

function getRookMoves(
  board: Board,
  row: number,
  col: number
): [number, number][] {
  const moves = Array.of<[number, number]>();
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
  ] as const;

  for (const [dx, dy] of directions) {
    let newRow = row + dx;
    let newCol = col + dy;
    while (
      newRow >= 0 &&
      newRow < BOARD_SIZE &&
      newCol >= 0 &&
      newCol < BOARD_SIZE
    ) {
      if (!board?.[newRow]?.[newCol]) {
        moves.push([newRow, newCol]);
      } else {
        if (board?.[newRow]?.[newCol]?.color !== board?.[row]?.[col]?.color) {
          moves.push([newRow, newCol]);
        }
        break;
      }
      newRow += dx;
      newCol += dy;
    }
  }

  return moves;
}

function getKnightMoves(
  board: Board,
  row: number,
  col: number
): [number, number][] {
  const moves = Array.of<[number, number]>();
  const offsets = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1]
  ] as const;

  for (const [dx, dy] of offsets) {
    const newRow = row + dx;
    const newCol = col + dy;
    if (
      newRow >= 0 &&
      newRow < BOARD_SIZE &&
      newCol >= 0 &&
      newCol < BOARD_SIZE
    ) {
      if (
        !board?.[newRow]?.[newCol] ||
        board[newRow][newCol]?.color !== board?.[row]?.[col]?.color
      ) {
        moves.push([newRow, newCol]);
      }
    }
  }

  return moves;
}

function getBishopMoves(
  board: Board,
  row: number,
  col: number
): [number, number][] {
  const moves = Array.of<[number, number]>();
  const directions = [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1]
  ] as const;

  for (const [dx, dy] of directions) {
    let newRow = row + dx;
    let newCol = col + dy;
    while (
      newRow >= 0 &&
      newRow < BOARD_SIZE &&
      newCol >= 0 &&
      newCol < BOARD_SIZE
    ) {
      if (!board?.[newRow]?.[newCol]) {
        moves.push([newRow, newCol]);
      } else {
        if (board?.[newRow]?.[newCol]?.color !== board?.[row]?.[col]?.color) {
          moves.push([newRow, newCol]);
        }
        break;
      }
      newRow += dx;
      newCol += dy;
    }
  }

  return moves;
}

function getKingMoves(
  board: Board,
  row: number,
  col: number
): [number, number][] {
  const moves = Array.of<[number, number]>();
  const offsets = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1]
  ] as const;

  for (const [dx, dy] of offsets) {
    const newRow = row + dx;
    const newCol = col + dy;
    if (
      newRow >= 0 &&
      newRow < BOARD_SIZE &&
      newCol >= 0 &&
      newCol < BOARD_SIZE
    ) {
      if (
        !board?.[newRow]?.[newCol] ||
        board?.[newRow]?.[newCol]?.color !== board?.[row]?.[col]?.color
      ) {
        moves.push([newRow, newCol]);
      }
    }
  }

  return moves;
}

function isValidMove(
  possibleMoves: [number, number][],
  row: number,
  col: number
): boolean {
  return possibleMoves.some(([r, c]) => r === row && c === col);
}

function movePiece(
  board: Board,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number
): {
  newBoard: Board;
  capturedPiece: Piece | null;
} {
  const newBoard = board.map(row => [...row]) as Board;
  const movingPiece = newBoard?.[fromRow]?.[fromCol] ?? null;
  const capturedPiece = newBoard?.[toRow]?.[toCol];

  newBoard[toRow]![toCol] = movingPiece;
  newBoard[fromRow]![fromCol] = null;

  return {
    newBoard,
    capturedPiece: capturedPiece ?? null
  };
}

function isKingInCheck(board: Board, playerColor: PieceColor): boolean {
  let kingPosition: [number, number] | null = null;
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = board?.[row]?.[col] ?? null;
      if (piece && piece.type === "king" && piece.color === playerColor) {
        kingPosition = [row, col];
        break;
      }
    }
    if (kingPosition) break;
  }

  if (!kingPosition) return false;

  const opponentColor = playerColor === "white" ? "black" : "white";
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = board?.[row]?.[col] ?? null;
      if (piece && piece.color === opponentColor) {
        const moves = getPossibleMoves(board, row, col);
        if (
          moves.some(
            ([r, c]) => r === kingPosition![0] && c === kingPosition![1]
          )
        ) {
          return true;
        }
      }
    }
  }

  return false;
}

function isCheckmateState(board: Board, playerColor: PieceColor): boolean {
  // Check all pieces of the current player
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = board?.[row]?.[col] ?? null;
      if (piece && piece.color === playerColor) {
        // Get all possible moves for this piece
        const moves = getPossibleMoves(board, row, col);

        // Check if any move resolves the check
        for (const [toRow, toCol] of moves) {
          const newBoard = movePiece(board, row, col, toRow, toCol).newBoard;
          if (!isKingInCheck(newBoard, playerColor)) {
            // If we find a move that resolves the check, it's not checkmate
            return false;
          }
        }
      }
    }
  }

  // If we've checked all pieces and moves and haven't found a resolution, it's checkmate
  return true;
}

export function useChessGame() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { toast } = useToast();

  const selectSquare = useCallback((row: number, col: number) => {
    dispatch({ type: "SELECT_SQUARE", payload: [row, col] });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: "RESET_GAME" });
  }, []);

  useEffect(() => {
    if (state.isCheck) {
      if (state.isCheckmate) {
        toast({
          title: "Checkmate!",
          description: `${state.currentPlayer === "white" ? "Black" : "White"} wins!`,
          duration: 5000
        });
      } else {
        toast({
          title: "Check!",
          description: `${state.currentPlayer} king is in check!`,
          duration: 3000
        });
      }
    }
  }, [state.isCheck, state.isCheckmate, state.currentPlayer, toast]);

  return {
    ...state,
    selectSquare,
    resetGame
  };
}
