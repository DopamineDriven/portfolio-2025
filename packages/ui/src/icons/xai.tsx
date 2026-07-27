import type { BaseSVGProps } from "@/icons/index";

export function XAiIcon({ role = "img", ...svg }: BaseSVGProps) {
  return (
    <svg
      viewBox="0 0 18 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={role}
      {...svg}>
      <title>xAI</title>
      <path
        d="M0.00390625 7.06836L9.04243 19.9993H13.0598L4.02099 7.06836H0.00390625Z"
        fill="currentColor"
      />
      <path
        d="M4.0184 14.252L0 20.0009H4.02005L6.02843 17.1278L4.0184 14.252Z"
        fill="currentColor"
      />
      <path
        d="M13.9817 0L7.03516 9.93798L9.04518 12.8135L18.0017 0H13.9817Z"
        fill="currentColor"
      />
      <path
        d="M14.707 6.14837V19.9996H18V1.4375L14.707 6.14837Z"
        fill="currentColor"
      />
    </svg>
  );
}
