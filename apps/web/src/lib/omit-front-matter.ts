export const omitFrontMatter = <const T extends string>(frontMatter: T) => {
  return frontMatter.replace(/^---[\r\n]+([\s\S]*?)[\r\n]+---/g, "");
};
