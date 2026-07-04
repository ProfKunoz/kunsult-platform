"use client";

import { useState } from "react";
import { useApiClient } from "@/lib/foundation/auth/useApiClient";

/**
 * Drop-in form component. Mount it wherever your existing "New
 * Organisation" route/page/modal lives — it doesn't assume a route
 * structure, only that a <TenantProvider> is mounted somewhere above it
 * (see docs/ROOT_LAYOUT_CHANGE.md).
 *
 * THE FIX in this file, specifically: it calls apiFetch() from
 * useApiClient(), never fetch() directly. apiFetch attaches x-tenant-id
 * (and x-user-id, x-user-role) automatically from TenantProvider's
 * context. If your existing component calls fetch() directly, that is
 * the entire diff needed: swap fetch(...) for apiFetch(...) and delete
 * any manual header-setting code.
 */
export function CreateOrganisationForm({
  onCreated,
}: {
  onCreated?: (organisation: { id: string; name: string }) => void;
}) {
  const { apiFetch } = useApiClient();

  const [name, setName] = useState("");
  const [sector, setSector] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const organisation = await apiFetch("/api/organisations", {
        method: "POST",
        body: JSON.stringify({ name, sector: sector || undefined }),
      });
      onCreated?.(organisation);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create organisation");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Sector</label>
        <input
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          placeholder="e.g. Domiciliary Care"
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-2 rounded-md bg-black text-white text-sm font-medium disabled:opacity-50"
      >
        {submitting ? "Creating…" : "Create Organisation"}
      </button>
    </form>
  );
}
