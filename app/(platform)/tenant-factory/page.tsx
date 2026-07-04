import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import StatusChip from "@/components/StatusChip";
import { tenants } from "@/lib/data";
import { Check } from "lucide-react";

const provisioningSteps = [
  { title: "Organisation profile", detail: "Legal name, sector, regions of operation" },
  { title: "Module selection", detail: "Choose which Product Apps to enable at launch" },
  { title: "Data boundary", detail: "Isolated data lake namespace and retention policy" },
  { title: "Access & roles", detail: "Owner, operators, and reviewer permissions" },
  { title: "Go live", detail: "Tenant activated and added to Operations Centre" },
];

export default function TenantFactoryPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Provisioning"
        title="Tenant Factory"
        description="Every organisation on the platform is a tenant — an isolated operating environment with its own engagements, evidence, and data boundary. Provision a new one here."
        actions={
          <button className="btn-primary" type="button">
            New tenant
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="panel lg:col-span-3">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold text-ink">Provisioned tenants</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="th-cell">Tenant</th>
                <th className="th-cell">Sector</th>
                <th className="th-cell">Region</th>
                <th className="th-cell">Status</th>
                <th className="th-cell">Provisioned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tenants.map((t) => (
                <tr key={t.id} className="hover:bg-surface-raised/60">
                  <td className="td-cell">
                    <Link
                      href={t.code === "ZIPROH" ? "/tenants/ziproh" : "#"}
                      className="font-medium text-ink hover:text-platform-hover"
                    >
                      {t.name}
                    </Link>
                    <p className="font-mono text-2xs text-ink-dim">{t.code}</p>
                  </td>
                  <td className="td-cell text-ink-muted">{t.sector}</td>
                  <td className="td-cell text-ink-muted">{t.region}</td>
                  <td className="td-cell">
                    <StatusChip status={t.status} />
                  </td>
                  <td className="td-cell font-mono text-xs text-ink-muted">
                    {t.provisionedOn}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel lg:col-span-2">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold text-ink">Provisioning pipeline</h2>
            <p className="mt-1 text-xs text-ink-dim">
              What happens when a new tenant is created
            </p>
          </div>
          <ol className="divide-y divide-border">
            {provisioningSteps.map((step, i) => (
              <li key={step.title} className="flex gap-3 px-5 py-4">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border-strong font-mono text-2xs text-ink-muted">
                  {i === 0 ? <Check className="h-3 w-3 text-tenant" /> : i + 1}
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">{step.title}</p>
                  <p className="mt-0.5 text-xs text-ink-dim">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="panel p-5">
        <p className="label-eyebrow mb-2">Platform note</p>
        <p className="max-w-3xl text-sm leading-relaxed text-ink-muted">
          ZIPROH is Tenant 001 — the reference implementation running on the
          KUNSULT Platform. Its seven assurance domains (ZAI-01 through
          ZAI-07) and Master Workbench (ZAI-00) were built as Product Apps,
          then enabled for this tenant. New tenants, such as KunCoach, select
          from the same Product App catalogue rather than receiving bespoke
          builds.
        </p>
      </div>
    </div>
  );
}
