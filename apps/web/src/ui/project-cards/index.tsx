import type { Project } from "@/types/projects";
import { ProjectGrid } from "@/ui/project-cards/card-grid";


export function ProjectCards({...projects}: readonly Project[]) {
  return (
    <section className="mx-auto px-4 py-16 md:py-24">
      <h2 className="theme-transition text-2xl text-current">
        Featured Projects
      </h2>
      <ProjectGrid projects={projects} />
    </section>
  );
}

