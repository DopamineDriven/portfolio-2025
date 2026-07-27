"use client";

import { useCookiesCtx } from "@/context/cookie-context";

export function useIos() {
  const { get } = useCookiesCtx();
  const iosCookie = get("ios") === "true";
  return iosCookie;
}
