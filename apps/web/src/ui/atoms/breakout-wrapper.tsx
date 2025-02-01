import type { FC, ReactNode } from "react";

export const BreakoutWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="w-full sm:container sm:mx-auto">
      <div className="relative right-1/2 left-1/2 -mx-[50vw] w-screen sm:static sm:mx-0 sm:w-full">
        {children}
      </div>
    </div>
  );
};
