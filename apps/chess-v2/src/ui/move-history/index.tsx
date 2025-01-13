"use client";

import { useEffect, useRef } from "react";
import { useGame } from "@/contexts/game-context";

export default function MoveHistory() {
  const { moves } = useGame();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [moves]);

  return (
    <div className="mt-4 rounded-lg bg-gray-700 p-4">
      <h2 className="mb-2 text-xl font-bold text-white">Move History</h2>
      <div
        ref={scrollContainerRef}
        className="h-48 overflow-y-auto scroll-smooth sm:h-60 md:h-72 lg:h-80 xl:h-96">
        <table className="w-full text-white">
          <tbody>
            {moves.reduce((rows: React.ReactNode[], move, index) => {
              if (index % 2 === 0) {
                rows.push(
                  <tr key={Math.floor(index / 2)} className="hover:bg-gray-600">
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
  );
}
