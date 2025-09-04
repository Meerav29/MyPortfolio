import { projects } from "@/lib/projects";
import { notFound, redirect } from "next/navigation";

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) notFound();

  redirect(project.redirect);
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

