"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import PlanetCanvas from "./PlanetCanvas";
import ScrollIndicator from "./ScrollIndicator";
import { useScrollProgress } from "../lib/useScrollProgress";
import { useReducedMotion } from "../lib/useReducedMotion";

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
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollDistance, setScrollDistance] = useState<number>();

  useEffect(() => {
    const measure = () => setScrollDistance(sectionRef.current?.offsetHeight);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const scrollProgress = useScrollProgress(scrollDistance);
  const reducedMotion = useReducedMotion();
  const effectiveScrollProgress = reducedMotion ? 0 : scrollProgress;
  const glowEnabled = !isMobile && !reducedMotion;
  return (
    <section ref={sectionRef} id={id} className="relative h-[200vh] w-full">
      {/* Full-screen background animation, pinned to the viewport while the
          taller section scrolls beneath it so the planet has room to drift */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <PlanetCanvas
            offsetX={isMobile ? 0.5 : 2}
            scale={isMobile ? 0.8 : 1}
            scrollProgress={effectiveScrollProgress}
            glowEnabled={glowEnabled}
          />
        </div>
        {/* Bottom fade to page background for cohesion */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-transparent to-[var(--background)]" />

        {/* Left-aligned content over the canvas */}
        <div className="pointer-events-none relative z-20 flex h-full items-start md:items-center">
          <div className="pointer-events-auto pl-10 md:pl-20 lg:pl-28 pr-6 max-w-xl pt-24 md:pt-0">
            <div>
              <h1 className="text-xl md:text-3xl font-normal leading-tight text-muted tracking-tight">
                Hi, I&apos;m Meerav Shah! An <span className="text-foreground font-semibold">undergraduate senior in Computer Science</span> at Penn State, minoring in <span className="text-foreground font-semibold">Astrophysics</span>.

                <br className="hidden md:block" />
                <span className="block mt-4">
                  I build <span className="text-foreground font-semibold">practical, minimal tools</span>: from <span className="text-foreground font-semibold">advising assistants</span> that free up faculty time to <span className="text-foreground font-semibold">UAV analytics</span> that make flight safer.
                </span>

                <span className="block mt-4">
                  I care about <span className="text-foreground font-semibold">clean design</span>, <span className="text-foreground font-semibold">clear impact</span>, and <span className="text-foreground font-semibold">shipping real things</span>.
                </span>
              </h1>
            </div>

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
      </div>
    </section>
  );
}
