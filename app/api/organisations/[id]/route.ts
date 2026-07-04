import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getActorContext } from "@/lib/foundation/auth/auth.service";
import { withApiErrorHandling } from "@/lib/api-helpers";
import { organisationRepository, findOrganisationWithDetail } from "@/lib/repositories/organisation.repository";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  sector: z.string().optional(),
  regulatoryId: z.string().optional(),
  website: z.string().url().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

// GET /api/organisations/[id] — full detail with related commercial + engagement data
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return withApiErrorHandling(async () => {
    const { tenantId } = getActorContext(req);
    const organisation = await findOrganisationWithDetail(tenantId, params.id);

    if (!organisation) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(organisation);
  });
}

// PUT /api/organisations/[id] — full replace
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return withApiErrorHandling(async () => {
    const actor = getActorContext(req);
    const parsed = z.object({ name: z.string().min(1) }).and(updateSchema).safeParse(await req.json());

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const organisation = await organisationRepository.update(actor.tenantId, actor, params.id, parsed.data);
    return NextResponse.json(organisation);
  });
}

// PATCH /api/organisations/[id] — partial update
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  return withApiErrorHandling(async () => {
    const actor = getActorContext(req);
    const parsed = updateSchema.safeParse(await req.json());

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const organisation = await organisationRepository.update(actor.tenantId, actor, params.id, parsed.data);
    return NextResponse.json(organisation);
  });
}

// DELETE /api/organisations/[id] — soft delete only; permission-gated
// (Foundation Permission Service — see lib/foundation/permissions)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return withApiErrorHandling(async () => {
    const actor = getActorContext(req);
    await organisationRepository.softDelete(actor.tenantId, actor, params.id);
    return NextResponse.json({ deleted: true, id: params.id });
  });
}
