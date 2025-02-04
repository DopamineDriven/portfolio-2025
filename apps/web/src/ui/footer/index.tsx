"use clinet";

import type React from "react"; // Added import for React

import Link from "next/link";
import { ArrowUp, Mail } from "lucide-react";
import { GithubIcon } from "@/ui/svg/github";
import { LinkedinIcon } from "@/ui/svg/linkedin";
import { StackoverflowIcon } from "@/ui/svg/stackoverflow";
import { XIcon } from "@/ui/svg/x";

export function Footer() {
  return (
    <footer className="theme-transition bg-primary text-primary-foreground dark:bg-background/80 dark:text-foreground max-w-10xl p-4 mt-8">
      <div className="container mx-auto max-w-7xl px-6 text-center">
        <div className="flex flex-col gap-4 mx-auto md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between mx-auto gap-x-4">
          <Link
            href={`/#top`}
            scroll={true}
            className="text-muted-foreground ring-1 ring-foreground/50 rounded-full hover:text-foreground appearance-none text-sm transition-colors">
            <ArrowUp />
          </Link>
            <a
              href="mailto:andrew@windycitydevs.io"
              className="text-muted-foreground hover:text-foreground transition-colors">
              <span className="sr-only">Email</span>
              <Mail className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com/asross"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors">
              <span className="sr-only">LinkedIn</span>
              <LinkedinIcon className="h-5 w-5" />
            </a>
            <a
              href="https://x.com/Dopamine_Driven"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground appearance-none transition-colors">
              <span className="sr-only">X (Twitter)</span>
              <XIcon className="h-5 w-5" />
            </a>
            <a
              href="https://github.com/DopamineDriven"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors">
              <span className="sr-only">GitHub</span>
              <GithubIcon className="h-5 w-5" />
            </a>
            <a
              href="https://stackoverflow.com/users/13243520/andrew-ross?tab=profile"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors">
              <span className="sr-only">Stack Overflow</span>
              <StackoverflowIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
        <hr className="border-muted-foreground/20 my-8" />
        <p className="text-muted-foreground text-center text-sxs">
          &copy;{new Date().getFullYear()} Andrew Ross. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
