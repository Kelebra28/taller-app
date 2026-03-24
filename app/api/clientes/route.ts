import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clientCreateSchema } from "@/lib/validators";

export async function GET() {
  const data = await prisma.client.findMany({ orderBy:{ name:"asc" } });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json().catch(()=>({}));
  const parsed = clientCreateSchema.safeParse(body);
  if(!parsed.success) return NextResponse.json({ error:"INVALID_INPUT", details: parsed.error.flatten() }, { status:400 });

  const created = await prisma.client.create({ data:{
    name: parsed.data.name,
    phone: parsed.data.phone || null,
    rfc: parsed.data.rfc || null,
    isActive: parsed.data.isActive ?? true
  }});
  return NextResponse.json(created);
}
