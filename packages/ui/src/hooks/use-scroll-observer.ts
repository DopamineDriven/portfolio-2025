"use client";

import type { RefObject } from "react";
import { useCallback, useEffect, useState } from "react";

export function useScrollObserver<T extends HTMLDivElement | null>(
  containerRef: RefObject<T>,
  options: {
    nearBottomThreshold?: number;
    scrollButtonThreshold?: number;
    debounceMs?: number;
  } = {}
) {
  const {
    nearBottomThreshold = 200,
    scrollButtonThreshold = 100,
    debounceMs = 50
  } = options;

  const [scrollState, setScrollState] = useState<{
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
    distanceFromBottom: number;
    isNearBottom: boolean;
    showScrollButton: boolean;
  }>({
    scrollTop: 0,
    scrollHeight: 0,
    clientHeight: 0,
    distanceFromBottom: 0,
    isNearBottom: true,
    showScrollButton: false
  });

  const updateScrollState = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

    setScrollState({
      scrollTop,
      scrollHeight,
      clientHeight,
      distanceFromBottom,
      isNearBottom: distanceFromBottom < nearBottomThreshold,
      showScrollButton: distanceFromBottom > scrollButtonThreshold
    });
  }, [containerRef, nearBottomThreshold, scrollButtonThreshold]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let timeoutId: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateScrollState, debounceMs);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });

    // Initial calculation
    setTimeout(updateScrollState, 100);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [updateScrollState, debounceMs, containerRef]);

  return scrollState;
}
