import type { Metadata } from "next";
import type { InferGSPRT } from "@/types/next";
import { processMDXToReact } from "@/lib/mdx-processor";
import { getMdxData, getMdxPaths } from "@/lib/parse-frontmatter";
import { PostTemplate } from "@/ui/post";

export async function generateStaticParams() {
  return getMdxPaths("posts").map(filename => ({
    slug: filename.replace(/\.mdx$/, "")
  }));
}

export async function generateMetadata({
  params
}: InferGSPRT<typeof generateStaticParams>) {
  const { slug } = await params;
  const postData = getMdxData("posts", slug).frontMatter;
  return {
    title: postData.title,
    description: postData.description
  } satisfies Metadata;
}

export default async function PostPage({
  params
}: InferGSPRT<typeof generateStaticParams>) {
  const { slug } = await params;
  const { content, frontMatter: post } = getMdxData("posts", slug);
  const processedContent = await processMDXToReact(content);
  return <PostTemplate {...post}>{processedContent}</PostTemplate>;
}
