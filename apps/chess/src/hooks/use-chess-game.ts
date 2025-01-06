"use-client";

import { useCallback, useEffect, useReducer } from "react";
import type {
  Board,
  CastlingMove,
  CastlingRights,
  GameAction,
  GameState,
  Piece,
  PieceColor
} from "@/types/chess";
import { useToast } from "@/hooks/use-toast";
import {
  BOARD_SIZE,
  INITIAL_BOARD,
  INITIAL_CASTLING_RIGHTS,
  PIECE_VALUES
} from "@/lib/constants";

const initialState = {
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
  },
  castlingRights: INITIAL_CASTLING_RIGHTS
} satisfies GameState;

function isSquareUnderAttack(
  board: Board,
  square: [number, number],
  attackingColor: PieceColor
) {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = board?.[row]?.[col];
      if (piece && piece.color === attackingColor) {
        const possibleMoves = getPossibleMoves(board, row, col);
        if (
          possibleMoves.some(([r, c]) => r === square[0] && c === square[1])
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

function getCastlingMoves(
  board: Board,
  color: PieceColor,
  castlingRights: CastlingRights
) {
  const moves = Array.of<CastlingMove>();
  const row = color === "white" ? 7 : 0;
  const enemyColor = color === "white" ? "black" : "white";

  // Check kingside castling
  if (
    (color === "white" && castlingRights.whiteKingside) ||
    (color === "black" && castlingRights.blackKingside)
  ) {
    if (
      !board?.[row]?.[5] &&
      !board?.[row]?.[6] && // Squares between king and rook are empty
      !isSquareUnderAttack(board, [row, 4], enemyColor) && // King is not in check
      !isSquareUnderAttack(board, [row, 5], enemyColor) && // King doesn't pass through check
      !isSquareUnderAttack(board, [row, 6], enemyColor)
    ) {
      // King doesn't end in check
      moves.push({
        kingFrom: [row, 4],
        kingTo: [row, 6],
        rookFrom: [row, 7],
        rookTo: [row, 5]
      });
    }
  }

  // Check queenside castling
  if (
    (color === "white" && castlingRights.whiteQueenside) ||
    (color === "black" && castlingRights.blackQueenside)
  ) {
    if (
      !board?.[row]?.[1] &&
      !board?.[row]?.[2] &&
      !board?.[row]?.[3] && // Squares between king and rook are empty
      !isSquareUnderAttack(board, [row, 4], enemyColor) && // King is not in check
      !isSquareUnderAttack(board, [row, 3], enemyColor) && // King doesn't pass through check
      !isSquareUnderAttack(board, [row, 2], enemyColor)
    ) {
      // King doesn't end in check
      moves.push({
        kingFrom: [row, 4],
        kingTo: [row, 2],
        rookFrom: [row, 0],
        rookTo: [row, 3]
      });
    }
  }

  return moves;
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SELECT_SQUARE": {
      const [row, col] = action.payload;
      const piece = state.board[row]?.[col] ?? null;

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
        let possibleMoves = getPossibleMoves(
          state.board,
          row,
          col,
          state.castlingRights
        );

        if (state.isCheck) {
          possibleMoves = possibleMoves.filter(
            ([toRow, toCol]) =>
              !isKingInCheck(
                movePiece(
                  state.board,
                  row,
                  col,
                  toRow,
                  toCol,
                  state.castlingRights
                ).newBoard,
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
        const { newBoard, capturedPiece, newCastlingRights } = movePiece(
          state.board,
          fromRow,
          fromCol,
          row,
          col,
          state.castlingRights
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
          score: newScore,
          castlingRights: newCastlingRights!
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
const getPieceHelper = (board: Board, [row, col]: [number, number]) =>
  board[row]?.[col] ?? null;

function wouldMoveExposeKing(
  board: Board,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number
): boolean {
  const newBoard = board.map(row => [...row]);
  const movingPiece = newBoard?.[fromRow]?.[fromCol] ?? null;

  if (!movingPiece) return false;

  // Make the move
  newBoard[toRow]![toCol] = movingPiece;
  newBoard[fromRow]![fromCol] = null;

  // Check if the move would put the king in check
  return isKingInCheck(newBoard, movingPiece.color);
}

function getPossibleMoves(
  board: Board,
  row: number,
  col: number,
  castlingRights?: CastlingRights
): [number, number][] {
  const piece = getPieceHelper(board, [row, col]);

  if (!piece) return [];

  let moves = Array.of<[number, number]>();

  switch (piece.type) {
    case "pawn":
      moves = getPawnMoves(board, row, col, piece.color);
      break;
    case "rook":
      moves = getRookMoves(board, row, col);
      break;
    case "knight":
      moves = getKnightMoves(board, row, col);
      break;
    case "bishop":
      moves = getBishopMoves(board, row, col);
      break;
    case "queen":
      moves = [
        ...getRookMoves(board, row, col),
        ...getBishopMoves(board, row, col)
      ];
      break;
    case "king":
      moves = getKingMoves(board, row, col);
      // Add castling moves if castling rights are provided
      if (castlingRights) {
        const castlingMoves = getCastlingMoves(
          board,
          piece.color,
          castlingRights
        );
        moves.push(...castlingMoves.map(move => move.kingTo));
      }
      break;
  }
  // Filter out moves that would expose the king to check
  return moves.filter(
    ([toRow, toCol]) => !wouldMoveExposeKing(board, row, col, toRow, toCol)
  );
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
  toCol: number,
  castlingRights?: CastlingRights
): {
  newBoard: Board;
  capturedPiece: Piece | null;
  newCastlingRights?: CastlingRights;
} {
  const newBoard = board && (board.map(row => [...row]) as Board);
  const movingPiece = newBoard[fromRow]?.[fromCol] ?? null;
  const capturedPiece = newBoard[toRow]?.[toCol] ?? null;

  // Update castling rights
  const newCastlingRights = { ...castlingRights };

  if (movingPiece?.type === "king") {
    if (movingPiece.color === "white") {
      newCastlingRights.whiteKingside = false;
      newCastlingRights.whiteQueenside = false;

      // Handle castling move
      if (fromRow === 7 && fromCol === 4) {
        if (toCol === 6) {
          // Kingside castling

          newBoard[7]![5] = newBoard[7]?.[7] ?? null; // Move rook
          newBoard[7]![7] = null;
        } else if (toCol === 2) {
          // Queenside castling
          newBoard[7]![3] = newBoard[7]?.[0] ?? null; // Move rook
          newBoard[7]![0] = null;
        }
      }
    } else {
      newCastlingRights.blackKingside = false;
      newCastlingRights.blackQueenside = false;

      // Handle castling move
      if (fromRow === 0 && fromCol === 4) {
        if (toCol === 6) {
          // Kingside castling
          newBoard[0]![5] = newBoard[0]?.[7] ?? null; // Move rook
          newBoard[0]![7] = null;
        } else if (toCol === 2) {
          // Queenside castling
          newBoard[0]![3] = newBoard[0]?.[0] ?? null; // Move rook
          newBoard[0]![0] = null;
        }
      }
    }
  }

  // Update rook castling rights
  if (movingPiece?.type === "rook") {
    if (fromRow === 7 && fromCol === 0)
      newCastlingRights.whiteQueenside = false;
    if (fromRow === 7 && fromCol === 7) newCastlingRights.whiteKingside = false;
    if (fromRow === 0 && fromCol === 0)
      newCastlingRights.blackQueenside = false;
    if (fromRow === 0 && fromCol === 7) newCastlingRights.blackKingside = false;
  }

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
      const piece = board[row]?.[col] ?? null;
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
      const piece = board[row]?.[col] ?? null;
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
      const piece = board[row]?.[col] ?? null;
      if (piece && piece.color === playerColor) {
        // Get all possible moves for this piece
        const moves = getPossibleMoves(board, row, col);

        // Check if any move resolves the check
        for (const [toRow, toCol] of moves) {
          const newBoard = movePiece(board, row, col, toRow, toCol).newBoard; //castlingRights not needed here
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
