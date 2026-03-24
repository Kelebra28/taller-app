import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "dev-secret");
export const cookieName = process.env.AUTH_COOKIE_NAME || "taller_session";

export type SessionPayload = { sub: string; email: string; role: "ADMIN" };

export async function signSession(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySession(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload as unknown as SessionPayload & { exp: number; iat: number };
}