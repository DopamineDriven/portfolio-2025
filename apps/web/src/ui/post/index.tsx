"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
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
  externalLink,
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
      className="bg-background text-foreground container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-4">
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
                className="w-full object-cover sm:rounded-lg"
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
            <h1 className="font-basis-grotesque-pro-bold mb-4 text-4xl md:text-5xl">
              {title}
            </h1>
            {description && (
              <p className="font-basis-grotesque-pro-regular text-muted-foreground mb-6 text-xl md:text-2xl">
                {description}
              </p>
            )}
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="prose dark:prose-invert prose-lg mb-8 max-w-none">
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
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Link href="/projects" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto">
                  Back to Projects
                </Button>
              </Link>
              {externalLink && (
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <a
                    href={externalLink}
                    target="_blank"
                    rel="noopener noreferrer">
                    Visit Project
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}
