import { projects } from "@/lib/project-data";
import { ProjectGrid } from "@/ui/project-cards/card-grid";

export function ProjectCards() {
  return (
    <section className="mx-auto px-4 py-16 md:py-24">
      <h2 className="theme-transition text-2xl text-current">
        <a className="appearance-auto" id="projects">
          Featured Projects
        </a>
      </h2>
      <ProjectGrid projects={projects} />
    </section>
  );
}
