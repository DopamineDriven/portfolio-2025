import type { ReactNode } from "react";

export function BreakoutWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="w-full">
      <div className="relative w-full sm:static sm:mx-0 sm:w-full sm:max-w-full">
        {children}
      </div>
    </div>
  );
}
