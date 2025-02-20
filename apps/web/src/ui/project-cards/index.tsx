import type { ProjectDetail } from "@/types/projects";
import { ProjectGrid } from "@/ui/project-cards/card-grid";

export function ProjectCards({ projects }: { projects: ProjectDetail[] }) {
  return (
    <section className="sm:container mx-auto px-0 py-4 md:px-4">
      <h2 className="theme-transition my-8 flex items-center gap-2 text-2xl text-current">
        <a className="appearance-auto" id="projects">
          Featured Projects
        </a>
      </h2>
      <ProjectGrid projects={projects} />
    </section>
  );
}
