import type { Metadata } from "next";
import type { InferGSPRT } from "@/types/next";
import { processMDXToReact } from "@/lib/mdx-processor";
import { getMdxData, getMdxPaths } from "@/lib/parse-frontmatter";
import { toTitleCase } from "@/lib/to-title-case";
import { Project } from "@/ui/project";

export async function generateStaticParams() {
  return getMdxPaths("projects").map(project => ({
    slug: project.replace(/\.mdx$/, "")
  }));
}

export async function generateMetadata({
  params
}: InferGSPRT<typeof generateStaticParams>) {
  const { slug } = await params;
  const proj = getMdxData("projects", slug).frontMatter;
  return {
    title: toTitleCase(proj.title),
    description: toTitleCase(proj.description)
  } satisfies Metadata;
}

export default async function ProjectPage({
  params
}: InferGSPRT<typeof generateStaticParams>) {
  const { slug } = await params;
  const { content, frontMatter: project } = getMdxData("projects", slug);
  const processedContent = await processMDXToReact(content);
  return <Project {...project}>{processedContent}</Project>;
}
