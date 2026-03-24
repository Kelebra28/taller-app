import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [employees, clients] = await Promise.all([
    prisma.employee.findMany({ where:{isActive:true}, orderBy:{number:"asc"}, select:{id:true,number:true,name:true} }),
    prisma.client.findMany({ where:{isActive:true}, orderBy:{name:"asc"}, select:{id:true,name:true,phone:true,rfc:true} }),
  ]);
  return NextResponse.json({ employees, clients });
}
