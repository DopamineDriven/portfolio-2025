import { useState, useEffect, useCallback, type RefObject } from "react"

interface Dimensions {
  width: number
  height: number
}

export function useDimensions(ref: RefObject<HTMLElement>): Dimensions {
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 })

  const updateDimensions = useCallback(() => {
    if (ref.current) {
      setDimensions({
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight,
      })
    }
  }, [ref])

  useEffect(() => {
    updateDimensions()

    const handleResize = () => {
      window.requestAnimationFrame(updateDimensions)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [updateDimensions])

  return dimensions
}

