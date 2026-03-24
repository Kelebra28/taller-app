import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifySession, cookieName } from "@/lib/auth";

async function requireAdmin() {
  const jar = await cookies(); // ✅ Next 15
  const token = jar.get(cookieName)?.value;

  if (!token) {
    return { ok: false as const, res: NextResponse.json({ error: "No autenticado" }, { status: 401 }) };
  }

  try {
    const s = await verifySession(token);
    if (s.role !== "ADMIN") {
      return { ok: false as const, res: NextResponse.json({ error: "No autorizado" }, { status: 403 }) };
    }
    return { ok: true as const, session: s };
  } catch {
    return { ok: false as const, res: NextResponse.json({ error: "Sesión inválida" }, { status: 401 }) };
  }
}

// (Opcional) GET para debug — evita 405 si alguien pega GET por error
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.res;

  const order = await prisma.workOrder.findUnique({
    where: { id: params.id },
    include: { employee: true, client: true },
  });

  return NextResponse.json(order);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.res;

  const body = await req.json().catch(() => ({}));
  const data: any = {};

  if (typeof body.jobTitle === "string") data.jobTitle = body.jobTitle.trim();
  if (typeof body.notes === "string") data.notes = body.notes;
  if (body.payload && typeof body.payload === "object") data.payload = body.payload;

  try {
    const updated = await prisma.workOrder.update({
      where: { id: params.id },
      data,
      include: { employee: true, client: true },
    });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "No se pudo actualizar la orden" }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.res;

  try {
    await prisma.$transaction(async (tx) => {
      // Evita error de FK si ReceiptItem tiene orderId opcional
      // Si tu modelo se llama distinto, ajusta este nombre.
      await tx.receiptItem.updateMany({
        where: { orderId: params.id },
        data: { orderId: null },
      });

      await tx.workOrder.delete({ where: { id: params.id } });
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "No se pudo borrar la orden" }, { status: 400 });
  }
}