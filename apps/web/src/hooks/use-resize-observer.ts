"use client";

import type { RefObject } from "react";
import { useEffect, useState } from "react";

export function useResizeObserver<const T extends HTMLDivElement | null>(
  parentContainerRef: RefObject<T>
) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(mutations => {

      setWidth(mutations[0]?.contentRect?.width ?? 0);
      setHeight(mutations[0]?.contentRect?.height ?? 0);
    });

    if (parentContainerRef.current) {
      resizeObserver.observe(parentContainerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [parentContainerRef]);

  return { width, height };
}
