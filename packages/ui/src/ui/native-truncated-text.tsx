"use client";

import { useAspectCh } from "@/hooks/use-aspect-ch";
import { cn } from "@/lib/utils";

export function NativeTruncatedText({
  text,
  className,
  baseChars = 20,
  maxExtraChars = 4,
  minAspectRatio = 229.8 / 799.6,
  maxAspectRatio = 383 / 799.6
}: {
  text: string;
  className?: string;
  /**
   * defaults to 20
   */
  baseChars?: number;
  /**
   * defaults to 4
   */
  maxExtraChars?: number;
  /**
   * defaults to ~0.2873
   */
  minAspectRatio?: number;
  /**
   * defaults to ~0.4790
   */
  maxAspectRatio?: number;
}) {
  const { ref, chars } = useAspectCh({
    baseChars,
    minAspectRatio,
    maxAspectRatio,
    maxExtraChars
  });

  const isTruncated = text.length > chars;

  return (
    <span
      ref={ref}
      className={cn("block w-full truncate", className)}
      style={{ maxWidth: `${chars}ch` }}
      title={isTruncated ? text : undefined}>
      {text}
    </span>
  );
}
