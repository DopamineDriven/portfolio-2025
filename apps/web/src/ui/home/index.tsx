"use client";

import { motion } from "motion/react";
import type { PostDetails } from "@/types/posts";
import { ProjectDetail } from "@/types/projects";
import { BreakoutWrapper } from "@/ui/atoms/breakout-wrapper";
import { CarouselWithFade } from "@/ui/carousel";
import ArLogoParticles from "@/ui/particle/temp";
import { PostCards } from "@/ui/post-cards";
import { ProjectCards } from "@/ui/project-cards";
import LandingPageTypeWriter from "@/ui/typewriter";
import { WorldTourLayout } from "@/ui/world-tour";

export function HomeContent({
  posts,
  projects
}: {
  posts: PostDetails[];
  projects: ProjectDetail[];
}) {
  return (
    <div className="theme-transition 2xl:max-w-8xl mx-auto flex max-w-3xl flex-col items-center justify-center pt-24 pb-16 sm:max-w-7xl sm:px-4 lg:px-6">
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
          <BreakoutWrapper>
            <CarouselWithFade />
          </BreakoutWrapper>
        </section>
        <section>
          <ProjectCards projects={projects} />
        </section>
        <section>
          <BreakoutWrapper>
            <ArLogoParticles />
          </BreakoutWrapper>
        </section>
        <section>
          <PostCards posts={posts} />
        </section>
        <WorldTourLayout />
      </div>
    </div>
  );
}
