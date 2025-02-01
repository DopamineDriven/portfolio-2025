"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { Post } from "@/lib/posts";
import { BreakoutWrapper } from "@/ui/atoms/breakout-wrapper";
import { CarouselWithFade } from "@/ui/carousel";
import LandingPageTypeWriter from "@/ui/typewriter";

export function HomeContent({ posts }: { posts: Post[] }) {
  const recentPosts = posts.slice(0, 3);
  return (
    <div className="theme-transition mx-auto flex flex-col items-center justify-center sm:px-4 lg:px-6 py-24 max-w-8xl">
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
        <section>
          <h2 className="theme-transition mb-4 text-2xl font-semibold">
            Featured Projects
          </h2>
          <div className="theme-transition grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <a
              href="https://experience.biolifeplasma.com"
              target="_blank"
              rel="noopener noreferrer"
              className="theme-transition bg-secondary block rounded-lg p-4 hover:opacity-90">
              <h3 className="theme-transition text-lg font-semibold">
                BioLife XR Experience
              </h3>
              <p className="theme-transition">
                Led development of immersive 3D Donor experience for BioLife's
                Plasma donation centers (a Takeda subsidiary).
              </p>
            </a>
            <a
              href="https://www.thefaderoominc.com"
              target="_blank"
              rel="noopener noreferrer"
              className="theme-transition bg-secondary block rounded-lg p-4 hover:opacity-90">
              <h3 className="theme-transition text-lg font-semibold">
                The Fade Room Inc
              </h3>
              <p className="theme-transition">
                Modern website for a Highland Park barbershop featuring customer
                reviews, a sizable gallery, and online booking.
              </p>
            </a>
            <div className="theme-transition bg-secondary rounded-lg p-4">
              <h3 className="theme-transition text-lg font-semibold">
                Cortina CRM
              </h3>
              <p className="theme-transition">
                Built a CRM using Nest.js and Next.js with custom
                authentication.
              </p>
            </div>
            <div className="theme-transition bg-secondary rounded-lg p-4">
              <h3 className="theme-transition text-lg font-semibold">
                Headless WP Strategy
              </h3>
              <p className="theme-transition">
                Architected Headless WordPress solutions for modern web
                presence.
              </p>
            </div>
          </div>
        </section>
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
