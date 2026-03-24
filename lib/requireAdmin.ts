import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, cookieName } from "@/lib/session";

export async function requireAdmin() {
  const jar = await cookies();
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