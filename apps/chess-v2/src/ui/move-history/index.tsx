"use client";

import type { Move } from "chess.js";
import type { LucideProps } from "lucide-react";
import type {
  CSSProperties,
  FC,
  ForwardRefExoticComponent,
  RefAttributes
} from "react";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, History, Info } from "lucide-react";
import { FixedSizeList as List } from "react-window";
import { useGame } from "@/contexts/game-context";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/atoms/button";
import { useChessWebSocketContext } from "@/contexts/chess-websocket-context";

const ITEM_SIZE = 36; // Height of each move item in pixels
const MOVE_HISTORY_WIDTH = 256; // Width of the move history panel in pixels

interface Tab {
  id: "moves" | "analysis";
  name: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}

const tabs = [
  { id: "moves", name: "Moves", icon: History },
  { id: "analysis", name: "Analysis", icon: Info }
] satisfies Tab[];

interface MoveItemProps {
  index: number;
  style: CSSProperties;
  data: {
    moveHistory: Move[];
    currentMoveIndex: number;
    goToMove: (index: number) => void;
    comments: Record<string, string>;
  };
}

const MoveItem: FC<MoveItemProps> = ({ index, style, data }) => {
  const { moveHistory, currentMoveIndex, goToMove, comments } = data;
  const moveIndex = index * 2;
  const whiteMove = moveHistory[moveIndex];
  const blackMove = moveHistory[moveIndex + 1];
  const wAfter = whiteMove?.after ?? "";
  const bAfter = blackMove?.after ?? "";
  return (
    <div style={style} className="flex items-center hover:bg-gray-600">
      <div className="w-10 px-2 py-1 text-gray-400">{index + 1}.</div>
      <div
        className={cn(
          moveIndex === currentMoveIndex ? "font-semibold underline" : "",
          "w-1/2 cursor-pointer px-2 py-1 font-mono hover:underline"
        )}
        onClick={() => goToMove(moveIndex)}>
        {whiteMove?.san ?? ""}
        {comments[wAfter] && (
          <span className="ml-1 text-xs text-gray-400">{comments[wAfter]}</span>
        )}
      </div>
      <div
        className={cn(
          moveIndex + 1 === currentMoveIndex ? "font-semibold underline" : "",
          "w-1/2 cursor-pointer px-2 py-1 font-mono hover:underline"
        )}
        onClick={() => goToMove(moveIndex + 1)}>
        {blackMove?.san ?? ""}
        {comments[bAfter] && (
          <span className="ml-1 text-xs text-gray-400">{comments[bAfter]}</span>
        )}
      </div>
    </div>
  );
};

const AnalysisPanel: FC = () => {
  const { chessApiEvaluation, isConnected } = useChessWebSocketContext();

  return (
    <div className="h-full p-4 text-white">
      <div className="space-y-4">
        {chessApiEvaluation ? (
          <>
            <p>{chessApiEvaluation.text}</p>
            {chessApiEvaluation.continuationArr && (
              <div className="mt-2">
                <h4 className="font-semibold">Suggested continuation:</h4>
                <p>{chessApiEvaluation.continuationArr.join(", ")}</p>
              </div>
            )}
          </>
        ) : (
          <p>
            {isConnected
              ? "Waiting for evaluation..."
              : "Connecting to analysis server..."}
          </p>
        )}
      </div>
    </div>
  );
};

export default function MoveHistory() {
  const {
    moveHistory,
    currentMoveIndex,
    goToMove,
    canGoForward,
    canGoBackward,
    goForward,
    goBackward,
    getComments
  } = useGame();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab["id"]>("moves");
  const listRef = useRef<List>(null);
  const comments = getComments().reduce(
    (acc, comment) => {
      acc[comment.fen] = comment.comment;
      return acc;
    },
    {} as Record<string, string>
  );

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToItem(Math.floor(currentMoveIndex / 2), "smart");
    }
  }, [currentMoveIndex]);

  const itemData = {
    moveHistory,
    currentMoveIndex,
    goToMove,
    comments
  };

  return (
    <div
      className={cn(
        isExpanded ? "w-64" : "w-12",
        `fixed right-0 top-0 z-40 h-full bg-gray-700 transition-all duration-300 ease-in-out`
      )}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -left-4 top-1/2 -translate-y-1/2 transform rounded-l-md bg-gray-700 text-white"
        onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? <ChevronRight /> : <Info />}
      </Button>

      {isExpanded && (
        <div className="flex h-full flex-col">
          <div className="border-b border-gray-600">
            <nav className="-mb-px flex" aria-label="Tabs">
              {tabs.map(tab => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex w-1/2 items-center justify-center gap-2 border-b-2 px-1 py-4 text-center text-sm font-medium",
                      activeTab === tab.id
                        ? "border-white text-white"
                        : "border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-300"
                    )}>
                    <TabIcon className="h-4 w-4" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {activeTab === "moves" && (
            <div className="flex flex-1 flex-col">
              <div className="flex justify-between p-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goBackward}
                  disabled={!canGoBackward}
                  className="text-white">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goForward}
                  disabled={!canGoForward}
                  className="text-white">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-hidden">
                <List
                  ref={listRef}
                  height={window.innerHeight - 200}
                  itemCount={Math.ceil(moveHistory.length / 2)}
                  itemSize={ITEM_SIZE}
                  width={MOVE_HISTORY_WIDTH - 32}
                  itemData={itemData}>
                  {MoveItem}
                </List>
              </div>
            </div>
          )}

          {activeTab === "analysis" && <AnalysisPanel />}
        </div>
      )}
    </div>
  );
}

// "use client";

// import type { Move } from "chess.js";
// import React, { useEffect, useRef, useState } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { FixedSizeList as List } from "react-window";
// import { useGame } from "@/contexts/game-context";
// import { cn } from "@/lib/utils";
// import { Button } from "@/ui/atoms/button";

// const ITEM_SIZE = 30; // Height of each move item in pixels
// const MOVE_HISTORY_WIDTH = 256; // Width of the move history panel in pixels

// interface MoveItemProps {
//   index: number;
//   style: CSSProperties;
//   data: {
//     moveHistory: Move[];
//     currentMoveIndex: number;
//     goToMove: (index: number) => void;
//   };
// }

// // Move Virtualization for performance optimization
// const MoveItem: FC<MoveItemProps> = ({ index, style, data }) => {
//   const { moveHistory, currentMoveIndex, goToMove } = data;
//   const moveIndex = index * 2;
//   const whiteMove = moveHistory[moveIndex];
//   const blackMove = moveHistory[moveIndex + 1];

//   return (
//     <div style={style} className="flex items-center hover:bg-gray-600">
//       <div className="w-10 px-2 py-1 text-gray-400">{index + 1}.</div>
//       <div
//         className={cn(
//           moveIndex === currentMoveIndex ? "font-semibold underline" : "",
//           "w-1/2 cursor-pointer px-2 py-1 font-mono hover:underline"
//         )}
//         onClick={() => goToMove(moveIndex)}>
//         {whiteMove?.san ?? ""}
//       </div>
//       <div
//         className={cn(
//           moveIndex + 1 === currentMoveIndex ? "font-semibold underline" : "",
//           "w-1/2 cursor-pointer px-2 py-1 font-mono hover:underline"
//         )}
//         onClick={() => goToMove(moveIndex + 1)}>
//         {blackMove?.san ?? ""}
//       </div>
//     </div>
//   );
// };

// export default function MoveHistory() {
//   const {
//     moveHistory,
//     currentMoveIndex,
//     goToMove,
//     canGoForward,
//     canGoBackward,
//     goForward,
//     goBackward
//   } = useGame();
//   const [isExpanded, setIsExpanded] = useState(false);
//   const listRef = useRef<List>(null);

//   useEffect(() => {
//     if (listRef.current) {
//       listRef.current.scrollToItem(Math.floor(currentMoveIndex / 2), "smart");
//     }
//   }, [currentMoveIndex]);

//   const itemData = {
//     moveHistory,
//     currentMoveIndex,
//     goToMove
//   };
//   return (
//     <div
//       className={cn(
//         isExpanded ? "w-64" : "w-12",
//         `fixed right-0 top-0 z-40 h-full bg-gray-700 transition-all duration-300 ease-in-out`
//       )}>
//       <Button
//         variant="ghost"
//         size="icon"
//         className="absolute -left-4 top-1/2 -translate-y-1/2 transform rounded-l-md bg-gray-700 text-white"
//         onClick={() => setIsExpanded(!isExpanded)}>
//         {isExpanded ? <ChevronRight /> : <ChevronLeft />}
//       </Button>
//       {isExpanded && (
//         <div className="h-full p-4">
//           <h2 className="mb-2 text-xl font-bold text-white">Move History</h2>
//           <div className="mb-2 flex justify-between">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={goBackward}
//               disabled={!canGoBackward}
//               className="text-white">
//               <ChevronLeft className="h-4 w-4" />
//             </Button>
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={goForward}
//               disabled={!canGoForward}
//               className="text-white">
//               <ChevronRight className="h-4 w-4" />
//             </Button>
//           </div>
//           <div className="h-[calc(100%-3rem)]">
//             <List
//               ref={listRef}
//               height={window.innerHeight - 200} // Adjust based on layout
//               itemCount={Math.ceil(moveHistory.length / 2)}
//               itemSize={ITEM_SIZE}
//               width={MOVE_HISTORY_WIDTH - 32} // Subtract padding
//               itemData={itemData}>
//               {MoveItem}
//             </List>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
