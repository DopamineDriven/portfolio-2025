"use client";

import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import type { ProjectDetail } from "@/types/projects";
import { shimmer } from "@/lib/shimmer";
import { Button } from "@/ui/atoms/button";

export function Project({
  imageUrl,
  slug,
  title,
  description,
  externalLink,
  technologies,
  date,
  children
}: PropsWithChildren< Omit<ProjectDetail, "content">>) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  if (!title) {
    return notFound(); // or a custom 404 component
  }

  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-background text-foreground container mx-auto px-4 py-16 md:py-24">
      <div className="grid gap-8 md:grid-cols-2">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}>
          <Image
            src={imageUrl || "/doge-troubleshoot.jpg"}
            alt={title}
            width={450}
            blurDataURL={shimmer([450, 450])}
            placeholder="blur"
            height={450}
            className="rounded-lg object-cover"
          />
        </motion.div>
        <div className="[&>p]:prose-p:text-pretty flex flex-col justify-between [&>p]:mb-2 lg:[&>p]:mb-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}>
            <h1 className="font-basis-grotesque-pro font-bold mb-2 text-3xl">
              {title}
            </h1>
            <p className="font-basis-grotesque-pro font-normal text-muted-foreground mb-4 text-lg">
              {description}
            </p>
            <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="prose-sm sm:prose dark:prose-invert [&>p]:prose-p:text-pretty max-w-none [&>p]:mb-4 lg:[&>p]:mb-8">
            {children}
          </motion.div>
            <div className="my-4">
              <h2 className="font-basis-grotesque-pro font-bold my-2 text-xl">
                Technologies
              </h2>
              <ul className="flex cursor-pointer flex-wrap gap-2">
                {technologies.map((tech, index) => (
                  <motion.li
                    key={tech}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    className="bg-secondary rounded-full px-3 py-1 text-sm">
                    {tech}
                  </motion.li>
                ))}
              </ul>
            </div>
            <p className="text-muted-foreground text-sm">
              Completed in {date}
            </p>
          </motion.div>
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
