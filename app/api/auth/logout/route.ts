import { NextResponse } from "next/server";
import { cookieName } from "@/lib/session";

const secure = process.env.NODE_ENV === "production";

export async function POST() {
  const res = NextResponse.json({ ok: true });

  res.cookies.set(cookieName, "", {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return res;
}