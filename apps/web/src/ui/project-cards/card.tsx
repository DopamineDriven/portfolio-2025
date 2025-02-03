"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";


export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  slug: string;
}


interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group bg-background relative aspect-square w-full overflow-hidden">
      <Link
        href={`/projects/${project.slug}`}
        id={`project-${project.slug}`}
        className="relative block h-full">
        <div className="relative h-full w-full transition-transform duration-500 group-hover:scale-105">
          <Image
            src={project.imageUrl || "/placeholder.svg"}
            alt={project.title}
            fill
            className="object-cover brightness-90 transition-all duration-500 group-hover:brightness-100"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="from-background/80 h-1/4 bg-gradient-to-t to-transparent backdrop-blur-xs" />
          </div>
        </div>
        <div className="text-foreground absolute right-0 bottom-0 left-0 p-6">
          <motion.h2
            className="font-basis-grotesque-pro-bold text-2xl tracking-wider"
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
