"use client";

import { useEffect, useMemo, useState } from "react";
import { Shell } from "@/components/Shell";
import { FadeIn } from "@/components/Motion";
import { Modal } from "@/components/Modal";
import { Plus, Save, Trash2, ToggleLeft, ToggleRight, Users } from "lucide-react";

type Client = {
  id: string;
  name: string;
  phone?: string | null;
  rfc?: string | null;
  isActive: boolean;
};

export default function AdminClientesPage() {
  const [data, setData] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const [newC, setNewC] = useState({ name: "", phone: "", rfc: "", isActive: true });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState({ name: "", phone: "", rfc: "", isActive: true });

  const [modal, setModal] = useState({ open: false, title: "", msg: "" });

  async function load() {
    setLoading(true);
    const r = await fetch("/api/clientes", { cache: "no-store" });
    const j = await r.json();
    setData(Array.isArray(j) ? j : []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const sorted = useMemo(() => [...data].sort((a, b) => a.name.localeCompare(b.name)), [data]);

  function startEdit(c: Client) {
    setEditingId(c.id);
    setEdit({
      name: c.name,
      phone: c.phone ?? "",
      rfc: c.rfc ?? "",
      isActive: c.isActive,
    });
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function createClient() {
    if (!newC.name.trim()) {
      return setModal({ open: true, title: "Falta nombre", msg: "El nombre del cliente es obligatorio." });
    }

    const r = await fetch("/api/clientes", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: newC.name.trim(),
        phone: newC.phone.trim() || undefined,
        rfc: newC.rfc.trim() || undefined,
        isActive: newC.isActive,
      }),
    });

    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      return setModal({ open: true, title: "Error", msg: j?.error || "No se pudo crear." });
    }

    setNewC({ name: "", phone: "", rfc: "", isActive: true });
    await load();
  }

  async function saveClient(id: string) {
    if (!edit.name.trim()) {
      return setModal({ open: true, title: "Falta nombre", msg: "El nombre del cliente es obligatorio." });
    }

    const r = await fetch(`/api/clientes/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: edit.name.trim(),
        phone: edit.phone.trim() || undefined,
        rfc: edit.rfc.trim() || undefined,
        isActive: edit.isActive,
      }),
    });

    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      return setModal({ open: true, title: "Error", msg: j?.error || "No se pudo guardar." });
    }

    setEditingId(null);
    await load();
  }

  async function toggleActive(c: Client) {
    const r = await fetch(`/api/clientes/${c.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ isActive: !c.isActive }),
    });
    if (!r.ok) return setModal({ open: true, title: "Error", msg: "No se pudo actualizar." });
    await load();
  }

  async function deleteClient(c: Client) {
    const ok = confirm(`¿Borrar cliente "${c.name}"?`);
    if (!ok) return;

    const r = await fetch(`/api/clientes/${c.id}`, { method: "DELETE" });
    if (!r.ok) return setModal({ open: true, title: "Error", msg: "No se pudo borrar." });
    await load();
  }

  return (
    <div>
      <Shell mode="admin" title="Admin • Clientes" subtitle="Alta / Edición / Baja" />
      <div className="container">
        <FadeIn>
          <div className="grid" style={{ gridTemplateColumns: "420px 1fr" }}>
            {/* Crear */}
            <div className="card">
              <div className="cardHeader">
                <h2>
                  <Users size={16} style={{ verticalAlign: "-3px" }} /> Nuevo cliente
                </h2>
                <span className="chip">{data.length} total</span>
              </div>
              <div className="cardBody">
                <div className="label">Nombre</div>
                <input className="input" value={newC.name} onChange={(e) => setNewC((s) => ({ ...s, name: e.target.value }))} placeholder="Ej: Daniel Olivares" />

                <div className="label">Teléfono</div>
                <input className="input" inputMode="tel" value={newC.phone} onChange={(e) => setNewC((s) => ({ ...s, phone: e.target.value }))} placeholder="Ej: 5512345678" />

                <div className="label">RFC</div>
                <input className="input" value={newC.rfc} onChange={(e) => setNewC((s) => ({ ...s, rfc: e.target.value }))} placeholder="Ej: XAXX010101000" />

                <div className="label">Activo</div>
                <button className="btn" onClick={() => setNewC((s) => ({ ...s, isActive: !s.isActive }))}>
                  {newC.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                  {newC.isActive ? "Activo" : "Inactivo"}
                </button>

                <div className="hr" />

                <button className="btn accent" style={{ width: "100%" }} onClick={createClient}>
                  <Plus size={16} /> Crear cliente
                </button>
              </div>
            </div>

            {/* Lista */}
            <div className="card">
              <div className="cardHeader">
                <h2>Lista</h2>
                <span className="chip">{loading ? "Cargando…" : "OK"}</span>
              </div>
              <div className="cardBody">
                <div style={{ display: "grid", gap: 10 }}>
                  {sorted.map((c) => {
                    const isEditing = editingId === c.id;
                    return (
                      <div key={c.id} className={"rowItem " + (isEditing ? "active" : "")}>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          {!isEditing ? (
                            <>
                              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                                <span style={{ fontWeight: 900 }}>{c.name}</span>
                                <span className="tag">{c.isActive ? "Activo" : "Inactivo"}</span>
                              </div>
                              <div className="small">
                                Tel: {c.phone || "—"} • RFC: {c.rfc || "—"}
                              </div>
                              <div className="small">ID: {c.id}</div>
                            </>
                          ) : (
                            <>
                              <div className="label">Nombre</div>
                              <input className="input" value={edit.name} onChange={(ev) => setEdit((s) => ({ ...s, name: ev.target.value }))} />
                              <div className="label">Teléfono</div>
                              <input className="input" value={edit.phone} onChange={(ev) => setEdit((s) => ({ ...s, phone: ev.target.value }))} />
                              <div className="label">RFC</div>
                              <input className="input" value={edit.rfc} onChange={(ev) => setEdit((s) => ({ ...s, rfc: ev.target.value }))} />
                              <div className="label">Activo</div>
                              <button className="btn" onClick={() => setEdit((s) => ({ ...s, isActive: !s.isActive }))}>
                                {edit.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                                {edit.isActive ? "Activo" : "Inactivo"}
                              </button>
                            </>
                          )}
                        </div>

                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          {!isEditing ? (
                            <>
                              <button className="btn" onClick={() => startEdit(c)}>
                                <Save size={16} /> Editar
                              </button>
                              <button className="btn" onClick={() => toggleActive(c)}>
                                {c.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                              </button>
                              <button className="btn danger" onClick={() => deleteClient(c)}>
                                <Trash2 size={16} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button className="btn accent" onClick={() => saveClient(c.id)}>
                                <Save size={16} /> Guardar
                              </button>
                              <button className="btn" onClick={cancelEdit}>
                                Cancelar
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>

      <Modal
        open={modal.open}
        title={modal.title}
        onClose={() => setModal((m) => ({ ...m, open: false }))}
        actions={<button className="btn primary" onClick={() => setModal((m) => ({ ...m, open: false }))}>OK</button>}
      >
        <div className="small" style={{ lineHeight: 1.6 }}>{modal.msg}</div>
      </Modal>
    </div>
  );
}