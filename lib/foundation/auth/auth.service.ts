import { NextRequest } from "next/server";

/**
 * FOUNDATION AUTH SERVICE
 *
 * Every engine resolves "who is making this request, for which tenant,
 * with what role" through this one function. No engine reads headers,
 * cookies, or a session object directly — that would mean re-deciding
 * "how do we identify a caller" in eight different places, and it would
 * make swapping in a real auth provider an eight-file change instead of
 * a one-file change.
 *
 * CURRENT STATE: no auth provider is wired yet (Sprint 2 priority — see
 * docs/ENGINEERING_REVIEW.md). Identity is read from request headers so
 * the multi-tenant, role-aware data model can be exercised end-to-end
 * before real auth exists.
 *
 * WHEN AUTH IS ADDED: replace the body of getActorContext with a call to
 * your session/JWT verification. Keep the return shape (ActorContext)
 * identical so nothing downstream — repositories, permission checks,
 * audit logs — has to change.
 */

export interface ActorContext {
  tenantId: string;
  userId: string | null;
  role: string; // defaults to "MEMBER" if unresolved — see permission.service.ts for what that grants
}

export class MissingTenantError extends Error {
  constructor() {
    super("Request is missing an x-tenant-id header (or resolvable session tenant).");
    this.name = "MissingTenantError";
  }
}

export function getActorContext(req: NextRequest): ActorContext {
  const tenantId = req.headers.get("x-tenant-id");
  if (!tenantId) throw new MissingTenantError();

  const userId = req.headers.get("x-user-id");
  const role = req.headers.get("x-user-role") ?? "MEMBER";

  return { tenantId, userId: userId ?? null, role };
}
