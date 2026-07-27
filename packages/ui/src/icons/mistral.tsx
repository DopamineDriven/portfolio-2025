import type { BaseSVGProps } from "@/icons/index";

export function MistralIcon({ role = "img", ...svg }: BaseSVGProps) {
  return (
    <svg
      role={role}
      viewBox="0 0 29 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...svg}>
      <title>Mistral</title>
      <path d="M8.02263 0H4.01025V4.00059H8.02263V0Z" fill="currentColor" />
      <path d="M24.07 0H20.0576V4.00059H24.07V0Z" fill="currentColor" />
      <path d="M12.0337 4H4.01025V8.00059H12.0337V4Z" fill="currentColor" />
      <path d="M24.0708 4H16.0474V8.00059H24.0708V4Z" fill="currentColor" />
      <path d="M24.0683 8H4.01025V12.0006H24.0683V8Z" fill="currentColor" />
      <path d="M8.02263 12H4.01025V16.0007H8.02263V12Z" fill="currentColor" />
      <path d="M16.0476 12H12.0352V16.0007H16.0476V12Z" fill="currentColor" />
      <path d="M24.07 12H20.0576V16.0007H24.07V12Z" fill="currentColor" />
      <path d="M12.0345 16H0V20.0007H12.0345V16Z" fill="currentColor" />
      <path d="M28.0832 16H16.0474V20.0007H28.0832V16Z" fill="currentColor" />
    </svg>
  );
}
