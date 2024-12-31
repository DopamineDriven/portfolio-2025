import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { createHighlighter, Highlighter } from "shiki";
import { unified } from "unified";

/* eslint-disable */
let highlighter: Highlighter;

export async function highlight(
  code: string,
  lang: string,
  theme: "dark" | "light",
  showLineNumbers = true
) {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ["dark-plus", "light-plus"],
      langs: [
        "typescript",
        "javascript",
        "tsx",
        "jsx",
        "css",
        "json",
        "bash",
        "markdown",
        "yaml"
      ]
    });
  }

  const _rehypeOptions = {
    theme: theme === "dark" ? "dark-plus" : "light-plus",
    keepBackground: true,
    lineNumbers: showLineNumbers,
    onVisitLine(node: any) {
      if (node.children.length === 0) {
        node.children = [{ type: "text", value: " " }];
      }
    },
    onVisitHighlightedLine(node: any) {
      node.properties.className.push("line--highlighted");
    },
    onVisitHighlightedWord(node: any) {
      node.properties.className = ["word--highlighted"];
    }
  };

  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use([rehypePrettyCode])
    .use(rehypeStringify)
    .process(`\`\`\`${lang}\n${code}\n\`\`\``);

  return String(file);
}
