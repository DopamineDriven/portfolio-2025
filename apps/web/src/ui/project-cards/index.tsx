import { slugify } from "@/lib/slugify";
import type { Project } from "./card";
import { ProjectGrid } from "./card-grid";

const projects = [
  {
    id: "1",
    title: "NEXT CHESS BOT",
    description: "ELEVATE YOUR GAME",
    imageUrl:
      "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess-v2/public/og.png",
    link: "https://www.nextchessbot.com",
    slug: slugify("NEXT CHESS BOT")
  },
  {
    id: "2",
    title: "THE FADE ROOM INC",
    description: "EXPERIENCE THE ART OF GROOMING AT ITS FINEST",
    imageUrl:
      "https://raw.githubusercontent.com/DopamineDriven/faderoom/master/apps/web/public/womens-undercut.png",
    link: "/projects/subreddit-search",
    slug: slugify("THE FADE ROOM INC")
  },
  {
    id: "3",
    title: "BIOLIFE XR EXPERIENCE",
    description: "THERE'S PURPOSE IN YOUR PLASMA",
    imageUrl:
      "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/purpose-plasma.png",
    link: "/projects/drisdell",
    slug: "BIOLIFE PLASMA SERVICES DONOR EXPERIENCE"
  },
  {
    id: "4",
    title: "HILLSIDE TO HARBOR",
    description: "HELPING YOU NAVIGATE CHALLENGING SITUATIONS",
    imageUrl:
      "https://raw.githubusercontent.com/windycitydevs/turbo/main/apps/hillsidetoharbor/public/VerticalWithTextSquare.png",
    link: "/projects/homesharing",
    slug: slugify("HILLSIDE TO HARBOR")
  }
] as const satisfies readonly Project[];


export function ProjectCards() {
  return (
    <section className="mx-auto px-4 py-16 md:py-24 bg-current">
      <h2 className="text-current theme-transition text-2xl">Featured Projects</h2>
      <ProjectGrid projects={projects} />
    </section>
  );
}
// #2A368F
