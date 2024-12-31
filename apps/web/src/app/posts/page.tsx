import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import matter from "gray-matter";

interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags?: string[];
  content: string;
}

async function getPosts(): Promise<Post[]> {
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
        content: content
      };
    })
  );

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Blog</h1>
      <div className="grid gap-8">
        {posts.map(post => (
          <article key={post.slug} className="group">
            <Link href={`/posts/${post.slug}`}>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold transition-colors group-hover:text-primary">
                  {post.title}
                </h2>
                <time className="text-sm text-secondary">
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
