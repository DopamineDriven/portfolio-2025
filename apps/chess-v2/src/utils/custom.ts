import { Unenumerate } from "@/types/helpers";

export const colors = ["white", "black"] as const;
export const roles = [
  "pawn",
  "knight",
  "bishop",
  "rook",
  "queen",
  "king"
] as const;
export const files = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
export const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"] as const;
export const invRanks = [...ranks].sort(
  (a, b) => a.localeCompare(b) - b.localeCompare(a)
);



export function ArrReducer<const V extends readonly `${string | number}`[]>(
  props: V
) {
  return props.reduce(p => p) as Unenumerate<V>;
}
export type Reducer<T extends readonly `${string | number}`[]> = ReturnType<
  typeof ArrReducer<T>
>;
export const color = ArrReducer(colors);
export type Color = typeof color;

export const role = ArrReducer(roles);

export type Role = typeof role;
export const file = ArrReducer(files);
export type File = typeof file;

export const rank = ArrReducer(ranks);
export type Rank = typeof rank;

export interface Piece {
  role: Role;
  color: Color;
  promoted?: boolean;
}

export type Pieces = Map<Key, Piece>;

export const allKeys = (
  [...files.map(c => ranks.map(r => `${c}${r}` as const))] as const
).reduce(p => p);




// export type ComputeRange<
//   N extends number,
//   Result extends unknown[] | readonly unknown[] = []
// > = Result["length"] extends N
//   ? Result
//   : ComputeRange<N, [...Result, Result["length"]]>;

export const pos2key = (pos: readonly [number, number]) =>
  allKeys[8 * pos[0] + pos[1]]!;

export type Key = Unenumerate<typeof allKeys>;

export const initialFen =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR" as const;
export const startingFen =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export function isDigit(c: string): boolean {
  return /^[0-9]$/.test(c);
}

export const fenValidator = (props: string) => {
  return /^([1-8PNBRQK]+\/){7}[1-8PNBRQK]+$/gim.test(props);
};

export type FenErrorType =
  | "ONE_FIELD"
  | "SIX_FIELDS"
  | "ROWS_LENGTH"
  | "CONSECUTIVE"
  | "INVALID_PIECE"
  | "ROW_TOO_LARGE"
  | "ACTIVE_COLOR"
  | "CASTLING"
  | "EN_PASSANT"
  | "HALF_MOVE"
  | "FULL_MOVE"
  | "KINGS"
  | "PAWNS";

export function validateFen(
  fen: string,
  options: { positionOnly?: boolean; legal?: boolean } = {}
): Partial<Record<FenErrorType, string>> {
  const { positionOnly, legal } = options;
  const errors: Partial<Record<FenErrorType, string>> = {};

  const tokens = fen.split(/\s+/);
  if (positionOnly && tokens.length !== 1) {
    return {
      ONE_FIELD: "Must contain only one field for position-only validation"
    };
  }

  if (!positionOnly && tokens.length !== 6) {
    return {
      SIX_FIELDS: "Must contain six space-delimited fields"
    };
  }

  const position = tokens[0];
  const color = tokens[1];
  const castling = tokens[2];
  const enPassant = tokens[3];
  const halfMove = parseInt(tokens[4]!, 10);
  const moveNumber = parseInt(tokens[5]!, 10);

  // 1st field: Piece positions
  const rows = position?.split("/");
  if (rows?.length !== 8) {
    errors.ROWS_LENGTH =
      "Piece placement does not contain 8 '/'-delimited rows";
  }
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < rows!.length; i++) {
    // Check for right sum of fields AND not two numbers in succession
    let sum_fields = 0;
    let previous_was_number = false;
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let k = 0; k < rows![i]!.length; k++) {
      if (isDigit(rows![i]![k]!)) {
        if (previous_was_number) {
          errors.CONSECUTIVE =
            "Piece placement is invalid (consecutive numbers)";
        }
        sum_fields += parseInt(rows![i]![k]!, 10);
        previous_was_number = true;
      } else {
        if (!/^[prnbqkPRNBQK]$/.test(rows![i]![k]!)) {
          errors.INVALID_PIECE = "Piece placement invalid (invalid piece)";
        }
        sum_fields += 1;
        previous_was_number = false;
      }
    }
    if (sum_fields !== 8) {
      errors.ROW_TOO_LARGE =
        "Piece placement is invalid (too many squares in rank)";
    }
  }

  if (legal) {
    if (position?.split("K").length !== 2 || position.split("k").length !== 2) {
      errors.KINGS = "Piece placement must contain two kings";
    }

    if (
      Array.from(rows![0]! + rows![7]).some(char => char.toUpperCase() === "P")
    ) {
      errors.PAWNS =
        "Piece placement must not contain pawns on the first or last rank";
    }
  }

  if (positionOnly) return errors;

  // 2nd field: Side to move
  if (!/^(w|b)$/.test(color ?? "")) {
    errors.ACTIVE_COLOR = "Active color is invalid";
  }

  // 3rd field: Castling availability
  if (!/^(KQ?k?q?|Qk?q?|kq?|q|-)$/.test(castling ?? "")) {
    errors.CASTLING = "Castling availability is invalid";
  }

  // 4th field: En passant square
  if (
    (enPassant![1] === "3" && color === "w") ||
    (enPassant![1] === "6" && color == "b") ||
    !/^(-|[abcdefgh][36])$/.test(enPassant ?? "")
  ) {
    errors.EN_PASSANT = "En-passant square is invalid";
  }

  // 5th field: Half move clock
  if (isNaN(halfMove) || halfMove < 0) {
    errors.HALF_MOVE = "Half move clock must be a non-negative integer";
  }

  // 6th field: Full move number
  if (isNaN(moveNumber) || moveNumber <= 0) {
    errors.FULL_MOVE = "Full move number must be a positive integer";
  }

  return errors;
}

const rolesFen: { [letter: string]: Role } = {
  p: "pawn",
  r: "rook",
  n: "knight",
  b: "bishop",
  q: "queen",
  k: "king"
};

const letters = {
  pawn: "p",
  rook: "r",
  knight: "n",
  bishop: "b",
  queen: "q",
  king: "k"
};

export type FEN = string;

export function read(fen: FEN): Pieces {
  if (fen === "start") fen = initialFen;
  const pieces: Pieces = new Map();
  let row = 7,
    col = 0;
  for (const c of fen) {
    switch (c) {
      case " ":
      case "[":
        return pieces;
      case "/":
        --row;
        if (row < 0) return pieces;
        col = 0;
        break;
      case "~": {
        const piece = pieces.get(pos2key([col - 1, row]));
        if (piece) piece.promoted = true;
        break;
      }
      default: {
        const nb = c.charCodeAt(0);
        if (nb < 57) col += nb - 48;
        else {
          const role = c.toLowerCase();
          pieces.set(pos2key([col, row]), {
            role: rolesFen![role]!,
            color: c === role ? "black" : "white"
          });
          ++col;
        }
      }
    }
  }
  return pieces;
}

export function write(pieces: Pieces): FEN {
  return invRanks
    .map(y =>
      files
        .map(x => {
          const piece = pieces.get((x + y) as Key);
          if (piece) {
            let p = letters[piece.role];
            if (piece.color === "white") p = p.toUpperCase();
            if (piece.promoted) p += "~";
            return p;
          } else return "1";
        })
        .join("")
    )
    .join("/")
    .replace(/1{2,}/g, s => s.length.toString());
}

console.log(read("r1k4r/p2nb1p1/2b4p/1p1n1p2/2PP4/3Q1NB1/1P3PPP/R5K1 b - - 0 19"));


const stockfishPath = new URL("../../public/stockfish.js", import.meta.url);
console.log(stockfishPath);
