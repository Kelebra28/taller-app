import { cookies } from "next/headers";
import { cookieName } from "./session";

const secure = process.env.NODE_ENV === "production";

export async function setSessionCookie(token: string) {
  const jar = await cookies(); // ✅ Next 15
  jar.set(cookieName, token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies(); // ✅ Next 15
  jar.set(cookieName, "", {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}