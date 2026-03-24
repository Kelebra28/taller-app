import "./globals.css";
import type { ReactNode } from "react";
export const metadata = { title: "Órdenes de Trabajo • Taller", description: "Operación + Admin + Recibos" };
export default function RootLayout({ children }: { children: ReactNode }) {
  return (<html lang="es"><body>{children}</body></html>);
}
