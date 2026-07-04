import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import StatusChip from "@/components/StatusChip";
import { signals } from "@/lib/data";
import { TrendingUp, ShieldAlert, Scale, Sparkles } from "lucide-react";

const categoryMeta = {
  risk: { icon: ShieldAlert, label: "Risk" },
  opportunity: { icon: Sparkles, label: "Opportunity" },
  compliance: { icon: Scale, label: "Compliance" },
  trend: { icon: TrendingUp, label: "Trend" },
};

export default function IntelligenceEnginePage() {
  const avgConfidence = Math.round(
    (signals.reduce((sum, s) => sum + s.confidence, 0) / signals.length) * 100
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Cross-tenant analysis"
        title="Intelligence Engine"
        description="Pattern detection across every engagement's evidence base — surfacing risk, compliance thresholds, and opportunities before they're asked for."
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Active signals" value={String(signals.length)} />
        <StatCard
          label="Elevated"
          value={String(signals.filter((s) => s.severity === "elevated").length)}
          deltaTone="negative"
        />
        <StatCard label="Avg. confidence" value={`${avgConfidence}%`} />
        <StatCard
          label="Tenants covered"
          value={String(new Set(signals.map((s) => s.tenant)).size)}
        />
      </div>

      <div className="space-y-4">
        {signals.map((s) => {
          const meta = categoryMeta[s.category];
          const Icon = meta.icon;
          return (
            <div key={s.id} className="panel p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border-strong bg-surface-raised">
                    <Icon className="h-4 w-4 text-platform-hover" />
                  </div>
                  <div>
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <StatusChip status={s.severity} />
                      <span className="font-mono text-2xs uppercase tracking-wide text-ink-dim">
                        {meta.label}
                      </span>
                      <span className="font-mono text-2xs text-ink-dim">
                        · {s.tenant}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-ink">{s.title}</h3>
                    <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-muted">
                      {s.summary}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-start gap-1 sm:items-end">
                  <span className="font-mono text-lg font-semibold text-ink">
                    {Math.round(s.confidence * 100)}%
                  </span>
                  <span className="text-2xs text-ink-dim">confidence</span>
                  <span className="mt-1 font-mono text-2xs text-ink-dim">
                    {s.detected}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
