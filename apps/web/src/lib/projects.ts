import { Fs } from "@d0paminedriven/fs";
import matter from "gray-matter";
import type { ProjectDetail } from "@/types/projects";
import { omitFrontMatter } from "@/lib/omit-front-matter";

export async function getProjects() {
  const fs = new Fs(process.cwd());
  const files = fs.readDir("src/content/projects");

  const projects = await Promise.all(
    files.map(filename => {
      const fileContent = fs
        .fileToBuffer(`src/content/projects/${filename}`)
        .toString("utf-8");
      const { data, content } = matter(fileContent);
      const typedData = data as Omit<ProjectDetail, "content">;

      return {
        slug: typedData.slug,
        title: typedData.title,
        date: typedData.date,
        description: typedData.description,
        technologies: typedData.technologies,
        homeImageUrl: typedData.homeImageUrl,
        imageUrl: typedData.imageUrl,
        link: typedData.link,
        externalLink: typedData.externalLink,
        id: typedData.id,
        content: omitFrontMatter(content)
      } satisfies ProjectDetail;
    })
  );

  return projects.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
