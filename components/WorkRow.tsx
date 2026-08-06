// components/WorkRow.tsx
import { ArrowUpRight } from "lucide-react";
import type { WorkItem } from "@/data/work";

interface WorkRowProps {
  item: WorkItem;
  /** If true, render as an anchor tag; if false, render as a div */
  linked?: boolean;
}

export function WorkRow({ item, linked = true }: WorkRowProps) {
  const inner = (
    <div className="group flex items-start gap-4 py-5 border-t border-border">
      <div className="w-0.5 min-h-[2.5rem] bg-border rounded-full shrink-0 mt-1" />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-foreground leading-snug">{item.org}</p>
            <p className="text-xs text-muted mt-0.5">{item.role}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-muted/60 tabular-nums whitespace-nowrap">{item.period}</span>
            {item.link && (
              <ArrowUpRight
                size={13}
                className="text-muted/40 group-hover:text-muted transition-colors"
              />
            )}
          </div>
        </div>
        <p className="mt-2 text-sm text-muted leading-relaxed">{item.description}</p>
      </div>
    </div>
  );

  if (linked && item.link) {
    return (
      <a href={item.link} target="_blank" rel="noopener noreferrer" className="block hover:bg-card/40 transition-colors rounded-sm -mx-2 px-2">
        {inner}
      </a>
    );
  }

  return <div className="rounded-sm -mx-2 px-2 hover:bg-card/40 transition-colors">{inner}</div>;
}
