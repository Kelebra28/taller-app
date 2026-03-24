import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validators";
import bcrypt from "bcryptjs";
import { signSession } from "@/lib/auth";
import { setSessionCookie } from "@/lib/cookies";

export async function POST(req: Request) {
  const body = await req.json().catch(()=>({}));
  const parsed = loginSchema.safeParse(body);
  if(!parsed.success) return NextResponse.json({ error:"INVALID_INPUT" }, { status:400 });

  const { email, password } = parsed.data;
  const user = await prisma.adminUser.findUnique({ where:{ email } });
  if(!user) return NextResponse.json({ error:"INVALID_CREDENTIALS" }, { status:401 });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if(!ok) return NextResponse.json({ error:"INVALID_CREDENTIALS" }, { status:401 });

  const token = await signSession({ sub:user.id, email:user.email, role:"ADMIN" });

  await setSessionCookie(token); // ✅ IMPORTANT (Next 15)

  return NextResponse.json({ ok:true });
}