"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export default function IllustratedOrbit() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="relative w-full h-[420px] md:h-[520px] rounded-2xl border shadow-sm
                 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50"
      aria-hidden="true"
    >
      {/* Subtle vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(transparent,rgba(15,23,42,0.08))]" />

      {/* Planet (center) */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative w-72 h-72 md:w-96 md:h-96">
          <Image
            src="/planet.png"
            alt="Planet"
            fill
            priority
            className="object-contain drop-shadow-sm"
          />
        </div>
      </div>

      {/* Orbit path (invisible, for layout) */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative w-[480px] h-[480px] md:w-[620px] md:h-[620px]">
          {/* Satellite on a circular path using rotate animation */}
          <motion.div
            initial={false}
            animate={reduceMotion ? {} : { rotate: 360 }}
            transition={reduceMotion ? {} : { duration: 28, repeat: Infinity, ease: "linear" }}
            className="absolute left-1/2 top-1/2"
            style={{
              // This element rotates, the child is offset to the orbit radius
              transformOrigin: "0 0",
            }}
          >
            <div
              // radius: adjust translateX/Y to change orbit distance
              className="translate-x-[220px] -translate-y-[20px]"
            >
              <div className="relative w-[90px] h-[90px]">
                <Image
                  src="/satellite.png"
                  alt="Satellite"
                  fill
                  className="object-contain drop-shadow-[0_6px_14px_rgba(2,6,23,0.15)]"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Soft ring accent */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="w-[85%] h-[85%] rounded-full border-2 border-blue-200/40" />
      </div>
    </div>
  );
}
