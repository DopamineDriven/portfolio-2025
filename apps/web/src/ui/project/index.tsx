"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { projectDetails } from "@/lib/project-data";
import { shimmer } from "@/lib/shimmer";
import { Button } from "@/ui/atoms/button";

export function Project({ paramSlug }: { paramSlug: string }) {
  const router = useRouter();
  const project = projectDetails[paramSlug as keyof typeof projectDetails];

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  if (!project) {
    return null; // or a custom 404 component
  }

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/?project=${project.slug}`);
  };

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
            src={project.imageUrl || "/doge-troubleshoot.jpg"}
            alt={project.title}
            width={450}
            blurDataURL={shimmer([450, 600])}
            placeholder="blur"
            height={600}
            className="rounded-lg object-cover"
          />
        </motion.div>
        <div className="flex flex-col justify-between">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}>
            <h1 className="font-basis-grotesque-pro-bold mb-2 text-3xl">
              {project.title}
            </h1>
            <p className="font-basis-grotesque-pro-regular text-muted-foreground mb-4 text-lg">
              {project.description}
            </p>
            <p className="prose-p:text-pretty mb-4">{project.content}</p>
            <div className="mb-4">
              <h2 className="font-basis-grotesque-pro-bold mb-2 text-xl">
                Technologies
              </h2>
              <ul className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
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
              Completed in {project.date}
            </p>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 flex items-center gap-4">
            <Button onClick={handleBackClick}>Back to Projects</Button>
            {project.externalLink && (
              <Button asChild variant="outline">
                <a
                  href={project.externalLink}
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
