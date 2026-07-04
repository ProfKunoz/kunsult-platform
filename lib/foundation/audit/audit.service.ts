import { prisma } from "@/lib/prisma";

/**
 * FOUNDATION AUDIT SERVICE
 *
 * Records CREATE / UPDATE / SOFT_DELETE against any entity, for any engine.
 * This is intentionally generic — it takes plain strings and JSON, not
 * typed entities — because the alternative is an audit service that knows
 * about Organisation, Engagement, Assessment, etc. individually, which is
 * exactly the duplication this layer exists to prevent.
 *
 * Engines do not call prisma.auditLog.create() directly — they go through
 * this service, so the day this needs to also emit to an external SIEM or
 * event stream, it changes in one place.
 */

export type AuditAction = "CREATE" | "UPDATE" | "SOFT_DELETE";

export interface AuditEntry {
  tenantId: string;
  entityType: string;
  entityId: string;
  action: AuditAction;
  actorId?: string | null;
  actorRole?: string | null;
  before?: unknown;
  after?: unknown;
}

export async function recordAudit(entry: AuditEntry): Promise<void> {
  await prisma.auditLog.create({
    data: {
      tenantId: entry.tenantId,
      entityType: entry.entityType,
      entityId: entry.entityId,
      action: entry.action,
      actorId: entry.actorId ?? null,
      actorRole: entry.actorRole ?? null,
      before: entry.before === undefined ? undefined : (entry.before as object),
      after: entry.after === undefined ? undefined : (entry.after as object),
    },
  });
}

// Read-side helper — used by an eventual "activity feed" or compliance
// export; not exposed via API in Sprint 1, but engines shouldn't query
// prisma.auditLog directly even for reads, for the same reason as above.
export async function getAuditTrail(tenantId: string, entityType: string, entityId: string) {
  return prisma.auditLog.findMany({
    where: { tenantId, entityType, entityId },
    orderBy: { createdAt: "desc" },
  });
}
