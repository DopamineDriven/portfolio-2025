import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

export interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags?: string[];
  content: string;
}

export async function getPosts(): Promise<Post[]> {
  const postsDirectory = path.join(process.cwd(), "src/content");
  const files = await fs.readdir(postsDirectory);

  const posts = await Promise.all(
    files.map(async filename => {
      const filePath = path.join(postsDirectory, filename);
      const fileContent = await fs.readFile(filePath, "utf8");
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
