import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts } from "@/lib/parse-frontmatter";

export default async function BlogPage() {
  const posts = await getAllPosts();
  if (!posts) {
    return notFound();
  }
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Posts</h1>
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
