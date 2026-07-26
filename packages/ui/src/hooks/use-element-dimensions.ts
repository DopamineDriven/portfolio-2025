"use client";

import type { RefObject } from "react";
import { useCallback, useEffect, useState } from "react";

export function useElementDimensions<
  const T extends HTMLElement | HTMLDivElement | null
>(parentContainerRef: RefObject<T>) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);

  const measure = useCallback(() => {
    if (!parentContainerRef.current) return;

    const rect = parentContainerRef.current.getBoundingClientRect();
    setWidth(rect.width);
    setHeight(rect.height);
    setTop(rect.top);
    setLeft(rect.left);
  }, [parentContainerRef]);

  useEffect(() => {
    measure();

    const resizeObserver = new ResizeObserver(mutations => {
      setWidth(mutations[0]?.contentRect?.width ?? 0);
      setHeight(mutations[0]?.contentRect?.height ?? 0);
    });

    if (parentContainerRef.current) {
      resizeObserver.observe(parentContainerRef.current);
    }

    function updatePosition() {
      if (!parentContainerRef.current) return;
      const rect = parentContainerRef.current.getBoundingClientRect();
      setTop(rect.top);
      setLeft(rect.left);
    }

    window.addEventListener("scroll", updatePosition);
    window.addEventListener("resize", updatePosition);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [parentContainerRef, measure]);

  return [{ width, height, top, left }, measure] as const;
}
