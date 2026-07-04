import { prisma } from "@/lib/prisma";
import { createTenantRepository } from "./base.repository";
import { storageService } from "@/lib/foundation/storage/storage.service";
import { recordAudit } from "@/lib/foundation/audit/audit.service";
import type { Actor } from "./base.repository";

// Foundation-backed for standard CRUD (create/update/softDelete all go
// through Permission + Audit checks automatically — see base.repository.ts).
export const evidenceRepository = createTenantRepository(prisma.evidenceItem, "EvidenceItem");

// Versioning is append-only by design (see schema comment on
// EvidenceVersion) so it lives outside the generic repository — there is
// no "delete a version" operation, only "add a new one." It still goes
// through the Storage and Audit Foundation Services rather than writing
// a raw URL and a manual log line.
export async function addEvidenceVersion(
  tenantId: string,
  actor: Actor,
  evidenceItemId: string,
  file: { fileName: string; mimeType?: string; contentBase64?: string },
  changeNote?: string
) {
  const evidenceItem = await prisma.evidenceItem.findFirst({
    where: { id: evidenceItemId, tenantId, deletedAt: null },
  });
  if (!evidenceItem) throw new Error(`Record ${evidenceItemId} not found for this tenant`);

  const storageUrl = await storageService.registerFile({ tenantId, ...file });

  const latest = await prisma.evidenceVersion.findFirst({
    where: { evidenceItemId },
    orderBy: { versionNumber: "desc" },
  });

  const version = await prisma.evidenceVersion.create({
    data: {
      evidenceItemId,
      versionNumber: (latest?.versionNumber ?? 0) + 1,
      storageUrl,
      changeNote,
      uploadedBy: actor.userId ?? undefined,
    },
  });

  await prisma.evidenceItem.update({
    where: { id: evidenceItemId },
    data: { storageUrl, updatedBy: actor.userId, updatedAt: new Date() },
  });

  await recordAudit({
    tenantId,
    entityType: "EvidenceItem",
    entityId: evidenceItemId,
    action: "UPDATE",
    actorId: actor.userId,
    actorRole: actor.role,
    after: { newVersion: version.versionNumber, storageUrl },
  });

  return version;
}
