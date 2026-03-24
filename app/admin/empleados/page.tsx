"use client";

import { useEffect, useMemo, useState } from "react";
import { Shell } from "@/components/Shell";
import { FadeIn } from "@/components/Motion";
import { Modal } from "@/components/Modal";
import { Plus, Save, Trash2, ToggleLeft, ToggleRight, Users } from "lucide-react";

type Employee = {
  id: string;
  number: number;
  name: string;
  isActive: boolean;
  createdAt?: string;
};

export default function AdminEmpleadosPage() {
  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const [newEmp, setNewEmp] = useState({ number: "", name: "", isActive: true });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState<{ number: string; name: string; isActive: boolean }>({
    number: "",
    name: "",
    isActive: true,
  });

  const [modal, setModal] = useState({ open: false, title: "", msg: "" });

  async function load() {
    setLoading(true);
    const r = await fetch("/api/empleados", { cache: "no-store" });
    const j = await r.json();
    setData(Array.isArray(j) ? j : []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const sorted = useMemo(() => [...data].sort((a, b) => a.number - b.number), [data]);

  function startEdit(e: Employee) {
    setEditingId(e.id);
    setEdit({ number: String(e.number), name: e.name, isActive: e.isActive });
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function createEmployee() {
    if (!newEmp.number.trim() || !newEmp.name.trim()) {
      return setModal({ open: true, title: "Faltan datos", msg: "Número y nombre son obligatorios." });
    }

    const r = await fetch("/api/empleados", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        number: Number(newEmp.number),
        name: newEmp.name.trim(),
        isActive: newEmp.isActive,
      }),
    });

    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      return setModal({ open: true, title: "Error", msg: j?.error || "No se pudo crear." });
    }

    setNewEmp({ number: "", name: "", isActive: true });
    await load();
  }

  async function saveEmployee(id: string) {
    if (!edit.number.trim() || !edit.name.trim()) {
      return setModal({ open: true, title: "Faltan datos", msg: "Número y nombre son obligatorios." });
    }

    const r = await fetch(`/api/empleados/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        number: Number(edit.number),
        name: edit.name.trim(),
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

  async function toggleActive(e: Employee) {
    const r = await fetch(`/api/empleados/${e.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ isActive: !e.isActive }),
    });
    if (!r.ok) return setModal({ open: true, title: "Error", msg: "No se pudo actualizar." });
    await load();
  }

  async function deleteEmployee(e: Employee) {
    const ok = confirm(`¿Borrar empleado ${e.number} • ${e.name}?`);
    if (!ok) return;

    const r = await fetch(`/api/empleados/${e.id}`, { method: "DELETE" });
    if (!r.ok) return setModal({ open: true, title: "Error", msg: "No se pudo borrar." });
    await load();
  }

  return (
    <div>
      <Shell mode="admin" title="Admin • Empleados" subtitle="Alta / Edición / Baja" />
      <div className="container">
        <FadeIn>
          <div className="grid" style={{ gridTemplateColumns: "420px 1fr" }}>
            {/* Crear */}
            <div className="card">
              <div className="cardHeader">
                <h2>
                  <Users size={16} style={{ verticalAlign: "-3px" }} /> Nuevo empleado
                </h2>
                <span className="chip">{data.length} total</span>
              </div>
              <div className="cardBody">
                <div className="label">Número</div>
                <input
                  className="input"
                  inputMode="numeric"
                  value={newEmp.number}
                  onChange={(e) => setNewEmp((s) => ({ ...s, number: e.target.value.replace(/[^\d]/g, "") }))}
                  placeholder="Ej: 1"
                />

                <div className="label">Nombre</div>
                <input
                  className="input"
                  value={newEmp.name}
                  onChange={(e) => setNewEmp((s) => ({ ...s, name: e.target.value }))}
                  placeholder="Ej: Empleado 1"
                />

                <div className="label">Activo</div>
                <button className="btn" onClick={() => setNewEmp((s) => ({ ...s, isActive: !s.isActive }))}>
                  {newEmp.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                  {newEmp.isActive ? "Activo" : "Inactivo"}
                </button>

                <div className="hr" />

                <button className="btn accent" style={{ width: "100%" }} onClick={createEmployee}>
                  <Plus size={16} /> Crear empleado
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
                  {sorted.map((e) => {
                    const isEditing = editingId === e.id;
                    return (
                      <div key={e.id} className={"rowItem " + (isEditing ? "active" : "")}>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          {!isEditing ? (
                            <>
                              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                                <span className="tag">#{e.number}</span>
                                <span style={{ fontWeight: 900 }}>{e.name}</span>
                                <span className="tag">{e.isActive ? "Activo" : "Inactivo"}</span>
                              </div>
                              <div className="small">ID: {e.id}</div>
                            </>
                          ) : (
                            <>
                              <div className="label">Número</div>
                              <input
                                className="input"
                                inputMode="numeric"
                                value={edit.number}
                                onChange={(ev) => setEdit((s) => ({ ...s, number: ev.target.value.replace(/[^\d]/g, "") }))}
                              />
                              <div className="label">Nombre</div>
                              <input className="input" value={edit.name} onChange={(ev) => setEdit((s) => ({ ...s, name: ev.target.value }))} />
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
                              <button className="btn" onClick={() => startEdit(e)}>
                                <Save size={16} /> Editar
                              </button>
                              <button className="btn" onClick={() => toggleActive(e)}>
                                {e.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                              </button>
                              <button className="btn danger" onClick={() => deleteEmployee(e)}>
                                <Trash2 size={16} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button className="btn accent" onClick={() => saveEmployee(e.id)}>
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