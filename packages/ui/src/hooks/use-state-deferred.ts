import type { Dispatch, SetStateAction } from "react";
import { useCallback, useState } from "react";

export function useStateDeferred<T>(initialState: T | (() => T)) {
  const [state, setStateOriginal] = useState<T>(initialState);

  const setState = useCallback<Dispatch<SetStateAction<T>>>(value => {
    queueMicrotask(() => {
      setStateOriginal(value);
    });
  }, []);

  return [state, setState] satisfies [T, Dispatch<SetStateAction<T>>];
}
