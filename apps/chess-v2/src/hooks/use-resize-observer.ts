"use client";

import type { RefObject } from "react";
import { useEffect, useState } from "react";


// fallback to a more specific HTMLDivElement if problems occur
export function useResizeObserver<const T extends HTMLElement>(
  elem: RefObject<T>
) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(mutations => {
      setWidth(mutations[0]?.contentRect?.width ?? 0);
      setHeight(mutations[0]?.contentRect?.height ?? 0);
    });

    if (elem.current) {
      resizeObserver.observe(elem.current);
    }

    return () => resizeObserver.disconnect();
  }, [elem]);

  return { width, height };
}
