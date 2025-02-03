"use client"

import { motion } from "motion/react"
import Image from "next/image"
import Link from "next/link"

export interface Project {
  id: string
  title: string
  description: string
  imageUrl: string
  link: string
}



interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative aspect-square w-full overflow-hidden bg-background"
    >
      <Link href={project.link} className="relative block h-full">
        <div className="relative h-full w-full transition-transform duration-500 group-hover:scale-105">
          <Image
            src={project.imageUrl || "/placeholder.svg"}
            alt={project.title}
            fill
            className="object-cover brightness-90 transition-all duration-500 group-hover:brightness-100"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="h-1/4 bg-gradient-to-t from-background/80 to-transparent backdrop-blur-xs" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-foreground">
          <motion.h2
            className="font-basis-grotesque-pro-bold text-2xl tracking-wider"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {project.title}
          </motion.h2>
          <motion.p
            className="font-basis-grotesque-pro-regular mt-2 text-sm tracking-wider text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {project.description}
          </motion.p>
        </div>
      </Link>
    </motion.div>
  )
}

