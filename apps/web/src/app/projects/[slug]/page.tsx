import type { Metadata } from "next";
import type { Options as RehypeOptions } from "rehype-pretty-code";
import { notFound } from "next/navigation";
import { Fs } from "@d0paminedriven/fs";
import { transformerMetaWordHighlight } from "@shikijs/transformers";
import matter from "gray-matter";
import rehypePrettyCode from "rehype-pretty-code";
import type { InferGSPRT } from "@/types/next";
import type { ProjectDetail } from "@/types/projects";
import { omitFrontMatter } from "@/lib/omit-front-matter";
import { MdxRenderer } from "@/ui/mdx-handler";
import { Project } from "@/ui/project";

const options = {
  grid: true,
  keepBackground: true,
  theme: "dark-plus",
  onVisitLine(node) {
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
  const projects = fs.readDir("src/content/projects", { recursive: true });
  return projects.map(project => ({
    slug: project.replace(/\.mdx$/, "")
  }));
}

async function getProject({ slug }: { slug: string }) {
  const fs = new Fs(process.cwd());

  const project = fs
    .fileToBuffer(`src/content/projects/${slug}.mdx`)
    .toString("utf-8");
  const { data, content } = matter(project);
  const typedData = data as Omit<ProjectDetail, "content">;
  return {
    slug: slug,
    id: typedData.id,
    title: typedData.title,
    date: typedData.date,
    description: typedData.description,
    technologies: typedData.technologies,
    imageUrl: typedData.imageUrl,
    link: typedData.link,
    homeImageUrl: typedData.homeImageUrl,
    externalLink: typedData.externalLink ?? "#",
    content: omitFrontMatter(content)
  } satisfies ProjectDetail;
}

export async function generateMetadata({
  params
}: InferGSPRT<typeof generateStaticParams>) {
  const { slug } = await params;
  const proj = await getProject({ slug });
  return {
    title: proj.title.toLocaleLowerCase(),
    description: proj.description.toLowerCase()
  } satisfies Metadata;
}

export default async function ProjectPage({
  params
}: InferGSPRT<typeof generateStaticParams>) {
  const { slug } = await params;
  const project = await getProject({ slug });
  if (!project) {
    return notFound();
  }
  return (
    <Project
      id={project.id}
      date={project.date}
      description={project.description}
      imageUrl={project.imageUrl}
      link={project.link}
      homeImageUrl={project.homeImageUrl}
      slug={slug}
      technologies={project.technologies}
      title={project.title}
      externalLink={project.externalLink}>
      <MdxRenderer
        source={project.content}
        options={{
          mdxOptions: {
            remarkPlugins: [],
            rehypePlugins: [[rehypePrettyCode, options]]
          }
        }}
      />
    </Project>
  );
}
