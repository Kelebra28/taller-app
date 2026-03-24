export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin"; // si no lo tienes, usa tu requireAdmin inline

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, ctx: Ctx) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.res;

  const { id } = await ctx.params;

  await prisma.client.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}