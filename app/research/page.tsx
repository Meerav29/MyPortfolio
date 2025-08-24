import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { research } from "@/lib/research";

export const metadata = {
  title: "Research — Meerav Shah",
};

export default function ResearchPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-3xl font-semibold text-black dark:text-white">Research</h1>
      <p className="mt-4 text-muted">Selected research outputs and publications.</p>
      <div className="mt-8 grid gap-6">
        {research.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-border p-6 bg-card"
          >
            <h2 className="text-lg font-medium text-black dark:text-white">
              {item.title}
            </h2>
            <p className="mt-2 text-muted text-sm leading-relaxed">
              {item.summary}
            </p>
            {item.link && (
              <Link
                href={item.link}
                className="mt-2 inline-flex items-center gap-1 text-sm text-link-hover hover:underline"
              >
                Learn more <ExternalLink size={16} />
              </Link>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

