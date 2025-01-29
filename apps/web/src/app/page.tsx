import type { Metadata } from "next";
import { getPosts } from "@/lib/posts";
import { HomeContent } from "@/ui/home";

export const metadata = {
  title: "Home"
} satisfies Metadata;

export default async function Home() {
  const posts = await getPosts();
  return <HomeContent posts={posts} />;
}
