export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // query mínima
    const n = await prisma.adminUser.count();
    return NextResponse.json({ ok: true, adminUsers: n });
  } catch (e: any) {
    console.error("HEALTH_ERROR:", e);
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}