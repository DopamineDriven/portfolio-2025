import type { PostDetails } from "@/types/posts";
import { CardGrid } from "@/ui/post-cards/card-grid";

export function PostCards({ posts }: { posts: PostDetails[] }) {
  return (
    <div className="mx-auto max-w-screen px-0 pb-8">
      <h2 className="theme-transition container my-6 flex items-center gap-y-2 text-2xl text-current lg:px-8">
        <a className="appearance-none text-left" id="posts">
          Posts
        </a>
      </h2>
      <CardGrid posts={posts} />
    </div>
  );
}
