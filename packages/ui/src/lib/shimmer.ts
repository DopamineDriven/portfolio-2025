import { toN as n } from "@/lib/safe-number";

export function toBase64<const T extends string>(str: T) {
  return typeof window === "undefined"
    ? Buffer.from(str, "utf-8").toString("base64")
    : window.btoa(str);
}

export function fromBase64<const T extends string>(str: T) {
  typeof window === "undefined"
    ? Buffer.from(str, "base64").toString("utf-8")
    : window.atob(str);
}

export type SafeNumber = `${number}` | number;

export function shimmerScaffold<
  const W extends SafeNumber,
  const H extends SafeNumber
>({ w, h }: { w: W; h: H }) {
  // prettier-ignore
  return `<svg width="${n(w)}" height="${n(h)}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${n(w)}" height="${n(h)}" fill="#333" />
  <rect id="r" width="${n(w)}" height="${n(h)}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${n(w)}" to="${n(w)}" dur="1s" repeatCount="indefinite"  />
</svg>`;
}

/**
 * use in the "blurDataUrl" property of the Nextjs Image component and set the "placeholder" property to "blur"
 */
export function shimmer<
  const W extends SafeNumber,
  const H extends SafeNumber
>([w, h]: [W, H]) {
  return `data:image/svg+xml;base64,${toBase64(shimmerScaffold({ w, h }))}` as const;
}
