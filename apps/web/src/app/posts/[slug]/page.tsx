import path from "path";
import type { Options as RehypeOptions } from "rehype-pretty-code";
import { Fs } from "@d0paminedriven/fs";
import { transformerMetaWordHighlight } from "@shikijs/transformers";
import rehypePrettyCode from "rehype-pretty-code";
import type { InferGSPRT } from "@/types/next";
import { MdxRenderer } from "@/ui/mdx-handler";

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
  const fs = new Fs(process.cwd());
  const postsDirectory = path.join(process.cwd(), "content");
  const filenames = fs.readDir(postsDirectory, { recursive: true });

  return filenames.map(filename => ({
    slug: filename.replace(/\.mdx$/, "")
  }));
}

export default async function Post({
  params
}: InferGSPRT<typeof generateStaticParams>) {
  const fs = new Fs(process.cwd());
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "content", `${slug}.mdx`);
  const source = fs.fileToBuffer(filePath).toString("utf-8");

  return (
    <article className="prose dark:prose-invert max-w-none">
      <MdxRenderer
        source={source}
        options={{
          parseFrontmatter:true,
          mdxOptions: {
            remarkPlugins: [],
            rehypePlugins: [[rehypePrettyCode, options]]
          }
        }}
      />
    </article>
  );
}
