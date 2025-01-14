"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGame } from "@/contexts/game-context";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/atoms/button";

export default function MoveHistory() {
  const { moves } = useGame();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [moves]);

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
        {isExpanded ? <ChevronRight /> : <ChevronLeft />}
      </Button>
      {isExpanded && (
        <div className="h-full p-4">
          <h2 className="mb-2 text-xl font-bold text-white">Move History</h2>
          <div
            ref={scrollContainerRef}
            className="h-[calc(100%-3rem)] overflow-y-auto scroll-smooth">
            <table className="w-full text-white">
              <tbody>
                {moves.reduce((rows: React.ReactNode[], move, index) => {
                  if (index % 2 === 0 && move) {
                    rows.push(
                      <tr
                        key={Math.floor(index / 2)}
                        className="hover:bg-gray-600">
                        <td className="w-10 px-2 py-1 text-gray-400">
                          {Math.floor(index / 2) + 1}.
                        </td>
                        <td className="px-2 py-1 font-mono">{move}</td>
                        <td className="px-2 py-1 font-mono">
                          {moves[index + 1] ?? ""}
                        </td>
                      </tr>
                    );
                  }
                  return rows;
                }, [])}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
