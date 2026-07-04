import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { knowledgeArtifacts } from "@/lib/data";
import {
  FileStack,
  LayoutTemplate,
  BookOpen,
  Ruler,
  ClipboardCheck,
} from "lucide-react";

const typeMeta = {
  framework: { icon: Ruler, label: "Framework" },
  template: { icon: LayoutTemplate, label: "Template" },
  playbook: { icon: BookOpen, label: "Playbook" },
  standard: { icon: ClipboardCheck, label: "Standard" },
  precedent: { icon: FileStack, label: "Precedent" },
};

export default function KnowledgeLakePage() {
  const mostUsed = [...knowledgeArtifacts].sort(
    (a, b) => b.usageCount - a.usageCount
  )[0];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Institutional memory"
        title="Knowledge Lake"
        description="Frameworks, templates, and precedents accumulated across every engagement — reusable intellectual property, not one-off documents."
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Artifacts" value={String(knowledgeArtifacts.length)} />
        <StatCard
          label="Most reused"
          value={mostUsed.title.split(" ").slice(0, 2).join(" ")}
          hint={`${mostUsed.usageCount} engagements`}
        />
        <StatCard
          label="Frameworks"
          value={String(
            knowledgeArtifacts.filter((k) => k.type === "framework").length
          )}
        />
        <StatCard
          label="Standards"
          value={String(
            knowledgeArtifacts.filter((k) => k.type === "standard").length
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {knowledgeArtifacts.map((k) => {
          const meta = typeMeta[k.type];
          const Icon = meta.icon;
          return (
            <div key={k.id} className="panel p-5">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border-strong bg-surface-raised">
                  <Icon className="h-4 w-4 text-tenant" />
                </div>
                <span className="font-mono text-2xs text-ink-dim">
                  v{k.version}
                </span>
              </div>
              <p className="font-mono text-2xs uppercase tracking-wide text-ink-dim">
                {meta.label} · {k.domain}
              </p>
              <h3 className="mt-1 text-sm font-medium text-ink">{k.title}</h3>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <span className="text-xs text-ink-dim">
                  Updated {k.updated}
                </span>
                <span className="font-mono text-xs text-ink-muted">
                  Used in {k.usageCount} engagements
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
