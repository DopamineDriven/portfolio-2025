"use client";

import type { ThemeProviderProps } from "next-themes";
import { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <NextThemesProvider
      {...props}
      defaultTheme="system"
      enableSystem={true}
      attribute="class">
      {children}
    </NextThemesProvider>
  );
}
