import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { InferGSPRT } from "@/types/next";
import { getProject, projectDetails } from "@/lib/project-data";
import { default as LoadingSpinner } from "@/ui/loading-spinner";
import { Project } from "@/ui/project";

export async function generateStaticParams() {
  return Object.keys(projectDetails).map(project => ({
    slug: project as keyof typeof projectDetails
  }));
}

export async function generateMetadata({
  params
}: InferGSPRT<typeof generateStaticParams>) {
  const { slug } = await params;
  const proj = getProject(slug as keyof typeof projectDetails);
  return {
    title: proj.title,
    description: proj.description.toLowerCase()
  } satisfies Metadata;
}

export default async function ProjectPage({
  params
}: InferGSPRT<typeof generateStaticParams>) {
  const { slug } = await params;
  if (!slug) {
    return notFound();
  }
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Project paramSlug={slug as keyof typeof projectDetails} />
    </Suspense>
  );
}
