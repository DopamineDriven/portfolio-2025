import { Fs } from "@d0paminedriven/fs";
import matter from "gray-matter";
import type { PostDetails } from "@/types/posts";
import { omitFrontMatter } from "@/lib/omit-front-matter";

export async function getPosts() {
  const fs = new Fs(process.cwd());
  const files = fs.readDir("src/content/posts");

  const posts = await Promise.all(
    files.map(filename => {
      const fileContent = fs
        .fileToBuffer(`src/content/posts/${filename}`)
        .toString("utf-8");
      const { data, content } = matter(fileContent);
      const typedData = data as Omit<PostDetails, "content">;

      return {
        slug: typedData.slug,
        title: typedData.title,
        date: typedData.date,
        description: typedData.description,
        homeImageUrl: typedData.homeImageUrl,
        tags: typedData.tags,
        imageUrl: typedData.imageUrl,
        link: typedData.link,
        externalLink: typedData.externalLink,
        id: typedData.id,
        content: omitFrontMatter(content)
      } satisfies PostDetails;
    })
  );

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
