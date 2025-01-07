"use-client";

import { useCallback, useEffect, useReducer } from "react";
import type {
  Board,
  CastlingMove,
  CastlingRights,
  GameAction,
  GameState,
  Move,
  Piece,
  PieceColor,
  PieceType
} from "@/types/chess";
import { useToast } from "@/hooks/use-toast";
import {
  copyBoard,
  getPiece,
  isValidPosition,
  setPiece
} from "@/lib/board-utils";
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
  possibleMoves: Array.of<[number, number]>(),
  isCheck: false,
  isCheckmate: false,
  capturedPieces: {
    white: Array.of<Piece>(),
    black: Array.of<Piece>()
  },
  score: {
    white: 0,
    black: 0
  },
  castlingRights: INITIAL_CASTLING_RIGHTS,
  lastMove: null,
  promotionSquare: null
} satisfies GameState;

function isSquareUnderAttack(
  board: Board,
  square: [number, number],
  attackingColor: PieceColor
) {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = getPiece(board, row, col);
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
      !board[row]?.[5] &&
      !board[row]?.[6] && // Squares between king and rook are empty
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
      !board[row]?.[1] &&
      !board[row]?.[2] &&
      !board[row]?.[3] && // Squares between king and rook are empty
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
      const piece = getPiece(state.board, row, col);

      if (
        state.selectedSquare &&
        state.selectedSquare[0] === row &&
        state.selectedSquare[1] === col
      ) {
        return {
          ...state,
          selectedSquare: null,
          possibleMoves: Array.of<[number, number]>()
        };
      }

      if (piece && piece.color === state.currentPlayer) {
        let possibleMoves =
          piece.type === "pawn"
            ? getPawnMoves(state.board, row, col, piece.color, state.lastMove)
            : getPossibleMoves(state.board, row, col, state.castlingRights);

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
                  state.castlingRights,
                  state.lastMove
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
        const { newBoard, capturedPiece, newCastlingRights, enPassantCapture } =
          movePiece(
            state.board,
            fromRow,
            fromCol,
            row,
            col,
            state.castlingRights,
            state.lastMove
          );
        const nextPlayer = state.currentPlayer === "white" ? "black" : "white";
        const isCheck = isKingInCheck(newBoard, nextPlayer);
        const isCheckmate =
          isCheck &&
          isCheckmateState(newBoard, nextPlayer, {
            ...state,
            board: newBoard,
            castlingRights: newCastlingRights
          });

        // Update captured pieces and score
        const newCapturedPieces = { ...state.capturedPieces };
        const newScore = { ...state.score };

        if (capturedPiece || enPassantCapture) {
          const capturingColor = state.currentPlayer;
          if (capturedPiece) {
            newCapturedPieces[capturingColor] = [
              ...newCapturedPieces[capturingColor],
              capturedPiece
            ];
            newScore[capturingColor] += PIECE_VALUES[capturedPiece.type];
          }
        }

        const movingPiece = getPiece(state.board, fromRow, fromCol);
        if (!movingPiece) {
          throw new Error("No piece to move");
        }

        const newLastMove = {
          from: [fromRow, fromCol] as [number, number],
          to: [row, col] as [number, number],
          piece: movingPiece
        } satisfies Move;
        // Check for pawn promotion
        let promotionSquare: [number, number] | null = null;
        if (movingPiece.type === "pawn" && (row === 0 || row === 7)) {
          promotionSquare = [row, col];
        }
        return {
          ...state,
          board: newBoard,
          currentPlayer: nextPlayer,
          selectedSquare: null,
          possibleMoves: [],
          isCheck,
          isCheckmate,
          capturedPieces: newCapturedPieces,
          score: newScore,
          castlingRights: newCastlingRights,
          lastMove: newLastMove,
          promotionSquare
        };
      }

      return {
        ...state,
        selectedSquare: null,
        possibleMoves: []
      };
    }

    case "PROMOTE_PAWN": {
      const { square, pieceType } = action.payload;
      const [row, col] = square;
      const newBoard = copyBoard(state.board);
      const pawn = getPiece(newBoard, row, col);

      if (pawn && pawn.type === "pawn") {
        setPiece(newBoard, row, col, { type: pieceType, color: pawn.color });

        // Adjust the score
        const promotedPieceValue = PIECE_VALUES[pieceType];
        const pawnValue = PIECE_VALUES["pawn"];
        const scoreAdjustment = promotedPieceValue - pawnValue;

        const newScore = { ...state.score };
        newScore[pawn.color] += scoreAdjustment;

        return {
          ...state,
          board: newBoard,
          promotionSquare: null,
          score: newScore
        };
      }

      return state;
    }

    case "RESET_GAME":
      return initialState;

    default:
      return state;
  }
}

function wouldMoveExposeKing(
  board: Board,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number
) {
  const newBoard = copyBoard(board);
  const movingPiece = getPiece(newBoard, fromRow, fromCol);

  if (!movingPiece) return false;

  // Make the move
  setPiece(newBoard, toRow, toCol, movingPiece);
  setPiece(newBoard, fromRow, fromCol, null);

  // Find the king's position
  let kingRow = -1;
  let kingCol = -1;
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const piece = getPiece(newBoard, r, c);
      if (piece?.type === "king" && piece.color === movingPiece.color) {
        kingRow = r;
        kingCol = c;
        break;
      }
    }
    if (kingRow !== -1) break;
  }

  // Check if any opponent's piece can attack the king
  const opponentColor = movingPiece.color === "white" ? "black" : "white";
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const piece = getPiece(newBoard, r, c);
      if (piece && piece.color === opponentColor) {
        if (canPieceAttackSquare(newBoard, r, c, kingRow, kingCol)) {
          return true;
        }
      }
    }
  }

  return false;
}

function canPieceAttackSquare(
  board: Board,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number
) {
  const piece = getPiece(board, fromRow, fromCol);
  if (!piece) return false;

  // First check if the move is theoretically possible for the piece type
  const isValidPattern = (() => {
    switch (piece.type) {
      case "pawn":
        // eslint-disable-next-line no-case-declarations
        const direction = piece.color === "white" ? -1 : 1;
        return fromRow + direction === toRow && Math.abs(fromCol - toCol) === 1;
      case "rook":
        return fromRow === toRow || fromCol === toCol;
      case "knight":
        // eslint-disable-next-line no-case-declarations
        const rowDiff = Math.abs(fromRow - toRow);
        // eslint-disable-next-line no-case-declarations
        const colDiff = Math.abs(fromCol - toCol);
        return (
          (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)
        );
      case "bishop":
        return Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol);
      case "queen":
        return (
          fromRow === toRow ||
          fromCol === toCol ||
          Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol)
        );
      case "king":
        return Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1;
      default:
        return false;
    }
  })();

  if (!isValidPattern) return false;

  // For pieces that can be blocked (all except knight), check if there are any pieces in the way
  if (piece.type !== "knight") {
    const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
    const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;

    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;

    // Check all squares between the piece and the target (exclusive)
    while (currentRow !== toRow || currentCol !== toCol) {
      if (board[currentRow]?.[currentCol] != null) {
        return false; // There's a piece blocking the path
      }
      currentRow += rowStep;
      currentCol += colStep;
    }
  }

  return true;
}

function getPossibleMoves(
  board: Board,
  row: number,
  col: number,
  castlingRights?: CastlingRights
) {
  const piece = getPiece(board, row, col);

  if (!piece) return [];

  let moves = Array.of<[number, number]>();

  switch (piece.type) {
    case "pawn":
      // null for lastMove as it's not relevant when assessing possible moves to make
      moves = getPawnMoves(board, row, col, piece.color, null);
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
  color: PieceColor,
  lastMove: Move | null
) {
  const moves = Array.of<[number, number]>();
  const direction = color === "white" ? -1 : 1;

  // Forward move
  if (
    isValidPosition(row + direction, col) &&
    !getPiece(board, row + direction, col)
  ) {
    moves.push([row + direction, col]);

    // Double forward move for pawns on their starting row
    if ((color === "white" && row === 6) || (color === "black" && row === 1)) {
      if (!getPiece(board, row + 2 * direction, col)) {
        moves.push([row + 2 * direction, col]);
      }
    }
  }

  // Diagonal captures
  for (const colOffset of [-1, 1]) {
    const newCol = col + colOffset;
    if (isValidPosition(row + direction, newCol)) {
      const targetPiece = getPiece(board, row + direction, newCol);
      if (targetPiece && targetPiece.color !== color) {
        moves.push([row + direction, newCol]);
      }
    }
  }

  // En passant
  if (
    lastMove &&
    lastMove.piece.type === "pawn" &&
    Math.abs(lastMove.from[0] - lastMove.to[0]) === 2 &&
    lastMove.to[0] === row &&
    Math.abs(lastMove.to[1] - col) === 1
  ) {
    moves.push([row + direction, lastMove.to[1]]);
  }

  return moves;
}

function getRookMoves(board: Board, row: number, col: number) {
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
      if (!board[newRow]?.[newCol]) {
        moves.push([newRow, newCol]);
      } else {
        if (board[newRow]?.[newCol]?.color !== board[row]?.[col]?.color) {
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

function getKnightMoves(board: Board, row: number, col: number) {
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
        !board[newRow]?.[newCol] ||
        board[newRow][newCol].color !== board[row]?.[col]?.color
      ) {
        moves.push([newRow, newCol]);
      }
    }
  }

  return moves;
}

function getBishopMoves(board: Board, row: number, col: number) {
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
      if (!board[newRow]?.[newCol]) {
        moves.push([newRow, newCol]);
      } else {
        if (board[newRow]?.[newCol]?.color !== board[row]?.[col]?.color) {
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

function getKingMoves(board: Board, row: number, col: number) {
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
        !board[newRow]?.[newCol] ||
        board[newRow][newCol].color !== board[row]?.[col]?.color
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
) {
  return possibleMoves.some(([r, c]) => r === row && c === col);
}

function movePiece(
  board: Board,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  castlingRights: CastlingRights,
  lastMove: Move | null
) {
  const newBoard = copyBoard(board);
  const movingPiece = getPiece(newBoard, fromRow, fromCol);
  let capturedPiece = getPiece(newBoard, toRow, toCol);

  if (!movingPiece) {
    throw new Error("No piece to move");
  }

  // Update castling rights
  const newCastlingRights = { ...castlingRights };

  let enPassantCapture = false;
  // en passant handling
  if (
    movingPiece.type === "pawn" &&
    lastMove &&
    lastMove.piece.type === "pawn" &&
    Math.abs(lastMove.from[0] - lastMove.to[0]) === 2 &&
    lastMove.to[0] === fromRow &&
    lastMove.to[1] === toCol &&
    Math.abs(fromCol - toCol) === 1
  ) {
    capturedPiece = getPiece(newBoard, lastMove.to[0], lastMove.to[1]);
    setPiece(newBoard, lastMove.to[0], lastMove.to[1], null);
    enPassantCapture = true;
  }
  if (movingPiece.type === "king") {
    if (movingPiece.color === "white") {
      newCastlingRights.whiteKingside = false;
      newCastlingRights.whiteQueenside = false;

      // Handle castling move
      if (fromRow === 7 && fromCol === 4) {
        if (toCol === 6) {
          // Kingside castling
          setPiece(newBoard, 7, 5, getPiece(newBoard, 7, 7));
          setPiece(newBoard, 7, 7, null);
        } else if (toCol === 2) {
          // Queenside castling
          setPiece(newBoard, 7, 3, getPiece(newBoard, 7, 0));
          setPiece(newBoard, 7, 0, null);
        }
      }
    } else {
      newCastlingRights.blackKingside = false;
      newCastlingRights.blackQueenside = false;

      // Handle castling move
      if (fromRow === 0 && fromCol === 4) {
        if (toCol === 6) {
          // Kingside castling
          setPiece(newBoard, 0, 5, getPiece(newBoard, 0, 7));
          setPiece(newBoard, 0, 7, null);
        } else if (toCol === 2) {
          // Queenside castling
          setPiece(newBoard, 0, 3, getPiece(newBoard, 0, 0));
          setPiece(newBoard, 0, 0, null);
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

  setPiece(newBoard, toRow, toCol, movingPiece);
  setPiece(newBoard, fromRow, fromCol, null);

  return {
    newBoard,
    capturedPiece,
    newCastlingRights: newCastlingRights,
    enPassantCapture
  } satisfies {
    newBoard: Board;
    capturedPiece: Piece | null;
    newCastlingRights: CastlingRights;
    enPassantCapture: boolean;
  };
}

function isKingInCheck(board: Board, playerColor: PieceColor) {
  let kingPosition: [number, number] | null = null;
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = getPiece(board, row, col);
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
      const piece = getPiece(board, row, col);
      if (piece && piece.color === opponentColor) {
        const moves = getPossibleMoves(board, row, col);
        if (
          moves.some(([r, c]) => r === kingPosition[0] && c === kingPosition[1])
        ) {
          return true;
        }
      }
    }
  }

  return false;
}

function isCheckmateState(
  board: Board,
  playerColor: PieceColor,
  state: GameState
) {
  // Check all pieces for the current player
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = getPiece(board, row, col);
      if (piece && piece.color === playerColor) {
        // Get all possible moves for this piece
        const moves = getPossibleMoves(board, row, col, state.castlingRights);

        // Check if any move resolves the check
        for (const [toRow, toCol] of moves) {
          const newBoard = movePiece(
            board,
            row,
            col,
            toRow,
            toCol,
            state.castlingRights,
            state.lastMove
          ).newBoard;
          if (!isKingInCheck(newBoard, playerColor)) {
            // If we find a move that resolves the check, it's not checkmate
            return false;
          }
        }
      }
    }
  }
  // If there are 0 moves to resolve check, it's checkmate
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

  const promotePawn = useCallback(
    (square: [number, number], pieceType: PieceType) => {
      dispatch({ type: "PROMOTE_PAWN", payload: { square, pieceType } });
    },
    []
  );

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
    resetGame,
    promotePawn
  };
}
