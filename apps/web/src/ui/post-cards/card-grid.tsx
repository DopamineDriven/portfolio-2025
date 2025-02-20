"use client";

import { motion } from "motion/react";
import type { PostDetails } from "@/types/posts";
import { PostCard } from "@/ui/post-cards/card";

export function CardGrid({ posts }: { posts: PostDetails[] }) {
  return (
    <div className="grid grid-cols-1 gap-y-16 md:grid-cols-2 md:gap-x-6 lg:gap-x-8">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className={`${index % 2 === 0 ? "md:mt-8 mt-4" : ""}`}>
          <PostCard post={post} />
        </motion.div>
      ))}
    </div>
  );
}
