"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { Post } from "@/lib/posts";
import { BreakoutWrapper } from "@/ui/atoms/breakout-wrapper";
import { CarouselWithFade } from "@/ui/carousel";
import LandingPageTypeWriter from "@/ui/typewriter";
import { ProjectCards } from "../project-cards";

export function HomeContent({ posts }: { posts: Post[] }) {
  const recentPosts = posts.slice(0, 3);
  return (
    <div className="theme-transition 2xl:max-w-8xl mx-auto flex max-w-7xl flex-col items-center justify-center py-24 sm:px-4 lg:px-6">
      <motion.div
        initial={false}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="fixed inset-0 z-[-1]"
      />
      <div className="theme-transition space-y-12">
        <section>
          <LandingPageTypeWriter />
        </section>
        <section className="mx-auto my-12">
          <h2 className="mb-8 text-center text-2xl font-bold">
            Technical Proficiencies
          </h2>
          <BreakoutWrapper>
            <CarouselWithFade />
          </BreakoutWrapper>
        </section>
        <ProjectCards />
        <section>
          <h2 className="theme-transition mb-4 text-2xl font-semibold">
            Recent Blog Posts
          </h2>
          <div className="theme-transition grid gap-6">
            {recentPosts.map(post => (
              <article key={post.slug} className="group">
                <Link href={`/posts/${post.slug}`}>
                  <div className="space-y-2">
                    <h3 className="theme-transition group-hover:text-primary text-xl font-semibold">
                      {post.title}
                    </h3>
                    <time className="theme-transition text-secondary text-sm">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </time>
                    <p className="theme-transition text-foreground/80">
                      {post.description}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
          <div className="mt-6">
            <Link
              href="/posts"
              className="theme-transition text-primary hover:underline">
              View all blog posts →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
