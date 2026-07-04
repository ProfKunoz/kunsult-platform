import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import StatusChip from "@/components/StatusChip";
import { tenants, engagements, signals, qaReviews } from "@/lib/data";

export default function OperationsCentrePage() {
  const activeEngagements = engagements.filter((e) => e.status !== "closed");
  const elevatedSignals = signals.filter((s) => s.severity !== "info");
  const passedQA = qaReviews.filter((q) => q.status === "passed").length;
  const scoredQA = qaReviews.filter((q) => q.score !== null).length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Cross-tenant overview"
        title="Operations Centre"
        description="Real-time posture across every organisation running on the KUNSULT Platform — health, engagements, and signals in one view."
        actions={
          <Link href="/tenant-factory" className="btn-primary">
            Provision tenant
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Tenants provisioned"
          value={String(tenants.length)}
          hint="1 active · 1 provisioning · 1 suspended"
        />
        <StatCard
          label="Active engagements"
          value={String(activeEngagements.length)}
          delta="+2 this month"
        />
        <StatCard
          label="QA pass rate"
          value={scoredQA ? `${Math.round((passedQA / scoredQA) * 100)}%` : "—"}
          hint={`${scoredQA} scored reviews`}
        />
        <StatCard
          label="Elevated signals"
          value={String(elevatedSignals.length)}
          deltaTone="negative"
          delta={elevatedSignals.length > 0 ? "Needs attention" : "Clear"}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="panel lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold text-ink">Tenant health</h2>
            <Link href="/tenant-factory" className="text-xs text-platform-hover hover:underline">
              Manage tenants →
            </Link>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="th-cell">Tenant</th>
                <th className="th-cell">Status</th>
                <th className="th-cell">Engagements</th>
                <th className="th-cell">Modules</th>
                <th className="th-cell">Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tenants.map((t) => (
                <tr key={t.id} className="hover:bg-surface-raised/60">
                  <td className="td-cell">
                    <Link
                      href={t.code === "ZIPROH" ? "/tenants/ziproh" : "/tenant-factory"}
                      className="font-medium text-ink hover:text-platform-hover"
                    >
                      {t.name}
                    </Link>
                    <p className="font-mono text-2xs text-ink-dim">{t.code} · {t.id.toUpperCase()}</p>
                  </td>
                  <td className="td-cell">
                    <StatusChip status={t.status} />
                  </td>
                  <td className="td-cell font-mono text-ink-muted">
                    {t.activeEngagements}
                  </td>
                  <td className="td-cell font-mono text-ink-muted">
                    {t.modulesEnabled}/8
                  </td>
                  <td className="td-cell">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-sunken">
                        <div
                          className={`h-full rounded-full ${
                            t.healthScore > 70
                              ? "bg-tenant"
                              : t.healthScore > 40
                              ? "bg-warn"
                              : "bg-danger"
                          }`}
                          style={{ width: `${t.healthScore}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs text-ink-muted">
                        {t.healthScore}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold text-ink">Latest signals</h2>
            <Link href="/intelligence" className="text-xs text-platform-hover hover:underline">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-border">
            {signals.slice(0, 4).map((s) => (
              <div key={s.id} className="px-5 py-4">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <StatusChip status={s.severity} />
                  <span className="font-mono text-2xs text-ink-dim">
                    {s.detected}
                  </span>
                </div>
                <p className="text-sm font-medium leading-snug text-ink">
                  {s.title}
                </p>
                <p className="mt-1 text-xs text-ink-dim">{s.tenant}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-ink">
            Engagements across all tenants
          </h2>
          <span className="font-mono text-2xs text-ink-dim">
            {engagements.length} total
          </span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="th-cell">Engagement</th>
              <th className="th-cell">Client</th>
              <th className="th-cell">Status</th>
              <th className="th-cell">Risk</th>
              <th className="th-cell">Due</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {engagements.map((e) => (
              <tr key={e.id} className="hover:bg-surface-raised/60">
                <td className="td-cell font-medium text-ink">{e.name}</td>
                <td className="td-cell text-ink-muted">{e.client}</td>
                <td className="td-cell">
                  <StatusChip status={e.status} />
                </td>
                <td className="td-cell">
                  <StatusChip status={e.riskLevel} />
                </td>
                <td className="td-cell font-mono text-xs text-ink-muted">
                  {e.dueDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
