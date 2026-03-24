export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.res;

  const { id } = await ctx.params;

  const order = await prisma.workOrder.findUnique({
    where: { id },
    include: { employee: true, client: true },
  });

  return NextResponse.json(order);
}

export async function PATCH(req: Request, ctx: Ctx) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.res;

  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({}));

  const data: any = {};
  if (typeof body.jobTitle === "string") data.jobTitle = body.jobTitle.trim();
  if (typeof body.notes === "string") data.notes = body.notes;
  if (body.payload && typeof body.payload === "object") data.payload = body.payload;

  const updated = await prisma.workOrder.update({
    where: { id },
    data,
    include: { employee: true, client: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.res;

  const { id } = await ctx.params;

  await prisma.$transaction(async (tx) => {
    // evita FK: ReceiptItem.orderId apunta a WorkOrder.id
    await tx.receiptItem.updateMany({
      where: { orderId: id },
      data: { orderId: null },
    });

    await tx.workOrder.delete({ where: { id } });
  });

  return NextResponse.json({ ok: true });
}