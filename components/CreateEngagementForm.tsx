"use client";

import { useState, useEffect } from "react";
import { useApiClient } from "@/lib/foundation/auth/useApiClient";

/**
 * Drop-in form component for the workflow reported broken. Mount it
 * wherever your existing "Create Engagement" route/page/modal lives.
 *
 * THE FIX, specifically: apiFetch() (from useApiClient) attaches
 * x-tenant-id automatically — this component never sets headers itself.
 * If your real button still calls fetch() directly, this is the whole
 * diff: swap fetch(...) for apiFetch(...) and delete any manual
 * header-setting code.
 */
export function CreateEngagementForm({
  defaultOrganisationId,
  onCreated,
}: {
  defaultOrganisationId?: string;
  onCreated?: (engagement: { id: string; name: string }) => void;
}) {
  const { apiFetch } = useApiClient();

  const [organisationId, setOrganisationId] = useState(defaultOrganisationId ?? "");
  const [name, setName] = useState("");
  const [scopeSummary, setScopeSummary] = useState("");
  const [organisations, setOrganisations] = useState<Array<{ id: string; name: string }>>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (defaultOrganisationId) return; // caller already knows the org — skip the list fetch
    apiFetch("/api/organisations")
      .then(setOrganisations)
      .catch(() => {}); // list population failure shouldn't block the form
  }, [apiFetch, defaultOrganisationId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const engagement = await apiFetch("/api/engagements", {
        method: "POST",
        body: JSON.stringify({ organisationId, name, scopeSummary: scopeSummary || undefined }),
      });
      onCreated?.(engagement);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create engagement");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!defaultOrganisationId && (
        <div>
          <label className="block text-sm font-medium mb-1">Organisation</label>
          <select
            value={organisationId}
            onChange={(e) => setOrganisationId(e.target.value)}
            required
            className="w-full border rounded-md px-3 py-2 text-sm"
          >
            <option value="" disabled>Select an organisation</option>
            {organisations.map((org) => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Engagement Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Scope Summary</label>
        <textarea
          value={scopeSummary}
          onChange={(e) => setScopeSummary(e.target.value)}
          rows={3}
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-2 rounded-md bg-black text-white text-sm font-medium disabled:opacity-50"
      >
        {submitting ? "Creating…" : "Create Engagement"}
      </button>
    </form>
  );
}
