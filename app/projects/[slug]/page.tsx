import { projects } from "@/lib/projects";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <Link href="/" className="text-sm text-muted hover:text-link-hover">
        &larr; Back
      </Link>
      <h1 className="mt-4 text-3xl font-semibold text-black dark:text-white">
        {project.title}
      </h1>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((t) => (
          <span
            key={t}
            className="text-xs text-black dark:text-white rounded-full border border-black dark:border-white px-2 py-1 bg-transparent"
          >
            {t}
          </span>
        ))}
      </div>
      <p className="mt-6 text-muted leading-relaxed">{project.content}</p>
      {project.source && (
        <a
          href={project.source}
          className="mt-6 inline-flex items-center gap-1 text-sm text-link-hover hover:underline"
        >
          View source <ExternalLink size={16} />
        </a>
      )}
    </main>
  );
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

