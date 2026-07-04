import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import StatusChip from "@/components/StatusChip";
import { getTenantByCode, getEngagementsForTenant, productApps } from "@/lib/data";

export default function ZiprohTenantPage() {
  const tenant = getTenantByCode("ZIPROH")!;
  const tenantEngagements = getEngagementsForTenant(tenant.id);
  const enabledApps = productApps.filter(
    (a) => a.domain !== "Executive Coaching"
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={`Tenant 001 · ${tenant.region}`}
        title={tenant.name}
        description={tenant.sector}
        actions={
          <Link href="/tenants/ziproh/engagements/new" className="btn-primary">
            New engagement
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Active engagements" value={String(tenant.activeEngagements)} />
        <StatCard label="Modules enabled" value={`${tenant.modulesEnabled}/8`} />
        <StatCard label="Tenant health" value={`${tenant.healthScore}`} deltaTone="positive" delta="Stable" />
        <StatCard label="Status" value={tenant.status === "active" ? "Active" : tenant.status} />
      </div>

      <div className="panel">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-ink">Engagements</h2>
          <Link href="/tenants/ziproh/engagements/new" className="text-xs text-platform-hover hover:underline">
            + New engagement
          </Link>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="th-cell">Engagement</th>
              <th className="th-cell">Client</th>
              <th className="th-cell">Lead</th>
              <th className="th-cell">Status</th>
              <th className="th-cell">Risk</th>
              <th className="th-cell">Evidence</th>
              <th className="th-cell">Due</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tenantEngagements.map((e) => (
              <tr key={e.id} className="hover:bg-surface-raised/60">
                <td className="td-cell font-medium text-ink">{e.name}</td>
                <td className="td-cell text-ink-muted">{e.client}</td>
                <td className="td-cell text-ink-muted">{e.lead}</td>
                <td className="td-cell">
                  <StatusChip status={e.status} />
                </td>
                <td className="td-cell">
                  <StatusChip status={e.riskLevel} />
                </td>
                <td className="td-cell font-mono text-xs text-ink-muted">
                  {e.evidenceCount}
                </td>
                <td className="td-cell font-mono text-xs text-ink-muted">
                  {e.dueDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="panel">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-ink">Enabled Product Apps</h2>
          <Link href="/apps" className="text-xs text-platform-hover hover:underline">
            Manage in catalogue →
          </Link>
        </div>
        <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {enabledApps.map((app) => (
            <div key={app.id} className="p-5">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="font-mono text-2xs font-medium text-platform-hover">
                  {app.code}
                </span>
                <StatusChip status={app.status} />
              </div>
              <p className="text-sm font-medium text-ink">{app.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-dim">
                {app.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
