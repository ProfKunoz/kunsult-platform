"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import { platformNav, tenantNav } from "@/lib/nav";
import {
  Building2,
  BrainCircuit,
  Database,
  Library,
  ShieldCheck,
  LayoutGrid,
  Factory,
  Boxes,
} from "lucide-react";

const icons: Record<string, ComponentType<{ className?: string }>> = {
  "/operations": Building2,
  "/tenant-factory": Factory,
  "/intelligence": BrainCircuit,
  "/data-lake": Database,
  "/knowledge-lake": Library,
  "/qa-centre": ShieldCheck,
  "/apps": LayoutGrid,
  "/tenants/ziproh": Boxes,
};

function NavLink({
  href,
  label,
  pathname,
}: {
  href: string;
  label: string;
  pathname: string;
}) {
  const Icon = icons[href];
  const active = pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={`group flex items-center gap-2.5 rounded px-2.5 py-2 text-sm transition-colors ${
        active
          ? "bg-platform-soft text-ink"
          : "text-ink-muted hover:bg-surface-raised hover:text-ink"
      }`}
    >
      {Icon ? (
        <Icon
          className={`h-4 w-4 shrink-0 ${
            active ? "text-platform-hover" : "text-ink-dim group-hover:text-ink-muted"
          }`}
        />
      ) : null}
      <span className="truncate">{label}</span>
      {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-platform" />}
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex h-14 items-center gap-2.5 border-b border-border px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-platform font-mono text-xs font-bold text-white">
          K
        </div>
        <div className="leading-tight">
          <p className="font-mono text-2xs uppercase tracking-widest text-ink-dim">
            Kunsult
          </p>
          <p className="text-sm font-semibold text-ink">Platform</p>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        <div>
          <p className="label-eyebrow px-2.5 pb-2">Platform</p>
          <div className="space-y-0.5">
            {platformNav.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                pathname={pathname}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="label-eyebrow px-2.5 pb-2">Tenants</p>
          <div className="space-y-0.5">
            {tenantNav.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                pathname={pathname}
              />
            ))}
            <Link
              href="/tenant-factory"
              className="flex items-center gap-2.5 rounded px-2.5 py-2 text-sm text-ink-dim transition-colors hover:bg-surface-raised hover:text-ink-muted"
            >
              <span className="flex h-4 w-4 items-center justify-center text-base leading-none">
                +
              </span>
              <span>Provision tenant</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-tenant-soft font-mono text-xs font-semibold text-tenant">
            EK
          </div>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-medium text-ink">
              Prof. E. Kunonga
            </p>
            <p className="truncate text-xs text-ink-dim">Platform Owner</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
