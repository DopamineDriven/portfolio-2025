import { promises as fs } from "fs";
import path from "path";
import type { Options as RehypeOptions } from "rehype-pretty-code";
import rehypePrettyCode from "rehype-pretty-code";
import type { InferGSPRT } from "@/types/next";
import { MdxRenderer } from "@/components/MDXHandler";
import { transformerMetaWordHighlight } from "@shikijs/transformers";

const options = {
  grid: true,
  keepBackground: true,
  theme: "dark-plus",
  onVisitLine(node) {
    // Prevent lines from collapsing in `display: grid` mode
    // and allow empty lines to be copy/pasted
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  },
  onVisitHighlightedLine(node) {
    node?.properties?.className?.push("highlighted");
  },
  onVisitHighlightedChars(node) {
    node.properties.className = ["word"];
  },
  transformers: [transformerMetaWordHighlight()]
} satisfies RehypeOptions;

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), "content");
  const filenames = await fs.readdir(postsDirectory);

  return filenames.map(filename => ({
    slug: filename.replace(/\.mdx$/, "")
  }));
}

export default async function Post({
  params
}: InferGSPRT<typeof generateStaticParams>) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "content", `${slug}.mdx`);
  const source = await fs.readFile(filePath, "utf8");

  return (
    <article className="prose max-w-none dark:prose-invert">
      <MdxRenderer
        source={source}
        options={{
          mdxOptions: {
            remarkPlugins: [],
            rehypePlugins: [[rehypePrettyCode, options]]
          }
        }}
      />
    </article>
  );
}
