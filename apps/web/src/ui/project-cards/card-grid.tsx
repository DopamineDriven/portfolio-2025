"use client";

import { motion } from "motion/react";
import type { ProjectDetail } from "@/types/projects";
import { ProjectCard } from "@/ui/project-cards/card";

export function ProjectGrid({ projects }: { projects: ProjectDetail[] }) {
  return (
    <div className="grid grid-cols-1 gap-y-16 md:grid-cols-2 md:gap-x-6 lg:gap-x-8">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className={`${index % 2 === 0 ? "md:mt-24" : ""}`}>
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </div>
  );
}
