"use client";

import type {
  CookieContextType,
  CookieKey,
  CookieValue,
  FilterResults,
  GetCookie
} from "@/types/cookies";
import type { ReactNode } from "react";
import { createContext, useCallback, useContext } from "react";
import { COOKIES, isValidCookieKey } from "@/types/cookies";
import Cookies from "js-cookie";

const CookieContext = createContext<CookieContextType | undefined>(undefined);

export function CookieProvider({
  children
}: Readonly<{ children: ReactNode }>) {
  const get = useCallback(<const K extends CookieKey>(key: K) => {
    return Cookies.get(key) as GetCookie<K, true>;
  }, []);

  const set = useCallback(
    <const K extends CookieKey>(
      key: K,
      value: CookieValue[K],
      options?: Cookies.CookieAttributes
    ) => {
      Cookies.set(COOKIES[key], value, options);
    },
    []
  );

  const getTargeted = useCallback(
    <const V extends keyof CookieValue>(k: readonly V[]) => {
      const result = {} as Record<keyof CookieValue, string | undefined>;
      for (const kk of k) {
        result[kk] = Cookies.get(kk);
      }
      return result as FilterResults<V>;
    },
    []
  );

  const remove = useCallback((key: CookieKey) => {
    Cookies.remove(COOKIES[key]);
  }, []);

  const getAll = useCallback(() => {
    const result = {} as Record<keyof CookieValue, string | undefined>;

    Array.from(Object.entries(COOKIES)).forEach(([key, _]) => {
      if (isValidCookieKey(key) && key in result) {
        const value = get(key);
        if (value) {
          result[key] = value;
        }
      }
    });
    return result;
  }, [get]);

  const contextValue = {
    get,
    set,
    remove,
    getAll,
    getTargeted
  } satisfies CookieContextType;

  return (
    <CookieContext.Provider value={contextValue}>
      {children}
    </CookieContext.Provider>
  );
}

export function useCookiesCtx() {
  const context = useContext(CookieContext);
  if (!context) {
    throw new Error("useCookies must be used within a CookieProvider");
  }
  return context;
}
