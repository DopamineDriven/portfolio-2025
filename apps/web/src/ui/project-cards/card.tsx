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
      className="group relative aspect-[3/4]! max-w-[calc(100vw-10vw)] overflow-hidden  mx-auto">
      <Link
        href={project.link}
        id={`${project.slug}`}
        className="relative block h-full">
        <div className="transition-transform duration-500">
          <Image
            src={project.homeImageUrl ?? "/doge-troubleshoot.jpg"}
            alt={project.title}
            width={768}
            height={1024}
            placeholder="blur"
            blurDataURL={shimmer([768, 1024])}
            className="object-contain group-hover:scale-[1.005] brightness-90 transition-all duration-500 group-hover:brightness-100"
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
