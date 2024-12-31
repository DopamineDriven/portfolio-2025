import { promises as fs } from "fs";
import path from "path";
import type { Options as _RehypeOptions } from "rehype-pretty-code";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { useMDXComponents } from "../../../../mdx-components";
import { InferGSPRT } from "@/types/next";

// const options = {
//   theme: "dark-plus",
//   onVisitLine(node) {
//     if (node.children.length === 0) {
//       node.children = [{ type: "text", value: " " }];
//     }
//   },
//   onVisitHighlightedLine(node) {
//     node?.properties?.className?.push("highlighted");
//   },
//   onVisitHighlightedChars(node) {
//     node.properties.className = ["word"];
//   }
// } satisfies Options;

const options = {
  theme: 'dark-plus',
  onVisitLine(node: any) {
    // eslint-disable-next-line
    if (node.children.length === 0) {
      // eslint-disable-next-line
      node.children = [{ type: 'text', value: ' ' }];
    }
  },
  onVisitHighlightedLine(node: any) {
    // eslint-disable-next-line
    node.properties.className.push('highlighted');
  },
  onVisitHighlightedWord(node: any) {
    // eslint-disable-next-line
    node.properties.className = ['word'];
  },
};
export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), "content");
  const filenames = await fs.readdir(postsDirectory);

  return filenames.map(filename => ({
    slug: filename.replace(/\.mdx$/, "")
  }));
}

export default async function Post({ params }: InferGSPRT<typeof generateStaticParams>) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "content", `${slug}.mdx`);
  const source = await fs.readFile(filePath, "utf8");
  // eslint-disable-next-line
  const components = useMDXComponents({});

  return (
    <article className="prose max-w-none dark:prose-invert">
      <MDXRemote
        source={source}
        components={components}
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
