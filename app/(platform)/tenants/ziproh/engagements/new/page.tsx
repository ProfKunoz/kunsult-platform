import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { productApps } from "@/lib/data";
import { ArrowLeft } from "lucide-react";

export default function NewEngagementPage() {
  const domains = productApps.filter((a) => a.domain !== "Executive Coaching");

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/tenants/ziproh"
          className="mb-4 inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to ZIPROH
        </Link>
        <PageHeader
          eyebrow="ZIPROH · T-001"
          title="New engagement"
          description="Scope a new client engagement. It will inherit the assurance domain's evidence templates, QA standard, and reporting structure automatically."
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <form className="panel space-y-5 p-6 lg:col-span-2">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">
                Engagement name
              </label>
              <input
                className="input-field"
                placeholder="e.g. CQC Readiness Diagnostic"
                defaultValue="Regulation 12 & 17 Assurance Response — Phase 2"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">
                Client organisation
              </label>
              <input
                className="input-field"
                placeholder="Client name"
                defaultValue="Fictional Care Group Ltd"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">
                Engagement lead
              </label>
              <input
                className="input-field"
                placeholder="Assign a lead"
                defaultValue="A. Marechera"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">
                Opens on
              </label>
              <input type="date" className="input-field" defaultValue="2026-07-07" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">
                Due date
              </label>
              <input type="date" className="input-field" defaultValue="2026-09-18" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">
                Initial risk level
              </label>
              <div className="flex gap-2">
                {["low", "medium", "high"].map((level) => (
                  <label
                    key={level}
                    className="flex flex-1 cursor-pointer items-center justify-center rounded border border-border-strong bg-surface-sunken py-2 text-sm capitalize text-ink-muted has-[:checked]:border-platform has-[:checked]:bg-platform-soft has-[:checked]:text-ink"
                  >
                    <input
                      type="radio"
                      name="risk"
                      value={level}
                      defaultChecked={level === "medium"}
                      className="sr-only"
                    />
                    {level}
                  </label>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">
                Scope notes
              </label>
              <textarea
                className="input-field min-h-24 resize-none"
                placeholder="Describe the scope, key regulatory drivers, and any known constraints."
                defaultValue="Phase 2 covers medicines management and staff supervision evidence following the Phase 1 warning notice response. Evidence to be sampled against ZAI-01 and ZAI-04 standards."
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
            <Link href="/tenants/ziproh" className="btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn-primary">
              Create engagement
            </button>
          </div>
        </form>

        <div className="space-y-6">
          <div className="panel p-5">
            <p className="label-eyebrow mb-3">Assurance domain routing</p>
            <p className="mb-4 text-xs leading-relaxed text-ink-muted">
              Based on the scope notes, this engagement will route evidence
              through:
            </p>
            <div className="space-y-2">
              {domains
                .filter((d) => d.code === "ZAI-01" || d.code === "ZAI-04")
                .map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center gap-2.5 rounded border border-platform/30 bg-platform-soft px-3 py-2"
                  >
                    <span className="font-mono text-2xs font-semibold text-platform-hover">
                      {d.code}
                    </span>
                    <span className="text-xs text-ink">{d.name}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="panel p-5">
            <p className="label-eyebrow mb-3">What happens next</p>
            <ol className="space-y-3 text-xs text-ink-muted">
              <li className="flex gap-2.5">
                <span className="font-mono text-ink-dim">01</span>
                Engagement is created and appears in the ZIPROH tenant view.
              </li>
              <li className="flex gap-2.5">
                <span className="font-mono text-ink-dim">02</span>
                Evidence intake templates are provisioned automatically.
              </li>
              <li className="flex gap-2.5">
                <span className="font-mono text-ink-dim">03</span>
                Intelligence Engine begins monitoring for risk signals.
              </li>
              <li className="flex gap-2.5">
                <span className="font-mono text-ink-dim">04</span>
                QA Centre schedules a review checkpoint before close.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
