export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { employeeUpdateSchema } from "@/lib/validators";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/session";

/** Solo ADMIN puede editar/borrar empleados */
async function requireAdmin() {
  const jar = await cookies();
  const token = jar.get(process.env.AUTH_COOKIE_NAME || "taller_session")?.value;
  if (!token) return false;

  try {
    const s = await verifySession(token);
    return s.role === "ADMIN";
  } catch {
    return false;
  }
}

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const okAdmin = await requireAdmin();
  if (!okAdmin) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const { id } = await ctx.params;

  const body = await req.json().catch(() => ({}));
  const parsed = employeeUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "INVALID_INPUT", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const updated = await prisma.employee.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const okAdmin = await requireAdmin();
  if (!okAdmin) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const { id } = await ctx.params;

  // OJO: si hay WorkOrders ligados a este empleado, Prisma puede fallar por FK.
  // Si te falla, te digo el ajuste exacto en schema (onDelete:SetNull) o borrado en cascada.
  await prisma.employee.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}