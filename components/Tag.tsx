import type { HTMLAttributes } from "react";

export function Tag({ label, className = "", ...props }: { label: string } & HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-border px-3 py-1 text-sm text-muted ${className}`}
      {...props}
    >
      {label}
    </span>
  );
}

export default Tag;

