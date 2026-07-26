import type { BaseSVGProps } from "@/icons/index";

export function ChevronUp({ role = "img", ...svg }: BaseSVGProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      role={role}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...svg}>
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}
