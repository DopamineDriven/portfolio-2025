import type { Options as RehypeOptions } from "rehype-pretty-code";
import { notFound } from "next/navigation";
import { Fs } from "@d0paminedriven/fs";
import { transformerMetaWordHighlight } from "@shikijs/transformers";
import matter from "gray-matter";
import rehypePrettyCode from "rehype-pretty-code";
import type { InferGSPRT } from "@/types/next";
import type { PostDetails } from "@/types/posts";
import { omitFrontMatter } from "@/lib/omit-front-matter";
import { MdxRenderer } from "@/ui/mdx-handler";
import { PostTemplate } from "@/ui/post";

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
  const filenames = fs.readDir("src/content/posts", { recursive: true });

  return filenames.map(filename => ({
    slug: filename.replace(/\.mdx$/, "")
  }));
}

async function getPost({ slug }: { slug: string }) {
  const fs = new Fs(process.cwd());

  const post = fs
    .fileToBuffer(`src/content/posts/${slug}.mdx`)
    .toString("utf-8");
  const { data, content } = matter(post);
  const typedData = data as Omit<PostDetails, "content">;
  console.log(content);
  return {
    slug: post.replace(/\.mdx$/, ""),
    id: typedData.id,
    title: typedData.title,
    date: typedData.date,
    description: typedData.description,
    tags: typedData.tags,
    imageUrl: typedData.imageUrl,
    link: typedData.link,
    externalLink: typedData.externalLink ?? "#",
    content: omitFrontMatter(content)
  } satisfies PostDetails;
}

export async function generateMetadata({
  params
}: InferGSPRT<typeof generateStaticParams>) {
  const { slug } = await params;
  const postData = await getPost({ slug });
  return {
    title: postData.title
  };
}

export default async function PostPage({
  params
}: InferGSPRT<typeof generateStaticParams>) {
  const { slug } = await params;
  const post = await getPost({ slug });
  if (!post) {
    return notFound();
  }
  return (
    <PostTemplate
      date={post.date}
      description={post.description}
      tags={post.tags}
      id={post.id}
      imageUrl={post.imageUrl}
      link={post.link}
      title={post.title}
      slug={slug || post.slug}
      externalLink={post.externalLink}>
      <MdxRenderer
        source={post.content}
        options={{
          mdxOptions: {
            remarkPlugins: [],
            rehypePlugins: [[rehypePrettyCode, options]]
          }
        }}
      />
    </PostTemplate>
  );
}
