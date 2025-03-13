export function toTitleCase(value: string) {
  if (!value) {
    return "";
  }

  return (
    value
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  );
}
