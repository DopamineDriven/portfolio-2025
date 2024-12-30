import matter from "gray-matter";

export interface Frontmatter {
  title: string;
  description?: string;
  date?: string;
  tags?: string[];
}

export interface MDXPage {
  frontmatter: Frontmatter;
  content: string;
}

export function getMDXContent(source: string) {
  const { data, content } = matter(source);
  const typedData = data as {
    title: string;
    description?: string;
    date?: string;
    tags?: string[];
  } satisfies Frontmatter;
  return {
    frontmatter: {
      title: typedData.title ?? "Untitled",
      description: typedData.description,
      date: typedData.date,
      tags: typedData.tags
    },
    content
  } satisfies MDXPage;
}
