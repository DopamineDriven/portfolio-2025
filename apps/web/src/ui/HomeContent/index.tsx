"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { Post } from "@/lib/posts";
import { useThemeTransition } from "@/hooks/use-theme-transition";

export const proficiencies = [
  "Next.js / React.js",
  "TypeScript / Node.js",
  "Packages / Workspaces",
  "DX / Technical Debt Deterrence",
  "AWS / GCP / Azure",
  "Postgres / Mongo",
  "UI/UX Design / Figma",
  "Auth / Analytics",
  "Docker / Kubernetes",
  "WordPress / Sanity"
];

export function HomeContent({ posts }: { posts: Post[] }) {
  const recentPosts = posts.slice(0, 3); // Get the 3 most recent posts
  const { transitionTheme } = useThemeTransition();

  return (
    <div className="theme-transition flex flex-col items-center justify-center p-24 pt-32">
      <motion.div
        initial={false}
        animate={{
          backgroundColor:
            transitionTheme === "dark"
              ? "rgb(26, 26, 26)"
              : "rgb(255, 255, 255)"
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="fixed inset-0 z-[-1]"
      />
      <div className="theme-transition space-y-12">
        <section>
          <h1 className="theme-transition mb-4 text-4xl font-bold">
            Portfolio 2025
          </h1>
          <p className="theme-transition text-xl">
            I'm Andrew S. Ross, a passionate engineer and tinkerer creating
            amazing web experiences.
          </p>
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
              className="theme-transition block rounded-lg bg-secondary p-4 hover:opacity-90">
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
              className="theme-transition block rounded-lg bg-secondary p-4 hover:opacity-90">
              <h3 className="theme-transition text-lg font-semibold">
                The Fade Room Inc
              </h3>
              <p className="theme-transition">
                Modern website for a Highland Park barbershop featuring customer
                reviews, a sizable gallery, and online booking.
              </p>
            </a>
            <div className="theme-transition rounded-lg bg-secondary p-4">
              <h3 className="theme-transition text-lg font-semibold">
                Cortina CRM
              </h3>
              <p className="theme-transition">
                Built a CRM using Nest.js and Next.js with custom
                authentication.
              </p>
            </div>
            <div className="theme-transition rounded-lg bg-secondary p-4">
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
                    <h3 className="theme-transition text-xl font-semibold group-hover:text-primary">
                      {post.title}
                    </h3>
                    <time className="theme-transition text-sm text-secondary">
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
        <section>
          <div className="theme-transition bg-current py-24 sm:py-32">
            <div className="theme-transition mx-auto max-w-7xl px-6 lg:px-8">
              <h2 className="theme-transition mb-4 text-2xl font-semibold">
                Key Skills
              </h2>
              <ul
                role="list"
                className="theme-transition -mx-6 grid list-none grid-cols-2 gap-0.5 overflow-hidden bg-background/80 text-foreground sm:mx-0 sm:rounded-2xl md:grid-cols-3">
                {proficiencies.map((proficiency, i) => (
                  <li
                    className="theme-transition rounded-lg bg-primary p-8 text-center align-middle text-primary-foreground dark:bg-foreground/80 dark:text-background sm:p-10"
                    key={`proficiency-${i++}`}>
                    {proficiency}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
