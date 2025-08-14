"use client";

import PlanetCanvas from "./PlanetCanvas";
import ScrollIndicator from "./ScrollIndicator";
import { Typewriter } from "./Typewriter";

export default function Hero({ id }: { id?: string }) {
  return (
    <section id={id} className="relative h-screen w-full overflow-hidden">
      {/* TEXT */}
      <div className="relative z-50 isolate flex flex-col items-center pt-16">
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight">
          Hi! I&apos;m Meerav
        </h1>
        <p className="mt-3 text-lg md:text-xl text-slate-200">
          Senior in CS @ Penn State · Astro minor
        </p>
        <Typewriter text="Building AI tools for education and space tech" />
      </div>

      {/* PLANET / CANVAS */}
      <div className="absolute inset-0 pointer-events-none planet-layer">
        <PlanetCanvas />
      </div>
      <ScrollIndicator />
    </section>
  );
}
