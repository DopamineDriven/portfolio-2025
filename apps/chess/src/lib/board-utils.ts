import type { Board, Piece } from "@/types/chess";
import { BOARD_SIZE } from "@/lib/constants";

/**
 * Type guard to check if a position is within the board bounds
 */
export function isValidPosition(row: number, col: number) {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

/**
 * Safely get a piece from the board, returns null if out of bounds
 */
export function getPiece(board: Board, row: number, col: number) {
  if (!isValidPosition(row, col)) return null;
  return (board[row]?.[col] ?? null) satisfies Piece | null;
}

/**
 * Safely set a piece on the board, returns false if out of bounds
 */
export function setPiece(
  board: Board,
  row: number,
  col: number,
  piece: Piece | null
) {
  if (!isValidPosition(row, col)) return false;

  // Check if the row exists, if not, create it
  if (!board[row]) {
    board[row] = [];
  }

  // Now we can safely assign the piece
  board[row][col] = piece;
  return true;
}

/**
 * Create a deep copy of the board
 */
export function copyBoard(board: Board) {
  return board.map(row => [...row]) satisfies Board;
}
