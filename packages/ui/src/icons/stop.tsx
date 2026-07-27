import type { BaseSVGProps } from "@/icons/index";

export function Stop({ role = "img", ...svg }: BaseSVGProps) {
  return (
    <svg
      role={role}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      {...svg}>
      <rect width="18" height="18" x="3" y="3" rx="2" />
    </svg>
  );
}
