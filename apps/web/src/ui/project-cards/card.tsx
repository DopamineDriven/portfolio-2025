"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import type { ProjectDetail } from "@/types/projects";
import { shimmer } from "@/lib/shimmer";

export function ProjectCard({ project }: { project: ProjectDetail }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative aspect-[3/4] w-full overflow-hidden md:max-w-[80%] mx-auto">
      <Link
        href={project.link}
        id={`${project.slug}`}
        className="relative block h-full">
        <div className="relative h-full w-full transition-transform duration-500">
          <Image
            src={project.imageUrl ?? "/doge-troubleshoot.jpg"}
            alt={project.title}
            fill
            placeholder="blur"
            blurDataURL={shimmer([450, 600])}
            className="object-cover group-hover:scale-[1.02] brightness-90 transition-all duration-500 group-hover:brightness-100"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="from-background/80 to-background/40 md:h-[20%] h-[28%] bg-gradient-to-t backdrop-blur-xs sm:h-1/4" />
          </div>
        </div>
        <div className="text-foreground absolute right-0 bottom-0 left-0 p-6">
          <motion.h2
            className="font-basis-grotesque-pro-bold text-base tracking-wider sm:text-2xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}>
            {project.title}
          </motion.h2>
          <motion.p
            className="font-basis-grotesque-pro-regular text-muted-foreground mt-2 text-sm tracking-wider"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}>
            {project.description}
          </motion.p>
        </div>
      </Link>
    </motion.div>
  );
}
