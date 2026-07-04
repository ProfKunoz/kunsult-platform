import { cookies } from "next/headers";
import type { ActorContext } from "./TenantProvider";

/**
 * Server-side counterpart to the client TenantProvider. Server Components
 * don't have access to a React context provided further down the tree —
 * they need this instead, called directly wherever a Server Component
 * queries the database, so every query can be scoped by tenantId.
 *
 * CURRENT STATE: reads plain cookies (tenant_id / user_id / user_role) —
 * a placeholder, not a hard-coded value. REPLACE WHEN AUTH IS ADDED: swap
 * the body for your real session lookup (NextAuth, Clerk, etc.) — keep
 * the return shape identical so call sites don't change.
 */
export async function getServerActorContext(): Promise<ActorContext> {
  const cookieStore = cookies();
  const tenantId = cookieStore.get("tenant_id")?.value;
  const userId = cookieStore.get("user_id")?.value ?? null;
  const role = cookieStore.get("user_role")?.value ?? "MEMBER";

  if (!tenantId) {
    throw new Error(
      "No tenant resolved for this session (missing tenant_id cookie). " +
      "Wire real auth/session lookup here — see docs/TENANT_CONTEXT_FIX.md."
    );
  }

  return { tenantId, userId, role };
}
