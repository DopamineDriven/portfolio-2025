import type { TsxExclude } from "@/types/helpers";
import { cn } from "@/lib/utils";
import {
  BlackBishop,
  BlackKing,
  BlackKnight,
  BlackPawn,
  BlackQueen,
  BlackRook,
  WhiteBishop,
  WhiteKing,
  WhiteKnight,
  WhitePawn,
  WhiteQueen,
  WhiteRook
} from "./chess-piece-workup";

const components = {
  "white-king": WhiteKing,
  "white-queen": WhiteQueen,
  "white-rook": WhiteRook,
  "white-bishop": WhiteBishop,
  "white-knight": WhiteKnight,
  "white-pawn": WhitePawn,
  "black-king": BlackKing,
  "black-queen": BlackQueen,
  "black-rook": BlackRook,
  "black-bishop": BlackBishop,
  "black-knight": BlackKnight,
  "black-pawn": BlackPawn
} as const;

type InferColorOrType<
  T,
  V extends "color" | "type"
> = T extends `${infer Color}-${infer Piece}`
  ? V extends "color"
    ? Color
    : Piece
  : T;

const getComponentTargeted = (props: keyof typeof components) => {
  return components[props];
};

export type GetPieceComponentProps = {
  pieceType: InferColorOrType<keyof typeof components, "type">;
  pieceColor: InferColorOrType<keyof typeof components, "color">;
} & TsxExclude<"svg", "fill" | "viewBox" | "xmlns">;

export function getPieceComponent(
  type: InferColorOrType<keyof typeof components, "type">,
  color: InferColorOrType<keyof typeof components, "color">
) {
  return getComponentTargeted(`${color}-${type}`);
}

export function getPieceComponentJsxElement({
  pieceColor,
  pieceType,
  className,
  ...rest
}: GetPieceComponentProps) {
  const TargetedComponent = getComponentTargeted(`${pieceColor}-${pieceType}`);
  return (
    <TargetedComponent className={cn("h-full w-full", className)} {...rest} />
  );
}

export function getCapturedPieceJsxElement(  type: InferColorOrType<keyof typeof components, "type">,
  color: InferColorOrType<keyof typeof components, "color">) {
  const TargetedComponent = getComponentTargeted(`${color}-${type}`);
  return (
    <TargetedComponent className="w-full h-full" />
  );
}
