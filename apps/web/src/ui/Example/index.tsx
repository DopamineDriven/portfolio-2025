"use client";

import { AnimatePresence, motion } from "motion/react";
import { getMDXContent } from "@/lib/mdx";
import { MDXContent } from "@/ui/Mdx/MDXContent";

// This would typically come from an API or build-time generation
const exampleMDX = `---
title: TypeScript Code Examples
description: Welcome to our TypeScript code examples. Hover over the code to see type information and documentation.
date: 2024-01-01
tags: ['typescript', 'react', 'mdx']
---

## React Component Example

\`\`\`tsx
import React from 'react';

// @errors: 2339
type Props = {
  name: string;
  age: number;
};

const ExampleComponent: React.FC<Props> = ({ name, age }) => {
  return (
    <div>
      <p>Hello, {name}!</p>
      <p>You are {age} years old.</p>
      <p>{randomFunction()}</p>
    </div>
  );
};

export default ExampleComponent;
\`\`\`

Hover over the component props or the error to see more information!
`;

export default function Home() {
  const mdxData = getMDXContent(exampleMDX);


  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };


  if (!mdxData) {
    return <div>Error loading content</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key="home"
        className="to-background/50 flex min-h-screen flex-col items-center justify-between bg-gradient-to-b from-background p-8 pt-32"
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.5 }}>
        <div className="z-10 w-full max-w-3xl items-center justify-between font-mono text-sm">
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}>
            <h1 className="mb-2 text-4xl font-bold text-foreground">
              {mdxData.frontmatter.title}
            </h1>
            {mdxData.frontmatter.description && (
              <p className="text-muted-foreground">
                {mdxData.frontmatter.description}
              </p>
            )}
            {mdxData.frontmatter.date && (
              <p className="text-muted-foreground mt-2 text-sm">
                {new Date(mdxData.frontmatter.date).toLocaleDateString()}
              </p>
            )}
            {mdxData.frontmatter.tags && (
              <div className="mt-4 flex justify-center gap-2">
                {mdxData.frontmatter.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-secondary text-secondary-foreground rounded-md px-2 py-1 text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
          <motion.div
            className="bg-card text-card-foreground rounded-lg p-6 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}>
            <MDXContent source={mdxData.content} />
          </motion.div>
        </div>
      </motion.main>
    </AnimatePresence>
  );
}
