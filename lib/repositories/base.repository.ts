import { recordAudit } from "@/lib/foundation/audit/audit.service";
import { assertCan } from "@/lib/foundation/permissions/permission.service";

/**
 * Generic repository base — Foundation-dependent.
 *
 * Every entity built on this factory automatically gets:
 *   (1) tenant scoping on every query
 *   (2) soft delete (never a hard delete)
 *   (3) a permission check before every mutation, via the Foundation
 *       Permission Service — not a role check written inline here or in
 *       the route
 *   (4) an audit log entry after every mutation, via the Foundation
 *       Audit Service
 *
 * This is the mechanism by which "engines depend on Foundation Services
 * rather than implementing them independently" actually holds: any engine
 * built through createTenantRepository() cannot skip audit logging or
 * permission checks even if it wanted to — they're built into the
 * factory, not left as a step the repository author has to remember.
 */

type TenantScopedDelegate = {
  findMany: (args: any) => Promise<any[]>;
  findFirst: (args: any) => Promise<any | null>;
  create: (args: any) => Promise<any>;
  update: (args: any) => Promise<any>;
};

export interface Actor {
  userId: string | null;
  role: string;
}

export function createTenantRepository<T extends TenantScopedDelegate>(delegate: T, entityName: string) {
  return {
    async findMany(tenantId: string, args: Record<string, any> = {}) {
      return delegate.findMany({
        ...args,
        where: { ...(args.where ?? {}), tenantId, deletedAt: null },
      });
    },

    async findById(tenantId: string, id: string, args: Record<string, any> = {}) {
      return delegate.findFirst({
        ...args,
        where: { ...(args.where ?? {}), id, tenantId, deletedAt: null },
      });
    },

    async create(tenantId: string, actor: Actor, data: Record<string, any>) {
      assertCan(actor.role, `${entityName}.create`);

      const created = await delegate.create({
        data: { ...data, tenantId, createdBy: actor.userId, updatedBy: actor.userId },
      });

      await recordAudit({
        tenantId,
        entityType: entityName,
        entityId: created.id,
        action: "CREATE",
        actorId: actor.userId,
        actorRole: actor.role,
        after: created,
      });

      return created;
    },

    async update(tenantId: string, actor: Actor, id: string, data: Record<string, any>) {
      assertCan(actor.role, `${entityName}.update`);

      const before = await delegate.findFirst({ where: { id, tenantId, deletedAt: null } });
      if (!before) throw new Error(`Record ${id} not found for this tenant`);

      const after = await delegate.update({
        where: { id },
        data: { ...data, updatedBy: actor.userId, updatedAt: new Date() },
      });

      await recordAudit({
        tenantId,
        entityType: entityName,
        entityId: id,
        action: "UPDATE",
        actorId: actor.userId,
        actorRole: actor.role,
        before,
        after,
      });

      return after;
    },

    async softDelete(tenantId: string, actor: Actor, id: string) {
      assertCan(actor.role, `${entityName}.delete`);

      const before = await delegate.findFirst({ where: { id, tenantId, deletedAt: null } });
      if (!before) throw new Error(`Record ${id} not found for this tenant`);

      const after = await delegate.update({
        where: { id },
        data: { deletedAt: new Date(), updatedBy: actor.userId },
      });

      await recordAudit({
        tenantId,
        entityType: entityName,
        entityId: id,
        action: "SOFT_DELETE",
        actorId: actor.userId,
        actorRole: actor.role,
        before,
      });

      return after;
    },
  };
}
