"use client";

import type { PropsWithChildren } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GentleText } from "@d0paminedriven/motion";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import type { ProjectDetail } from "@/types/projects";
import { shimmer } from "@/lib/shimmer";
import { BreakoutWrapper } from "@/ui/atoms/breakout-wrapper";
import { Button } from "@/ui/atoms/button";
import { TechnologiesCarousel } from "@/ui/post/technologies-carousel";

export function Project({
  imageUrl,
  slug,
  title,
  description,
  externalLink,
  technologies,
  date,
  children
}: PropsWithChildren<Omit<ProjectDetail, "content">>) {
  if (!slug) {
    return notFound();
  }
  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-background text-foreground font-basis-grotesque-pro container mx-auto px-2 py-16 text-sm font-normal sm:text-base md:py-24">
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
                className="w-full object-cover sm:rounded-lg md:max-h-[50vh]"
                priority
              />
            </motion.div>
          </div>
          <div className="mb-6 md:mx-auto md:max-w-[50%]">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}>
              <TechnologiesCarousel
                withHashtag={false}
                technologies={technologies}
              />
            </motion.div>
          </div>
        </BreakoutWrapper>
        <div className="mx-auto max-w-[65ch]">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}>
            <GentleText
              content={title}
              textClassName={
                "font-basis-grotesque-pro font-bold mb-4 text-4xl md:text-5xl"
              }
              maxWidth="fit"
              containerClassName={"mx-auto"}
              animateOnlyInView={true}
              autoPlay
              allowOverflow
              keyframes={{
                opacity: [0, 1],
                y: [-10, 10],
                scale: [0.5, 1],
                rotate: [-10, 0],
                color: ["#83e6f7", "#f8fafc"]
              }}
              duration={0.3}
              as="h1"
              animateTarget="chars"
            />
            {description && (
              <p className="font-basis-grotesque-pro text-muted-foreground mb-6 text-xl font-normal md:text-2xl">
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
          <p className="text-muted-foreground text-sm">Completed in {date}</p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 flex items-center gap-4">
            <Link href={`/#${slug}`} scroll={true}>
              <Button
                variant="outline"
                className="cursor-pointer"
                type="button">
                Back to Projects
              </Button>
            </Link>
            {externalLink && (
              <Button asChild variant="outline">
                <a
                  href={externalLink}
                  target="_blank"
                  rel="noopener noreferrer">
                  Visit Project
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}
