import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { receiptCreateSchema } from "@/lib/validators";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const clientId = url.searchParams.get("clientId") || undefined;
  const where: any = {};
  if(clientId) where.clientId = clientId;

  const data = await prisma.receipt.findMany({
    where,
    orderBy:{ createdAt:"desc" },
    include:{ client:true, items:true },
    take:200
  });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json().catch(()=>({}));
  const parsed = receiptCreateSchema.safeParse(body);
  if(!parsed.success) return NextResponse.json({ error:"INVALID_INPUT", details: parsed.error.flatten() }, { status:400 });

  const { clientId, address, phone, rfc, items } = parsed.data;
  const created = await prisma.receipt.create({
    data:{
      clientId,
      address: address || null,
      phone: phone || null,
      rfc: rfc || null,
      items: { create: items.map(i=>({
        orderId: i.orderId || null,
        quantity: i.quantity,
        description: i.description,
        amount: new Prisma.Decimal(i.amount)
      })) }
    },
    include:{ client:true, items:true }
  });
  return NextResponse.json(created);
}
