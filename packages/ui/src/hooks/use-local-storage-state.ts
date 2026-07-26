"use client";

import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";

export function useLocalStorageState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(defaultValue);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        // eslint-disable-next-line
        setState(JSON.parse(raw));
      }
    } catch (err) {
      console.error(
        `something went wrong in useLocalStorageState...`,
        err instanceof Error ? err.message : ""
      );
    }
  }, [key]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState] satisfies [T, Dispatch<SetStateAction<T>>];
}
