import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getActorContext } from "@/lib/foundation/auth/auth.service";
import { withApiErrorHandling } from "@/lib/api-helpers";
import { engagementRepository, findEngagementWithFullDetail } from "@/lib/repositories/engagement.repository";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  status: z.enum(["SCOPING", "MOBILISING", "ACTIVE", "QUALITY_REVIEW", "CLOSED", "CONTINUITY_PENDING"]).optional(),
  scopeSummary: z.string().optional(),
  startDate: z.string().datetime().optional(),
  targetEndDate: z.string().datetime().optional(),
  actualEndDate: z.string().datetime().optional(),
});

// GET /api/engagements/[id] — the one call a detail page needs
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return withApiErrorHandling(async () => {
    const { tenantId } = getActorContext(req);
    const engagement = await findEngagementWithFullDetail(tenantId, params.id);
    if (!engagement) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(engagement);
  });
}

// PUT /api/engagements/[id] — full replace
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return withApiErrorHandling(async () => {
    const actor = getActorContext(req);
    const parsed = z.object({ name: z.string().min(1) }).and(updateSchema).safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const engagement = await engagementRepository.update(actor.tenantId, actor, params.id, parsed.data);
    return NextResponse.json(engagement);
  });
}

// PATCH /api/engagements/[id] — partial update, typically status transitions
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  return withApiErrorHandling(async () => {
    const actor = getActorContext(req);
    const parsed = updateSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const engagement = await engagementRepository.update(actor.tenantId, actor, params.id, parsed.data);
    return NextResponse.json(engagement);
  });
}

// DELETE /api/engagements/[id] — soft delete, permission-gated
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return withApiErrorHandling(async () => {
    const actor = getActorContext(req);
    await engagementRepository.softDelete(actor.tenantId, actor, params.id);
    return NextResponse.json({ deleted: true, id: params.id });
  });
}
