import Link from "next/link";
import { notFound } from "next/navigation";
import { Fs } from "@d0paminedriven/fs";
import matter from "gray-matter";
import { PostDetails } from "@/types/posts";

async function getPosts(): Promise<PostDetails[]> {
  const fs = new Fs(process.cwd());
  const files = fs.readDir("src/content/posts", { recursive: true });

  const posts = await Promise.all(
    files.map(async filename => {
      const fileContent = fs
        .fileToBuffer(`src/content/posts/${filename}`)
        .toString("utf-8");
      const { data, content } = matter(fileContent);
      const typedData = data as Omit<PostDetails, "content">;
      return {
        slug: filename.replace(/\.mdx$/, ""),
        title: typedData.title,
        date: typedData.date,
        description: typedData.description,
        tags: typedData.tags,
        content: content,
        homeImageUrl: typedData.homeImageUrl,
        id: typedData.id,
        link: typedData.link,
        externalLink: typedData.externalLink,
        imageUrl: typedData.imageUrl
      };
    })
  );

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export default async function BlogPage() {
  const posts = await getPosts();
  if (!posts) {
    return notFound();
  }
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Blog</h1>
      <div className="grid gap-8">
        {posts.map(post => (
          <article key={post.slug} className="group">
            <Link href={`/posts/${post.slug}`}>
              <div className="space-y-2">
                <h2 className="group-hover:text-primary text-2xl font-semibold transition-colors">
                  {post.title}
                </h2>
                <time className="text-secondary text-sm">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </time>
                <p className="text-foreground/80">{post.description}</p>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
