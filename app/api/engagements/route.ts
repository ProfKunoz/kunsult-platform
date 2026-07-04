import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getActorContext } from "@/lib/foundation/auth/auth.service";
import { withApiErrorHandling } from "@/lib/api-helpers";
import { engagementRepository } from "@/lib/repositories/engagement.repository";

const createSchema = z.object({
  organisationId: z.string().min(1),
  contractId: z.string().optional(),
  name: z.string().min(1),
  scopeSummary: z.string().optional(),
  startDate: z.string().datetime().optional(),
  targetEndDate: z.string().datetime().optional(),
});

// GET /api/engagements?status=&organisationId=
export async function GET(req: NextRequest) {
  return withApiErrorHandling(async () => {
    const { tenantId } = getActorContext(req);
    const status = req.nextUrl.searchParams.get("status") ?? undefined;
    const organisationId = req.nextUrl.searchParams.get("organisationId") ?? undefined;

    const engagements = await engagementRepository.findMany(tenantId, {
      where: { status: status as never, organisationId },
      include: {
        organisation: { select: { name: true } },
        team: { where: { deletedAt: null } },
        products: { where: { deletedAt: null } },
        _count: { select: { findings: true, actions: true, evidenceItems: true, risks: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(engagements);
  });
}

// POST /api/engagements
export async function POST(req: NextRequest) {
  return withApiErrorHandling(async () => {
    const actor = getActorContext(req);
    const parsed = createSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const engagement = await engagementRepository.create(actor.tenantId, actor, parsed.data);
    return NextResponse.json(engagement, { status: 201 });
  });
}
