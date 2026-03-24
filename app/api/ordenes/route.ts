import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { orderCreateSchema } from "@/lib/validators";
import { Prisma } from "@prisma/client";


export async function GET(req: Request) {
  const url = new URL(req.url);
  const employeeId = url.searchParams.get("employeeId") || undefined;
  const clientId = url.searchParams.get("clientId") || undefined;
  const workType = url.searchParams.get("workType") || undefined;
  const dateFrom = url.searchParams.get("dateFrom") || undefined;
  const dateTo = url.searchParams.get("dateTo") || undefined;

  const where: any = {};
  if (employeeId) where.employeeId = employeeId;
  if (clientId) where.clientId = clientId;
  if (workType) where.workType = workType;
  if (dateFrom || dateTo) {
    where.workDate = {};
    if (dateFrom) where.workDate.gte = new Date(dateFrom + "T00:00:00.000Z");
    if (dateTo) where.workDate.lte = new Date(dateTo + "T23:59:59.999Z");
  }

  const orders = await prisma.workOrder.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      employee: { select: { id: true, number: true, name: true } },
      client: { select: { id: true, name: true, phone: true, rfc: true } },
    },
    take: 500,
  });
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  const body = await req.json().catch(()=>({}));
  const parsed = orderCreateSchema.safeParse(body);
  if(!parsed.success) return NextResponse.json({ error:"INVALID_INPUT", details: parsed.error.flatten() }, { status:400 });

  const { employeeId, clientId, workDate, workType, jobTitle, notes, payload } = parsed.data;
  const created = await prisma.workOrder.create({
    data:{
      employeeId,
      clientId,
      workDate: new Date(workDate + "T00:00:00.000Z"),
      workType,
      jobTitle,
      notes: notes || null,
      payload: payload as Prisma.InputJsonValue
    },
    include:{
      employee: { select:{ id:true, number:true, name:true } },
      client: { select:{ id:true, name:true, phone:true, rfc:true } },
    }
  });
  return NextResponse.json(created);
}
