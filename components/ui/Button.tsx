import Link from "next/link";
import type { ReactNode } from "react";

export type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "subtle" | "icon";
  ariaLabel?: string;
  className?: string;
};

export function Button({
  href,
  children,
  variant = "secondary",
  ariaLabel,
  className,
}: ButtonProps) {
  const base =
    "inline-flex items-center gap-2 rounded-xl text-sm font-medium border transition focus:outline-none focus-visible:ring-2 ring-accent";
  const variants: Record<string, string> = {
    primary:
      "px-4 py-2 bg-accent text-white hover:opacity-90 border-transparent",
    secondary:
      "px-4 py-2 bg-transparent text-foreground hover:bg-foreground/5 border-border",
    subtle:
      "px-4 py-2 bg-transparent text-muted hover:bg-foreground/5 border-transparent",
    icon: "p-2 bg-transparent text-foreground hover:bg-foreground/5 border-border",
  };

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={`${base} ${variants[variant]} ${className ?? ""}`}
    >
      {children}
    </Link>
  );
}

export default Button;

