import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getActorContext } from "@/lib/foundation/auth/auth.service";
import { buildTextSearchFilter } from "@/lib/foundation/search/search.service";
import { withApiErrorHandling } from "@/lib/api-helpers";
import { organisationRepository } from "@/lib/repositories/organisation.repository";

const createSchema = z.object({
  name: z.string().min(1),
  sector: z.string().optional(),
  regulatoryId: z.string().optional(),
  website: z.string().url().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

// GET /api/organisations?q=
export async function GET(req: NextRequest) {
  return withApiErrorHandling(async () => {
    const { tenantId } = getActorContext(req);
    const q = req.nextUrl.searchParams.get("q");

    const organisations = await organisationRepository.findMany(tenantId, {
      where: buildTextSearchFilter(["name"], q),
      include: { _count: { select: { engagements: true, opportunities: true, contacts: true } } },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(organisations);
  });
}

// POST /api/organisations
export async function POST(req: NextRequest) {
  return withApiErrorHandling(async () => {
    const actor = getActorContext(req);
    const parsed = createSchema.safeParse(await req.json());

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const organisation = await organisationRepository.create(actor.tenantId, actor, parsed.data);
    return NextResponse.json(organisation, { status: 201 });
  });
}
