"use client";

import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  once?: boolean;
};

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  distance = 24,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [once]);

  const style = {
    ["--reveal-delay" as string]: `${delay}ms`,
    ["--reveal-distance" as string]: `${distance}px`,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      style={style}
      className={`scroll-reveal ${isVisible ? "is-visible" : ""} ${className ?? ""}`.trim()}
    >
      {children}
    </div>
  );
}
