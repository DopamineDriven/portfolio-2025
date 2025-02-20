import type { PostDetails } from "@/types/posts";
import { CardGrid } from "@/ui/post-cards/card-grid";

export function PostCards({ posts }: { posts: PostDetails[] }) {
  return (
    <section className="sm:container mx-auto px-0 md:px-4 py-8">
      <h2 className="theme-transition mb-4 flex items-center gap-2 text-2xl text-current">
        <a className="appearance-none" id="posts">
          Posts
        </a>
      </h2>
      <CardGrid posts={posts} />
    </section>
  );
}

/**
 *         <span className="inline-block motion-safe:animate-pulse">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 3H21L12 22L3 3Z"
              fill="oklch(var(--primary))"
              stroke="oklch(var(--primary))"
              strokeWidth="2"
            />
          </svg>
        </span>
 */
