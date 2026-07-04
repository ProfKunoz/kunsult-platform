import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import StatusChip from "@/components/StatusChip";
import { qaReviews } from "@/lib/data";

export default function QACentrePage() {
  const flagged = qaReviews.filter((q) => q.status === "flagged").length;
  const pending = qaReviews.filter(
    (q) => q.status === "pending" || q.status === "in_review"
  ).length;
  const scored = qaReviews.filter((q) => q.score !== null);
  const avgScore = scored.length
    ? Math.round(scored.reduce((sum, q) => sum + (q.score ?? 0), 0) / scored.length)
    : 0;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Quality assurance"
        title="QA Centre"
        description="Every deliverable is reviewed against a named assurance standard before it leaves an engagement. Nothing ships unreviewed."
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Reviews in flight" value={String(pending)} />
        <StatCard label="Flagged" value={String(flagged)} deltaTone="negative" />
        <StatCard label="Average score" value={`${avgScore}`} hint="Out of 100" />
        <StatCard
          label="Standards in use"
          value={String(new Set(qaReviews.map((q) => q.standard)).size)}
        />
      </div>

      <div className="panel">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="th-cell">Subject</th>
              <th className="th-cell">Standard</th>
              <th className="th-cell">Reviewer</th>
              <th className="th-cell">Status</th>
              <th className="th-cell">Submitted</th>
              <th className="th-cell">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {qaReviews.map((q) => (
              <tr key={q.id} className="hover:bg-surface-raised/60">
                <td className="td-cell font-medium text-ink">{q.subject}</td>
                <td className="td-cell font-mono text-xs text-ink-muted">
                  {q.standard}
                </td>
                <td className="td-cell text-ink-muted">{q.reviewer}</td>
                <td className="td-cell">
                  <StatusChip status={q.status} />
                </td>
                <td className="td-cell font-mono text-xs text-ink-muted">
                  {q.submitted}
                </td>
                <td className="td-cell font-mono text-xs text-ink">
                  {q.score !== null ? (
                    <span
                      className={
                        q.score >= 80
                          ? "text-tenant"
                          : q.score >= 60
                          ? "text-warn"
                          : "text-danger"
                      }
                    >
                      {q.score}
                    </span>
                  ) : (
                    <span className="text-ink-dim">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
