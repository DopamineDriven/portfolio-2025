export function toTitleCase(value: string) {
  if (!value) {
    return "";
  }

  return value
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
export const kebabToCamel = (file: string) => {
  const splitDashes = file?.split(/\./g)?.[0]?.split(/(-|_)/g) ?? [""];
  if (splitDashes.length > 1) {
    return splitDashes
      .filter((_, i) => i % 2 === 0)
      .map((text, i) => {
        return i === 0
          ? text.toLowerCase()
          : text.substring(0, 1).toUpperCase().concat(text.substring(1));
      })
      .join("");
  } else return file;
};
