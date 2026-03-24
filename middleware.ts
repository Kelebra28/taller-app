import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookieName, verifySession } from "./lib/auth";
export const runtime = "nodejs";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublicApi = pathname.startsWith("/api/public/") || pathname.startsWith("/api/auth/") || pathname.startsWith("/api/ordenes");
  if (isPublicApi) return NextResponse.next();

  const isAdminRoute = pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");
  const isProtectedApi = pathname.startsWith("/api/empleados") || pathname.startsWith("/api/clientes") || pathname.startsWith("/api/recibos");
  if (!isAdminRoute && !isProtectedApi) return NextResponse.next();

  const token = req.cookies.get(cookieName)?.value;
  if (!token) {
    if (isAdminRoute) return NextResponse.redirect(new URL("/admin/login", req.url));
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  try { await verifySession(token); return NextResponse.next(); }
  catch {
    if (isAdminRoute) return NextResponse.redirect(new URL("/admin/login", req.url));
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
}

export const config = { matcher: ["/admin/:path*", "/api/:path*"] };
