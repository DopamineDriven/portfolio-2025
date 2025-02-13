import type { Metadata } from "next";
import { getPosts } from "@/lib/posts";
import { getProjects } from "@/lib/projects";
import { HomeContent } from "@/ui/home";

export const metadata = {
  title: "Home"
} satisfies Metadata;

export default async function Home() {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);
  return <HomeContent posts={posts} projects={projects} />;
}
