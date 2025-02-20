"use client";

import type React from "react"; // Added import for React

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUp, Mail } from "lucide-react";
import { GithubIcon } from "@/ui/svg/github";
import { LinkedinIcon } from "@/ui/svg/linkedin";
import { StackoverflowIcon } from "@/ui/svg/stackoverflow";
import { XIcon } from "@/ui/svg/x";

export function Footer() {
  const [pathname, setPathname] = useState<string>("/");
  const path = usePathname();

  useEffect(() => {
    if (path !== pathname) {
      setPathname(path);
    }
  }, [pathname, path]);

  return (
    <footer className="theme-transition bg-background text-foreground dark:bg-background/80 dark:text-foreground max-w-10xl mt-8 p-4">
      <div className="container mx-auto max-w-7xl px-6 text-center">
        <div className="mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="mx-auto flex items-center justify-between gap-x-4">
            <Link
              href={`${pathname}#top`}
              scroll={true}
              className="text-muted-foreground ring-foreground/50 hover:text-foreground appearance-none rounded-full text-sm ring-1 transition-colors">
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
        <p className="text-muted-foreground text-sxs text-center">
          &copy;{new Date().getFullYear()} Andrew Ross. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
