import type { BaseSVGProps } from "@/icons/index.ts";

export function Zai({ role = "img", ...svg }: BaseSVGProps) {
  return (
    <svg
      role={role}
      viewBox="0 0 24 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...svg}>
      <title>Zai</title>
      <path
        d="M12.6065 0.0129029L10.929 2.4C10.671 2.77419 10.2323 3.00645 9.76775 3.00645H0.606456V0C0.593552 0.0129032 12.6065 0.0129029 12.6065 0.0129029Z"
        fill="currentColor"
      />
      <path
        d="M24 0.0078125L9.6 20.4078H0L14.4 0.0078125H24Z"
        fill="currentColor"
      />
      <path
        d="M11.3936 20.4127L13.0839 18.0127C13.3419 17.6385 13.7807 17.4062 14.2452 17.4062H23.3936V20.4127H11.3936Z"
        fill="currentColor"
      />
    </svg>
  );
}
