import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import StatusChip from "@/components/StatusChip";
import { productApps } from "@/lib/data";

export default function ProductAppsPage() {
  const ga = productApps.filter((a) => a.status === "ga").length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Platform catalogue"
        title="Product Apps"
        description="Assurance instruments and coaching modules built once, then enabled per tenant. ZIPROH runs the seven ZAI domains plus the Master Workbench."
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Apps in catalogue" value={String(productApps.length)} />
        <StatCard label="Generally available" value={String(ga)} />
        <StatCard
          label="In beta"
          value={String(productApps.filter((a) => a.status === "beta").length)}
        />
        <StatCard
          label="Planned"
          value={String(productApps.filter((a) => a.status === "planned").length)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {productApps.map((app) => (
          <div key={app.id} className="panel flex flex-col p-5">
            <div className="mb-3 flex items-start justify-between">
              <span className="font-mono text-xs font-semibold text-platform-hover">
                {app.code}
              </span>
              <StatusChip status={app.status} />
            </div>
            <h3 className="text-sm font-medium text-ink">{app.name}</h3>
            <p className="mt-1 font-mono text-2xs uppercase tracking-wide text-ink-dim">
              {app.domain}
            </p>
            <p className="mt-3 flex-1 text-xs leading-relaxed text-ink-muted">
              {app.description}
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <span className="text-2xs text-ink-dim">
                {app.tenantsUsing} tenant{app.tenantsUsing === 1 ? "" : "s"} using
              </span>
              <button className="btn-ghost text-2xs" type="button">
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
