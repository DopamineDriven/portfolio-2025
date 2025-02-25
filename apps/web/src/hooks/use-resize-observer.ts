"use client";

import type { RefObject } from "react";
import { useEffect, useState } from "react";

export function useResizeObserver<const T extends HTMLDivElement | null>(
  parentContainerRef: RefObject<T>
) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (parentContainerRef.current) {
      const {width: refWidth, height: refHeight} = (parentContainerRef.current.getBoundingClientRect());
      setWidth(refWidth);
      setHeight(refHeight);
    }
    return () => {};
  }, [parentContainerRef]);

  return { width, height };
}
