import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getTenantContext } from "@/lib/tenant-context";
import { withApiErrorHandling } from "@/lib/api-helpers";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  isPrimary: z.boolean().optional(),
});

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return withApiErrorHandling(async () => {
    const { tenantId } = getTenantContext(req);
    const contact = await prisma.contact.findFirst({ where: { id: params.id, tenantId, deletedAt: null } });
    if (!contact) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(contact);
  });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return withApiErrorHandling(async () => {
    const { tenantId, userId } = getTenantContext(req);
    const parsed = z.object({ name: z.string().min(1) }).and(updateSchema).safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const existing = await prisma.contact.findFirst({ where: { id: params.id, tenantId, deletedAt: null } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const contact = await prisma.contact.update({
      where: { id: params.id },
      data: { ...parsed.data, updatedBy: userId },
    });
    return NextResponse.json(contact);
  });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return withApiErrorHandling(async () => {
    const { tenantId, userId } = getTenantContext(req);
    const existing = await prisma.contact.findFirst({ where: { id: params.id, tenantId, deletedAt: null } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.contact.update({ where: { id: params.id }, data: { deletedAt: new Date(), updatedBy: userId } });
    return NextResponse.json({ deleted: true, id: params.id });
  });
}
