import { Fs } from "@d0paminedriven/fs";
import matter from "gray-matter";

export interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags?: string[];
  content: string;
}

export async function getPosts() {
  const fs = new Fs(process.cwd());
  const files = fs.readDir("content/posts");

  const posts = await Promise.all(
    files.map(filename => {
      const fileContent = fs.fileToBuffer(`content/posts/${filename}`).toString("utf-8");
      const { data, content } = matter(fileContent);
      const typedData = data as Omit<Post, "content">;
      return {
        slug: filename.replace(".mdx", ""),
        title: typedData.title,
        date: typedData.date,
        description: typedData.description,
        tags: typedData.tags,
        content
      };
    })
  );

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
