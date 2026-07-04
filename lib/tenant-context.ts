/**
 * DEPRECATED — kept only so routes written before the Foundation layer
 * existed keep compiling. New code should import from
 * "@/lib/foundation/auth/auth.service" directly and use getActorContext,
 * which also resolves role (needed by the permission service).
 *
 * getTenantContext() here is a thin adapter over getActorContext() for
 * call sites that only destructure { tenantId, userId }.
 */
import { NextRequest } from "next/server";
import { getActorContext, MissingTenantError, ActorContext } from "./foundation/auth/auth.service";

export { MissingTenantError };
export type TenantContext = Pick<ActorContext, "tenantId" | "userId">;

export function getTenantContext(req: NextRequest): TenantContext {
  const { tenantId, userId } = getActorContext(req);
  return { tenantId, userId };
}
