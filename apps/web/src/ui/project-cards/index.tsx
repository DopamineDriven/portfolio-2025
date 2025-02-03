import type { Project } from "./card";
import { ProjectGrid } from "./card-grid";

const projects: Project[] = [
  {
    id: "1",
    title: "NEXT CHESS BOT",
    description: "ELEVATE YOUR GAME",
    imageUrl:
      "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess-v2/public/og.png",
    link: "https://www.nextchessbot.com"
  },
  {
    id: "2",
    title: "SUBREDDIT SEARCH",
    description: "SOLE DEVELOPER, UI/UX",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/old-portfolio-cards-nyg2NiFU0nVgsq4YJvmOO8K8DgZcMQ.png",
    link: "/projects/subreddit-search"
  },
  {
    id: "3",
    title: "DRISDELL CONSULTING",
    description: "SOLE DEVELOPER, UI/UX",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/old-portfolio-cards-nyg2NiFU0nVgsq4YJvmOO8K8DgZcMQ.png",
    link: "/projects/drisdell"
  },
  {
    id: "4",
    title: "HOMESHARING HUB",
    description: "SOLE DEVELOPER, UI/UX",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/old-portfolio-cards-nyg2NiFU0nVgsq4YJvmOO8K8DgZcMQ.png",
    link: "/projects/homesharing"
  }
];

export default function Page() {
  return (
    <main className="container mx-auto px-4 py-16 md:py-24">
      <ProjectGrid projects={projects} />
    </main>
  );
}
