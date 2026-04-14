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
    <div className="layoutWrapper">
      <header className="topbar">
        <div className="container">
          <div className="topbarLeft">
            <div className="logo">
              <img src="/logo-header.svg" alt="Rpm Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div className="brandText">
              <h1 className="brandTitle">{title}</h1>
              <p className="brandSub">{subtitle}</p>
            </div>
            <span className="chip">{mode === "admin" ? "Admin" : "Operación"}</span>
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
                <Link className="tab active" href="/empleados">
                  <User size={16} /> Operación
                </Link>
                <Link className="tab" href="/admin">
                  <Shield size={16} /> Admin
                </Link>
                {right}
              </div>
            )}
          </nav>

          {/* Mobile */}
          <button className="iconBtn" onClick={() => setOpen((v) => !v)} aria-label="Menu" style={{ display: 'none' }}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>
    </div>
  );
} 