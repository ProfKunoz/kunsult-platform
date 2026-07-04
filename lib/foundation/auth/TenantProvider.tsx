"use client";

import { createContext, useContext, ReactNode } from "react";

/**
 * Single source of truth for "who is the current tenant/user/role" on the
 * client. Every component that needs to call the API uses useApiClient()
 * (see useApiClient.ts), which reads from this context — no component
 * ever reads a cookie, a header, or a hard-coded string itself.
 *
 * MOUNT THIS ONCE, at the root layout, fed by a server-resolved value —
 * see docs/ROOT_LAYOUT_CHANGE.md for the exact snippet.
 *
 * This is the missing piece behind the Create Engagement bug: without a
 * provider mounted somewhere above it, no component has any tenant value
 * to attach to a fetch() call in the first place.
 */

export interface ActorContext {
  tenantId: string;
  userId: string | null;
  role: string;
}

const TenantContext = createContext<ActorContext | null>(null);

export function TenantProvider({ value, children }: { value: ActorContext; children: ReactNode }) {
  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useActorContext(): ActorContext {
  const ctx = useContext(TenantContext);
  if (!ctx) {
    throw new Error(
      "useActorContext() called outside a <TenantProvider>. " +
      "Wrap the app in <TenantProvider> at the root layout — see docs/ROOT_LAYOUT_CHANGE.md."
    );
  }
  return ctx;
}
