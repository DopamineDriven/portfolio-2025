import type { BaseSVGProps } from "@/icons/index";

export function Plus({ role = "img", ...svg }: BaseSVGProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={role}
      {...svg}>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
