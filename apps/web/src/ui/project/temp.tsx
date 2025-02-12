"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import type { ProjectDetail } from "@/types/projects";
import { shimmer } from "@/lib/shimmer";
import { Button } from "@/ui/atoms/button";

export interface ProjectScaffoldProps extends ProjectDetail {
  children?: ReactNode;
}

export function ProjectTemp({
  title,
  description,
  imageUrl,
  slug,
  externalLink,
  technologies,
  date,
  children
}: Omit<ProjectScaffoldProps, "content">) {
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
        <div className="flex flex-col justify-between">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}>
            <h1 className="font-basis-grotesque-pro-bold mb-2 text-3xl">
              {title}
            </h1>
            {description && (
              <p className="font-basis-grotesque-pro-regular text-muted-foreground mb-4 text-lg">
                {description}
              </p>
            )}
            <div className="prose dark:prose-invert prose-p:text-pretty mb-4 max-w-none">
              {children}
            </div>
            <div className="mb-4">
              <h2 className="font-basis-grotesque-pro-bold mb-2 text-xl">
                Technologies
              </h2>
              <ul className="flex cursor-pointer flex-wrap gap-2">
                {technologies.map((tech, index) => (
                  <motion.li
                    key={tech}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    className="list-none bg-secondary rounded-full px-3 py-1 text-sm">
                    {tech}
                  </motion.li>
                ))}
              </ul>
            </div>
            <p className="text-muted-foreground text-sm">Completed in {date}</p>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 flex items-center gap-4">
            {slug && (
              <Link href={`/#${slug}`} scroll={true}>
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  type="button">
                  Back to Projects
                </Button>
              </Link>
            )}
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
