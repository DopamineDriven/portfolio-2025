export type ReplaceSpaces<S extends string> =
  S extends `${infer Head} ${infer Tail}` | `${infer Head}  ${infer Tail}` | `${infer Head}   ${infer Tail}`
    ? `${Head}-${ReplaceSpaces<Tail>}`
    : S;

export type InferSlugified<T extends string> = Lowercase<ReplaceSpaces<T>>;

/**
 * Converts a given string into a URL-friendly slug.
 *
 * @param title - The input string to be slugified.
 * @returns A URL-friendly slug.
 */
export function slugify<const T extends string>(title: T) {
  return title
    .toLowerCase()
    .trim()
    .normalize("NFD") // decomposes combined letters into letter + diacritic
    .replace(/[\u0300-\u036f]/g, "") // remove diacritical marks
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars (only A-Z, a-z, 0-9, space, and dash).
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "") as InferSlugified<T>;
}

