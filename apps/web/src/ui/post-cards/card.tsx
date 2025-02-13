"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarIcon } from "lucide-react";
import { motion } from "motion/react";
import type { PostDetails } from "@/types/posts";
import { shimmer } from "@/lib/shimmer";

export function PostCard({ post }: { post: PostDetails }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative aspect-[16/9] w-full overflow-hidden rounded-[var(--radius)]">
      <Link
        href={post.link}
        id={`${post.slug}`}
        className="relative block h-full">
        <div className="relative h-full w-full transition-transform duration-500 group-hover:scale-105">
          <Image
            src={post.imageUrl || "/placeholder.svg"}
            alt={post.title}
            fill
            placeholder="blur"
            blurDataURL={shimmer([1024, 512])}
            className="object-cover brightness-90 transition-all duration-500 group-hover:brightness-100"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="from-background/80 to-background/40 h-[50%] bg-gradient-to-t backdrop-blur-xs" />
          </div>
        </div>
        <div className="text-foreground absolute right-0 bottom-0 left-0 p-6">
          <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm">
            <CalendarIcon className="h-4 w-4" />
            <time dateTime={post.date}>{post.date}</time>
          </div>
          <motion.h2
            className="font-basis-grotesque-pro-bold text-base tracking-wider sm:text-2xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}>
            {post.title}
          </motion.h2>
          <motion.p
            className="font-basis-grotesque-pro-regular text-muted-foreground mt-2 line-clamp-2 text-sm tracking-wider"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}>
            {post.description}
          </motion.p>
        </div>
      </Link>
    </motion.div>
  );
}
