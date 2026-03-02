"use client";
import Image from "next/image";

export default function IllustratedOrbit() {
  return (
    <div
      className="relative w-full h-[80vh] rounded-2xl border border-border shadow-sm
                 overflow-hidden bg-card"
      aria-hidden="true"
    >
      {/* vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(transparent,rgba(15,23,42,0.08))]" />

      {/* planet */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative w-72 h-72 md:w-96 md:h-96">
          <Image src="/planet.png" alt="Planet" fill priority className="object-contain drop-shadow-sm" />
        </div>
      </div>

      {/* ring */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="w-[85%] h-[85%] rounded-full border-2 border-blue-200/40" />
      </div>

      {/* satellite on circular path */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative w-64 h-64 sm:w-[480px] sm:h-[480px] md:w-[620px] md:h-[620px]">
          <div className="absolute left-1/2 top-1/2 orbit">
            {/* radius scales with container: 100px mobile / 220px sm / 280px md */}
            <div className="translate-x-[100px] -translate-y-[8px] sm:translate-x-[220px] sm:-translate-y-[20px] md:translate-x-[280px]">
              <div className="relative w-[60px] h-[60px] md:w-[90px] md:h-[90px]">
                <Image src="/satellite.png" alt="Satellite" fill className="object-contain drop-shadow-[0_6px_14px_rgba(2,6,23,0.15)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
