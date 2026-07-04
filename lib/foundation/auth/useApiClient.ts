"use client";

import { useCallback } from "react";
import { useActorContext } from "./TenantProvider";

/**
 * The fix for "x-tenant-id is missing": every Client Component that talks
 * to the API uses THIS instead of raw fetch(). It reads tenant/user/role
 * from TenantProvider's context and attaches them automatically — a
 * component can no longer forget the header, because it never sets
 * headers itself.
 *
 * Usage (see app/engagements/new/page.tsx for the full Create Engagement
 * example):
 *
 *   const { apiFetch } = useApiClient();
 *   const engagement = await apiFetch("/api/engagements", {
 *     method: "POST",
 *     body: JSON.stringify({ organisationId, name }),
 *   });
 */
export function useApiClient() {
  const { tenantId, userId, role } = useActorContext();

  const apiFetch = useCallback(
    async (path: string, init: RequestInit = {}) => {
      const headers = new Headers(init.headers);
      headers.set("x-tenant-id", tenantId);
      if (userId) headers.set("x-user-id", userId);
      headers.set("x-user-role", role);
      if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

      const res = await fetch(path, { ...init, headers });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ? JSON.stringify(body.error) : `Request failed: ${res.status}`);
      }

      return res.json();
    },
    [tenantId, userId, role]
  );

  return { apiFetch };
}
