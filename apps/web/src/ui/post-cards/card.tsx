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
      className="group relative aspect-[16/9]! overflow-hidden mx-auto w-full">
      <Link
        href={post.link}
        id={`${post.slug}`}
        className="relative block h-full overflow-hidden rounded-lg">
        <Image
          src={post.homeImageUrl ?? "/doge-troubleshoot.jpg"}
          alt={post.title}
          width={1024}
          height={576}
          placeholder="blur"
          blurDataURL={shimmer([1024, 576])}
          className="object-contain transition-all duration-500 group-hover:scale-[1.005]"
        />
        <div className="group-hover:bg-background/10 absolute -inset-x-5 inset-y-0 transition-all duration-500">
          <div className="bg-background/70 group-hover:bg-background/80 absolute inset-x-4 bottom-4 rounded-lg p-4 backdrop-blur-md transition-all duration-500">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-0.5">
                <CalendarIcon className="text-muted-foreground/80 size-4" />
                <time
                  dateTime={post.date}
                  className="font-basis-grotesque-pro font-light text-muted-foreground/80 text-xs">
                  {post.date}
                </time>
              </div>
              <motion.h2
                className="font-basis-grotesque-pro font-medium text-base tracking-wider sm:text-2xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}>
                {post.title}
              </motion.h2>
              <motion.p
                className="font-basis-grotesque-pro font-normal text-muted-foreground mt-2 line-clamp-2 text-sm tracking-wider"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}>
                {post.description}
              </motion.p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
