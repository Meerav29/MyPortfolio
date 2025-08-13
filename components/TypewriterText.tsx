"use client";

import { useEffect, useState } from "react";

export default function TypewriterText({
  text,
  speed = 80,
  delay = 0,
  className = "",
}: {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    let interval: NodeJS.Timeout | undefined;

    timeout = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        setDisplay((prev) => prev + text.charAt(i));
        i += 1;
        if (i >= text.length && interval) {
          clearInterval(interval);
        }
      }, speed);
    }, delay);

    return () => {
      if (timeout) clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, delay]);

  return (
    <span className={className}>
      {display}
      <span className="border-r-2 border-slate-200 animate-pulse ml-0.5" />
    </span>
  );
}

