export default function StatCard({
  label,
  value,
  delta,
  deltaTone = "positive",
  hint,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "positive" | "negative" | "neutral";
  hint?: string;
}) {
  const deltaColor =
    deltaTone === "positive"
      ? "text-tenant"
      : deltaTone === "negative"
      ? "text-danger"
      : "text-ink-dim";

  return (
    <div className="panel flex flex-col gap-2 p-4">
      <p className="label-eyebrow">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-2xl font-semibold text-ink">
          {value}
        </span>
        {delta ? (
          <span className={`text-xs font-medium ${deltaColor}`}>{delta}</span>
        ) : null}
      </div>
      {hint ? <p className="text-xs text-ink-dim">{hint}</p> : null}
    </div>
  );
}
