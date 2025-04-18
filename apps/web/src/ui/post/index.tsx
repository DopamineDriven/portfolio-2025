"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "motion/react";
import type { PostDetails } from "@/types/posts";
import { shimmer } from "@/lib/shimmer";
import { BreakoutWrapper } from "@/ui/atoms/breakout-wrapper";
import { Button } from "@/ui/atoms/button";
import { TechnologiesCarousel } from "@/ui/post/technologies-carousel";

export interface PostTemplateProps extends Omit<PostDetails, "content"> {
  children: ReactNode;
}

export function PostTemplate({
  title,
  description,
  imageUrl,
  slug,
  externalLink: _externalLink,
  tags,
  date,
  children
}: PostTemplateProps) {
  if (!slug) {
    return notFound();
  }
  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-background text-foreground container mx-auto px-2 py-16 md:py-24 text-sm sm:text-base font-basis-grotesque-pro font-normal">
      <div className="mx-auto max-w-[1280px]">
        <BreakoutWrapper>
          <div className="mb-4 md:mx-auto md:max-w-[50%]">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}>
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={title}
                width={1200}
                height={630}
                placeholder="blur"
                blurDataURL={shimmer([1200, 630])}
                className="w-full md:max-h-[50vh] object-cover sm:rounded-lg"
                priority
              />
            </motion.div>
          </div>
          <div className="mb-6 md:mx-auto md:max-w-[50%]">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}>
              <TechnologiesCarousel technologies={tags} />
            </motion.div>
          </div>
        </BreakoutWrapper>
        <div className="mx-auto max-w-[65ch]">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}>
            <h1 className="font-basis-grotesque-pro font-bold mb-4 text-4xl md:text-5xl">
              {title}
            </h1>
            {description && (
              <p className="font-basis-grotesque-pro font-normal text-muted-foreground mb-6 text-xl md:text-2xl">
                {description}
              </p>
            )}
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="prose-sm sm:prose dark:prose-invert [&>p]:prose-p:text-pretty max-w-none [&>p]:mb-4 lg:[&>p]:mb-8">
            {children}
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="flex flex-col gap-4">
            <p className="text-muted-foreground text-center text-sm">
              Published {date}
            </p>
            <div className="flex flex-col gap-2 items-center">
              <Link href={`/#${slug}`} className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto cursor-pointer">
                  Back to Posts
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}
