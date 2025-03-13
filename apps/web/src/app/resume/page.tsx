import { Metadata } from "next";
import { InteractiveResume } from "@/ui/resume";

export const metadata = {
title: {    default: "Andrew Ross",
  template: "%s | Portfolio"},
  description:
    "Portfolio and resume of Andrew S. Ross, Software Engineering Lead with expertise in React, TypeScript, and Next.js"
} satisfies Metadata;

export default async function ResumePage() {
  return <InteractiveResume />;
}
