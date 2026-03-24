import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { employeeCreateSchema } from "@/lib/validators";

export async function GET() {
  const data = await prisma.employee.findMany({ orderBy:{ number:"asc" } });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json().catch(()=>({}));
  const parsed = employeeCreateSchema.safeParse(body);
  if(!parsed.success) return NextResponse.json({ error:"INVALID_INPUT", details: parsed.error.flatten() }, { status:400 });

  const created = await prisma.employee.create({ data:{
    number: parsed.data.number,
    name: parsed.data.name,
    isActive: parsed.data.isActive ?? true
  }});
  return NextResponse.json(created);
}
