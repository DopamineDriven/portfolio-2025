import type { ProjectDetail } from "@/types/projects";
import { ProjectGrid } from "@/ui/project-cards/card-grid";

export function ProjectCards({ projects }: { projects: ProjectDetail[] }) {
  return (
    <div className="mx-auto max-w-screen px-0 pt-16 pb-8 lg:pt-24 lg:pb-12">
      <h2 className="theme-transition container my-6 flex items-center gap-2 text-2xl text-current lg:px-8">
        <a className="appearance-auto" id="projects">
          Featured Projects
        </a>
      </h2>
      <ProjectGrid projects={projects} />
    </div>
  );
}
/**
 *           <GentleText
            content="Featured Projects"
            textClassName="appearance-auto"
            maxWidth="600px"
            as="a"
            textId="projects"
            animateOnlyInView={true}
            inViewThreshold={0.8}
            animationOptions={{ repeat: 0 }}
          />
 */
