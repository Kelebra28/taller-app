"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Menu, X, Shield, User, LogOut, FileText, Users, Building2 } from "lucide-react";

type Mode = "empleados" | "admin";

export function Shell({
  title,
  subtitle,
  mode,
  right,
}: {
  title: string;
  subtitle: string;
  mode: Mode;
  right?: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const adminTabs = useMemo(
    () => [
      { href: "/admin", label: "Órdenes / Recibos", icon: <FileText size={16} /> },
      { href: "/admin/empleados", label: "Empleados", icon: <Users size={16} /> },
      { href: "/admin/clientes", label: "Clientes", icon: <Building2 size={16} /> },
    ],
    []
  );

  const activeAdmin = useMemo(() => {
    if (!pathname) return "/admin";
    if (pathname.startsWith("/admin/empleados")) return "/admin/empleados";
    if (pathname.startsWith("/admin/clientes")) return "/admin/clientes";
    if (pathname.startsWith("/admin")) return "/admin";
    return "/admin";
  }, [pathname]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <div className="container">
      <header className="topbar">
        <div className="topbarLeft">
          <div className="logo" />
          <div className="brandText">
            <div className="brandTitle">{title}</div>
            <div className="brandSub">{subtitle}</div>
          </div>
          <span className="pill">{mode === "admin" ? "Admin" : "Operación"}</span>
        </div>

        {/* Desktop */}
        <nav className="topbarRight">
          {mode === "admin" ? (
            <>
              <div className="tabs">
                {adminTabs.map((t) => (
                  <Link
                    key={t.href}
                    href={t.href}
                    className={"tab " + (activeAdmin === t.href ? "active" : "")}
                  >
                    {t.icon}
                    <span>{t.label}</span>
                  </Link>
                ))}
              </div>

              <div className="topbarActions">
                {right}
                <button className="btn danger" onClick={logout}>
                  <LogOut size={16} /> Salir
                </button>
              </div>
            </>
          ) : (
            <div className="topbarActions">
              <Link className="btn" href="/empleados">
                <User size={16} /> Operación
              </Link>
              <Link className="btn" href="/admin">
                <Shield size={16} /> Admin
              </Link>
              {right}
            </div>
          )}
        </nav>

        {/* Mobile */}
        <button className="iconBtn" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="drawer" onClick={() => setOpen(false)}>
          <div className="drawerPanel" onClick={(e) => e.stopPropagation()}>
            {mode === "admin" ? (
              <>
                <div className="drawerTitle">Admin</div>
                <div className="drawerList">
                  {adminTabs.map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      className={"drawerItem " + (activeAdmin === t.href ? "active" : "")}
                      onClick={() => setOpen(false)}
                    >
                      {t.icon}
                      <span>{t.label}</span>
                    </Link>
                  ))}
                </div>
                <div className="drawerFooter">
                  {right}
                  <button className="btn danger" onClick={logout}>
                    <LogOut size={16} /> Salir
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="drawerTitle">Menú</div>
                <div className="drawerList">
                  <Link className="drawerItem active" href="/empleados" onClick={() => setOpen(false)}>
                    <User size={16} /> <span>Operación</span>
                  </Link>
                  <Link className="drawerItem" href="/admin" onClick={() => setOpen(false)}>
                    <Shield size={16} /> <span>Admin</span>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 