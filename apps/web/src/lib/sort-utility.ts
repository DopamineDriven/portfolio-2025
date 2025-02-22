export const technologySort = <const T extends string[]>(technologies: T) =>
  technologies
    .sort((a, b) => {
      return !a.startsWith("@") && !b.startsWith("@")
        ? a.localeCompare(b) - b.localeCompare(a)
        : a.localeCompare(a) - b.localeCompare(b);
    })
    .map(t => t);
