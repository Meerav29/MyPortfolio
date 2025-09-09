"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PlanetCanvas from "./PlanetCanvas";
import ScrollIndicator from "./ScrollIndicator";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    listener();
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

export default function Hero({ id }: { id?: string }) {
  const isMobile = useMediaQuery("(max-width: 767px)");
  return (
    <section id={id} className="relative h-screen w-full overflow-hidden">
      {/* Full-screen background animation */}
      <div className="absolute inset-0">
        <PlanetCanvas offsetX={isMobile ? 0.5 : 2} scale={isMobile ? 0.8 : 1} />
      </div>
      {/* Bottom fade to page background for cohesion */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-transparent to-[var(--background)]" />

      {/* Left-aligned content over the canvas */}
      <div className="relative z-20 flex h-full items-start md:items-center">
          <div className="pl-10 md:pl-20 lg:pl-28 pr-6 max-w-xl pt-24 md:pt-0">
            <div className="animate-[float_6s_ease-in-out_infinite]">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-black dark:text-white">
                Hi I&apos;m Meerav!
              </h1>
              <p className="mt-3 text-base md:text-lg text-muted">
                Senior in CS @ Penn State • Astro minor
              </p>
            </div>

            <p className="mt-6 text-sm md:text-base leading-relaxed text-muted max-w-prose">
              I&apos;m an undergraduate senior in Computer Science at Penn State, minoring in Astrophysics. I build practical, minimal tools—from advising assistants that free up faculty time to UAV analytics that make flight safer in icing conditions. I care about clean design, clear impact, and shipping real things.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/research"
                className="rounded-xl border border-border bg-card px-4 py-2 text-sm hover:bg-card/80 transition-colors"
              >
                Research Outputs
              </Link>
              <Link
                href="/experience"
                className="rounded-xl border border-border bg-card px-4 py-2 text-sm hover:bg-card/80 transition-colors"
              >
                Work Experience
              </Link>
            </div>
          </div>
        </div>

      {/* Scroll affordance */}
      <ScrollIndicator />
    </section>
  );
}
