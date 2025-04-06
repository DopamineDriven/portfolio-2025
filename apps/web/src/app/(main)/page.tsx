import type { Metadata } from "next";
import { getAllPosts, getAllProjects } from "@/lib/parse-frontmatter";
import { HomeContent } from "@/ui/home";

export const metadata = {
  title: "Home"
} satisfies Metadata;

export default async function Home() {
  const [projects, posts] = await Promise.all([
    getAllProjects(),
    getAllPosts()
  ]);
  return <HomeContent posts={posts} projects={projects} />;
}
