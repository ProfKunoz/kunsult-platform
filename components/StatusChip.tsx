type Tone = "neutral" | "positive" | "warning" | "danger" | "info";

const toneClasses: Record<Tone, string> = {
  neutral: "border-border-strong text-ink-muted bg-surface-raised",
  positive: "border-tenant/40 text-tenant bg-tenant/10",
  warning: "border-warn/40 text-warn bg-warn/10",
  danger: "border-danger/40 text-danger bg-danger/10",
  info: "border-platform/40 text-platform-hover bg-platform/10",
};

const statusToneMap: Record<string, Tone> = {
  active: "positive",
  provisioning: "info",
  suspended: "danger",
  scoping: "neutral",
  evidence_review: "info",
  qa: "warning",
  closed: "neutral",
  pending: "neutral",
  in_review: "info",
  passed: "positive",
  flagged: "danger",
  low: "positive",
  medium: "warning",
  high: "danger",
  ga: "positive",
  beta: "info",
  planned: "neutral",
  info: "info",
  watch: "warning",
  elevated: "danger",
};

function formatLabel(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function StatusChip({
  status,
  tone,
}: {
  status: string;
  tone?: Tone;
}) {
  const resolvedTone = tone ?? statusToneMap[status] ?? "neutral";
  return (
    <span className={`chip ${toneClasses[resolvedTone]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {formatLabel(status)}
    </span>
  );
}
