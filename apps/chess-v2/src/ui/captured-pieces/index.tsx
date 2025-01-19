"use client";

import * as ChessIcons from "@d0paminedriven/chess-icons";
import type { MaterialCount } from "@/types/values";
import { cn } from "@/lib/utils";
import { handlePieceIcons, PIECE_VALUES } from "@/types/values";
import { ChessColor } from "@/utils/chess-types";

interface CapturedPiecesEntity {
  capturedPieces: MaterialCount;
  score: number;
  showScore?: boolean;
  className?: string;
  color: ChessColor;
}

export default function CapturedPieces({
  capturedPieces,
  score,
  showScore = false,
  className = "",
  color
}: CapturedPiecesEntity) {
  const toChessGroundColorHelper = (val: "b" | "w" | "white" | "black") => {
    return val === "b" || val === "black" ? "black" : "white";
  };

  // Get the appropriate icon component for each piece

  const getPieceIcon = (
    piece: keyof typeof PIECE_VALUES,
    index: number,
    total: number
  ) => {
    const colorToShow =
      toChessGroundColorHelper(color) === "white" ? "Black" : "White";
    const iconName =
      `${colorToShow}${handlePieceIcons(piece)}` as const as keyof typeof ChessIcons;
    const IconComponent = ChessIcons[iconName];

    return (
      <div
        key={`${piece}-${index}`}
        className={cn("absolute h-5 w-5", index === 0 ? "relative" : `left-0`)}
        style={{
          transform:
            index > 0
              ? `translateX(${piece === "p" ? index * 6 : index * 4}px)`
              : undefined,
          zIndex: total - index
        }}>
        <IconComponent
          className={cn(
            "h-5 w-5",
            colorToShow === "Black" && piece === "p"
              ? "[&_path]:stroke-gray-400/100 [&_path]:[stroke-width:0.5px]"
              : ""
          )}
        />
      </div>
    );
  };

  // Create arrays of icons for each piece type
  const pieceGroups = Object.entries(capturedPieces)
    .filter(([_, count]) => count > 0) // Only show pieces that have been captured
    .sort(([pieceA], [pieceB]) => {
      // Sort by piece value (lowest to highest)
      return (
        PIECE_VALUES[pieceA as keyof typeof PIECE_VALUES] -
        PIECE_VALUES[pieceB as keyof typeof PIECE_VALUES]
      );
    })
    .map(([piece, count]) => {
      const pieceType = piece as keyof typeof PIECE_VALUES;
      // const maxWidth = pieceType === "p" ? 118 : count * 4 + 20; // 104px for pawns, dynamic for others
      return (
        <div
          key={piece}
          className={cn("relative flex h-5 w-auto grow items-center")}
          // style={{ width: `${maxWidth}px` }}>
        >
          {Array.from({ length: count }, (_, i) =>
            getPieceIcon(pieceType, i, count)
          )}
        </div>
      );
    });

  return (
    <div className={cn("flex flex-nowrap items-center gap-1", className)}>
      <div className="flex flex-nowrap items-center gap-1">{pieceGroups}</div>
      {showScore && score > 0 && (
        <span className="text-sm font-medium text-white">&nbsp;+{score}</span>
      )}
    </div>
  );
}

// "use client";

// import * as ChessIcons from "@d0paminedriven/chess-icons";
// import type { MaterialCount } from "@/types/values";
// import type { ChessColor } from "@/utils/chess-types";
// import { toChessGroundColorHelper } from "@/lib/color-helper";
// import { cn } from "@/lib/utils";
// import { handlePieceIcons, PIECE_VALUES } from "@/types/values";

// interface CapturedPiecesProps {
//   capturedPieces: MaterialCount;
//   score: number;
//   showScore?: boolean;
//   className?: string;
//   color: ChessColor;
// }

// export default function CapturedPieces({
//   capturedPieces,
//   score,
//   showScore = false,
//   className = "",
//   color
// }: CapturedPiecesProps) {
//   // Get the appropriate icon component for each piece
//   const getPieceIcon = (
//     piece: keyof typeof PIECE_VALUES,
//     index: number,
//     total: number
//   ) => {
//     const colorToShow =
//       toChessGroundColorHelper(color) === "white" ? "Black" : "White";
//     const iconName =
//       `${colorToShow}${handlePieceIcons(piece)}` as const as keyof typeof ChessIcons;
//     const IconComponent = ChessIcons[iconName];

//     return (
//       <div
//         key={`${piece}-${index}`}
//         className={cn("absolute h-5 w-5", index === 0 ? "relative" : `left-0`)}
//         style={{
//           transform: index > 0 ? `translateX(${index * 6}px)` : undefined,
//           zIndex: total - index
//         }}>
//         <IconComponent
//           className={cn(
//             "h-5 w-5",
//             colorToShow === "Black" && piece === "p"
//               ? "[&_path]:stroke-gray-400/100 [&_path]:[stroke-width:0.5px]"
//               : ""
//           )}
//         />
//       </div>
//     );
//   };

//   // Create arrays of icons for each piece type
//   const pieceGroups = Object.entries(capturedPieces)
//     .filter(([_, count]) => count > 0) // Only show pieces that have been captured
//     .sort(([pieceA], [pieceB]) => {
//       // Sort by piece value (lowest to highest)
//       return (
//         PIECE_VALUES[pieceA as keyof typeof PIECE_VALUES] -
//         PIECE_VALUES[pieceB as keyof typeof PIECE_VALUES]
//       );
//     })
//     .map(([piece, count]) => {
//       const pieceType = piece as keyof typeof PIECE_VALUES;
//       return (
//         <div
//           key={piece}
//           className={cn(
//             "relative flex h-5 items-center",
//             count > 1 && pieceType === "p" ? `w-[${count * 7}px]` : ""
//           )}>
//           {Array.from({ length: count }, (_, i) =>
//             getPieceIcon(pieceType, i, count)
//           )}
//         </div>
//       );
//     });

//   return (
//     <div className={cn("flex items-center gap-2", className)}>
//       <div className="flex items-center gap-2">{pieceGroups}</div>
//       {showScore && score > 0 && (
//         <span className="text-sm font-medium text-white">&nbsp;+{score}</span>
//       )}
//     </div>
//   );
// }
