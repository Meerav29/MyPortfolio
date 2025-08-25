import Link from "next/link";
import type { ReactNode } from "react";

export type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "subtle";
};

export function Button({ href, children, variant = "secondary" }: ButtonProps) {
  const base = "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium border transition focus:outline-none focus-visible:ring-2 ring-accent";
  const variants: Record<string, string> = {
    primary: "bg-accent text-white hover:opacity-90 border-transparent",
    secondary: "bg-transparent text-foreground hover:bg-foreground/5 border-border",
    subtle: "bg-transparent text-muted hover:bg-foreground/5 border-transparent",
  };

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${variants[variant]}`}
    >
      {children}
    </Link>
  );
}

export default Button;

