"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import Lightbox from "./Lightbox";
import Tag from "./Tag";
import { Button } from "./ui/Button";
import type { ResearchItem } from "@/data/research";

export default function ResearchCard({ item }: { item: ResearchItem }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const isLong = item.summary.length > 280;
  const text = expanded || !isLong ? item.summary : item.summary.slice(0, 280) + "...";

  return (
    <article className="rounded-2xl border bg-card/50 shadow-sm hover:shadow-md transition p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row gap-6">
        <button
          ref={btnRef}
          className="sm:w-2/5 w-full overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2 ring-accent"
          aria-label={`Open image for ${item.title}`}
          onClick={() => setOpen(true)}
        >
          <Image
            src={item.image.src}
            alt={item.image.alt}
            width={item.image.width ?? 1200}
            height={item.image.height ?? 800}
            className="h-auto w-full object-cover rounded-xl"
          />
        </button>

        <div className="sm:w-3/5 w-full space-y-3">
          <p className="text-sm text-muted">
            {item.venue} • {item.date}{item.location ? ` • ${item.location}` : ""}
          </p>
          <h3 className="text-xl md:text-2xl font-semibold">{item.title}</h3>

          {item.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <Tag key={tag} label={tag} />
              ))}
            </div>
          )}

          <p className="leading-relaxed">
            {text}
            {isLong && !expanded && (
              <button
                className="ml-1 text-link-hover hover:underline focus:outline-none focus-visible:ring-2 ring-accent rounded"
                onClick={() => setExpanded(true)}
              >
                Read more
              </button>
            )}
          </p>

          {item.keyFindings && item.keyFindings.length > 0 && (
            <ul className="list-disc pl-5 space-y-1">
              {item.keyFindings.map((k, i) => (
                <li key={i}>{k}</li>
              ))}
            </ul>
          )}

          {item.role && (
            <p>
              <span className="font-medium">My role:</span> {item.role}
            </p>
          )}
          {item.impact && (
            <p>
              <span className="font-medium">Impact:</span> {item.impact}
            </p>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            {item.links.publication && (
              <Button href={item.links.publication} variant="primary">
                Publication
              </Button>
            )}
            {item.links.slides && <Button href={item.links.slides}>Slides</Button>}
            {item.links.poster && <Button href={item.links.poster}>Poster</Button>}
            {item.links.website && <Button href={item.links.website}>Website</Button>}
            {item.links.notion && <Button href={item.links.notion}>Notion</Button>}
            {item.links.linkedin && (
              <Button href={item.links.linkedin} variant="subtle">
                LinkedIn
              </Button>
            )}
          </div>
        </div>
      </div>

      {open && (
        <Lightbox
          onClose={() => {
            setOpen(false);
            btnRef.current?.focus();
          }}
        >
          <Image
            src={item.image.src}
            alt={item.image.alt}
            width={item.image.width ?? 1600}
            height={item.image.height ?? 1000}
            className="h-auto w-auto max-w-[95vw] max-h-[85vh] object-contain"
            priority
          />
        </Lightbox>
      )}
    </article>
  );
}

