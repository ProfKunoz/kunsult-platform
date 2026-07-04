import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import StatusChip from "@/components/StatusChip";
import { datasets } from "@/lib/data";

export default function DataLakePage() {
  const totalRows = datasets.reduce((sum, d) => sum + d.rows, 0);
  const avgQuality = Math.round(
    datasets.reduce((sum, d) => sum + d.quality, 0) / datasets.length
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Structured data"
        title="Data Lake"
        description="Every structured dataset ingested across tenants — rotas, compliance trackers, and telemetry — held under its own sensitivity boundary."
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Datasets" value={String(datasets.length)} />
        <StatCard label="Total rows" value={totalRows.toLocaleString()} />
        <StatCard label="Avg. quality score" value={`${avgQuality}%`} />
        <StatCard
          label="Real-time feeds"
          value={String(datasets.filter((d) => d.refreshCadence === "Real-time").length)}
        />
      </div>

      <div className="panel">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="th-cell">Dataset</th>
              <th className="th-cell">Domain</th>
              <th className="th-cell">Rows</th>
              <th className="th-cell">Refresh</th>
              <th className="th-cell">Last sync</th>
              <th className="th-cell">Sensitivity</th>
              <th className="th-cell">Quality</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {datasets.map((d) => (
              <tr key={d.id} className="hover:bg-surface-raised/60">
                <td className="td-cell font-medium text-ink">{d.name}</td>
                <td className="td-cell text-ink-muted">{d.domain}</td>
                <td className="td-cell font-mono text-xs text-ink-muted">
                  {d.rows.toLocaleString()}
                </td>
                <td className="td-cell text-ink-muted">{d.refreshCadence}</td>
                <td className="td-cell font-mono text-xs text-ink-muted">
                  {d.lastSync}
                </td>
                <td className="td-cell">
                  <StatusChip
                    status={d.sensitivity}
                    tone={
                      d.sensitivity === "restricted"
                        ? "danger"
                        : d.sensitivity === "confidential"
                        ? "warning"
                        : "neutral"
                    }
                  />
                </td>
                <td className="td-cell">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-sunken">
                      <div
                        className="h-full rounded-full bg-tenant"
                        style={{ width: `${d.quality}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs text-ink-muted">
                      {d.quality}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
