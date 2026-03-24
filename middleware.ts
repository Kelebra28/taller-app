import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookieName } from "@/lib/session"; // ✅ solo cookieName (sin jose)

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // APIs públicas y login/logout no requieren cookie
  const isPublicApi =
    pathname.startsWith("/api/public/") ||
    pathname.startsWith("/api/auth/");

  // OJO: /api/ordenes lo dejamos pasar porque empleados lo usan sin auth admin
  // (admin sí está protegido dentro de los endpoints sensibles)
  const isOrdersApi = pathname.startsWith("/api/ordenes");

  if (isPublicApi || isOrdersApi) return NextResponse.next();

  // Protege panel admin (excepto login)
  const isAdminRoute =
    pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");

  // Protege APIs admin
  const isProtectedApi =
    pathname.startsWith("/api/empleados") ||
    pathname.startsWith("/api/clientes") ||
    pathname.startsWith("/api/recibos");

  if (!isAdminRoute && !isProtectedApi) return NextResponse.next();

  // Solo checamos que exista cookie (sin verificar JWT aquí)
  const token = req.cookies.get(cookieName)?.value;

  if (!token) {
    if (isAdminRoute) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/api/:path*"] };