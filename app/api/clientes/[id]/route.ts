import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clientUpdateSchema } from "@/lib/validators";

export async function PATCH(req: Request, { params }:{ params:{ id:string } }) {
  const body = await req.json().catch(()=>({}));
  const parsed = clientUpdateSchema.safeParse(body);
  if(!parsed.success) return NextResponse.json({ error:"INVALID_INPUT", details: parsed.error.flatten() }, { status:400 });
  const updated = await prisma.client.update({ where:{ id: params.id }, data: parsed.data });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }:{ params:{ id:string } }) {
  await prisma.client.delete({ where:{ id: params.id } });
  return NextResponse.json({ ok:true });
}
