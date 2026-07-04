"use client";

import { usePathname } from "next/navigation";
import { resolveTrail } from "@/lib/nav";
import { ChevronRight } from "lucide-react";

export default function TenantRail() {
  const pathname = usePathname();
  const trail = resolveTrail(pathname);

  return (
    <div className="flex h-11 shrink-0 items-center gap-2 border-b border-border bg-surface-sunken px-6 font-mono text-xs">
      {trail.map((node, i) => {
        const isFirst = i === 0;
        const isLast = i === trail.length - 1;
        return (
          <div key={node} className="flex items-center gap-2">
            <span className="flex items-center gap-1.5">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isFirst
                    ? "bg-platform"
                    : isLast
                    ? "bg-tenant"
                    : "bg-ink-dim"
                }`}
              />
              <span
                className={
                  isLast
                    ? "font-medium text-ink"
                    : isFirst
                    ? "tracking-wider text-ink-muted"
                    : "text-ink-muted"
                }
              >
                {node}
              </span>
            </span>
            {!isLast && <ChevronRight className="h-3 w-3 text-ink-dim" />}
          </div>
        );
      })}
    </div>
  );
}
