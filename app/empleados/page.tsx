"use client";

import { useEffect, useMemo, useState } from "react";
import { Shell } from "@/components/Shell";
import { FadeIn } from "@/components/Motion";
import { Modal } from "@/components/Modal";
import { PageLoader } from "@/components/PageLoader";
import { Spinner } from "@/components/Loader";
import { Calendar, ClipboardList, Save, User } from "lucide-react";
import { isoToday } from "@/lib/utils";

type Meta = {
  employees: Array<{ id: string; number: number; name: string }>;
  clients: Array<{
    id: string;
    name: string;
    phone?: string | null;
    rfc?: string | null;
  }>;
};

type WorkType = "ACABADO" | "SUAJE" | "IMPRESION" | "MAQUINA_SUAJE";

const workTypes: Array<{ key: WorkType; title: string; desc: string }> = [
  {
    key: "ACABADO",
    title: "Acabado",
    desc: "Acabado + Alce + Cantidad + Empacado + Final",
  },
  {
    key: "SUAJE",
    title: "Suaje",
    desc: "Suajista + Original + Trazo + Detalle",
  },
  {
    key: "IMPRESION",
    title: "Impresión",
    desc: "Prensista + Tiro + Fte/Vta + Material",
  },
  {
    key: "MAQUINA_SUAJE",
    title: "Máquina Suaje",
    desc: "Tiro + Arreglos + Folio interno + Obs",
  },
];

function TypeFields({
  workType,
  payload,
  setPayload,
  disabled,
}: {
  workType: WorkType | "";
  payload: any;
  setPayload: React.Dispatch<React.SetStateAction<any>>;
  disabled: boolean;
}) {
  if (!workType)
    return (
      <div className="small">
        Selecciona un tipo de trabajo para ver sus campos.
      </div>
    );

  const set = (k: string, v: any) =>
    setPayload((p: any) => ({ ...(p || {}), [k]: v }));

  if (workType === "ACABADO") {
    return (
      <>
        <div className="label">Acabado</div>
        <input
          className="input"
          disabled={disabled}
          value={payload?.acabado ?? ""}
          onChange={(e) => set("acabado", e.target.value)}
        />

        <div className="label">Alce</div>
        <input
          className="input"
          disabled={disabled}
          value={payload?.alce ?? ""}
          onChange={(e) => set("alce", e.target.value)}
        />

        <div className="label">Cantidad</div>
        <input
          className="input"
          disabled={disabled}
          inputMode="numeric"
          value={String(payload?.cantidad ?? 0)}
          onChange={(e) =>
            set("cantidad", Number(e.target.value.replace(/[^\d]/g, "")) || 0)
          }
        />

        <div className="label">Empacado</div>
        <input
          className="input"
          disabled={disabled}
          value={payload?.empacado ?? ""}
          onChange={(e) => set("empacado", e.target.value)}
        />

        <div className="label">Observaciones (Acabado final)</div>
        <textarea
          className="textarea"
          disabled={disabled}
          value={payload?.observaciones ?? ""}
          onChange={(e) => set("observaciones", e.target.value)}
        />
      </>
    );
  }

  if (workType === "SUAJE") {
    return (
      <>
        <div className="label">Original</div>
        <input
          className="input"
          disabled={disabled}
          value={payload?.original ?? ""}
          onChange={(e) => set("original", e.target.value)}
        />

        <div className="label">Trazo o dibujo</div>
        <input
          className="input"
          disabled={disabled}
          value={payload?.trazo ?? ""}
          onChange={(e) => set("trazo", e.target.value)}
        />

        <div className="label">Sacabocado</div>
        <input
          className="input"
          disabled={disabled}
          value={payload?.sacabocado ?? ""}
          onChange={(e) => set("sacabocado", e.target.value)}
        />

        <div className="label">Perforado</div>
        <input
          className="input"
          disabled={disabled}
          value={payload?.perforado ?? ""}
          onChange={(e) => set("perforado", e.target.value)}
        />

        <div className="label">Figura</div>
        <input
          className="input"
          disabled={disabled}
          value={payload?.figura ?? ""}
          onChange={(e) => set("figura", e.target.value)}
        />

        <div className="label">Replecado</div>
        <input
          className="input"
          disabled={disabled}
          value={payload?.replecado ?? ""}
          onChange={(e) => set("replecado", e.target.value)}
        />

        <div className="label">Observaciones</div>
        <textarea
          className="textarea"
          disabled={disabled}
          value={payload?.observaciones ?? ""}
          onChange={(e) => set("observaciones", e.target.value)}
        />
      </>
    );
  }

  if (workType === "IMPRESION") {
    return (
      <>
        <div className="label">Tiro</div>
        <input
          className="input"
          disabled={disabled}
          inputMode="numeric"
          value={String(payload?.tiro ?? 0)}
          onChange={(e) =>
            set("tiro", Number(e.target.value.replace(/[^\d]/g, "")) || 0)
          }
        />

        <div className="label">Fte / Vta</div>
        <input
          className="input"
          disabled={disabled}
          value={payload?.frenteVuelta ?? ""}
          onChange={(e) => set("frenteVuelta", e.target.value)}
        />

        <div className="label">Placas</div>
        <input
          className="input"
          disabled={disabled}
          inputMode="numeric"
          value={String(payload?.placas ?? 0)}
          onChange={(e) =>
            set("placas", Number(e.target.value.replace(/[^\d]/g, "")) || 0)
          }
        />

        <div className="label">Tintas</div>
        <input
          className="input"
          disabled={disabled}
          inputMode="numeric"
          value={String(payload?.tintas ?? 0)}
          onChange={(e) =>
            set("tintas", Number(e.target.value.replace(/[^\d]/g, "")) || 0)
          }
        />

        <div className="label">Barniz</div>
        <input
          className="input"
          disabled={disabled}
          value={payload?.barniz ?? ""}
          onChange={(e) => set("barniz", e.target.value)}
        />

        <div className="label">T. Especiales</div>
        <input
          className="input"
          disabled={disabled}
          value={payload?.tEspeciales ?? ""}
          onChange={(e) => set("tEspeciales", e.target.value)}
        />

        <div className="label">Observaciones</div>
        <textarea
          className="textarea"
          disabled={disabled}
          value={payload?.observaciones ?? ""}
          onChange={(e) => set("observaciones", e.target.value)}
        />
      </>
    );
  }

  // MAQUINA_SUAJE
  return (
    <>
      <div className="label">Tiro</div>
      <input
        className="input"
        disabled={disabled}
        inputMode="numeric"
        value={String(payload?.tiro ?? 0)}
        onChange={(e) =>
          set("tiro", Number(e.target.value.replace(/[^\d]/g, "")) || 0)
        }
      />

      <div className="label">Arreglos</div>
      <input
        className="input"
        disabled={disabled}
        value={payload?.arreglos ?? ""}
        onChange={(e) => set("arreglos", e.target.value)}
      />

      <div className="label">Folio (interno)</div>
      <input
        className="input"
        disabled={disabled}
        value={payload?.folioInterno ?? ""}
        onChange={(e) => set("folioInterno", e.target.value)}
      />

      <div className="label">Observaciones</div>
      <textarea
        className="textarea"
        disabled={disabled}
        value={payload?.observaciones ?? ""}
        onChange={(e) => set("observaciones", e.target.value)}
      />
    </>
  );
}

export default function EmpleadosPage() {
  const [meta, setMeta] = useState<Meta | null>(null);

  const [loadingMeta, setLoadingMeta] = useState(true);
  const [saving, setSaving] = useState(false);

  const [employeeId, setEmployeeId] = useState("");
  const [clientId, setClientId] = useState("");
  const [workType, setWorkType] = useState<WorkType | "">("");
  const [workDate, setWorkDate] = useState(isoToday());
  const [jobTitle, setJobTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [payload, setPayload] = useState<any>({});

  const [modal, setModal] = useState({ open: false, title: "", msg: "" });

  const uiBusy = loadingMeta || saving;

  useEffect(() => {
    (async () => {
      setLoadingMeta(true);
      try {
        const r = await fetch("/api/public/meta", { cache: "no-store" });
        const j = await r.json();
        setMeta(j);
      } finally {
        setLoadingMeta(false);
      }
    })();
  }, []);

  // Inicializa payload base cuando cambia el tipo
  useEffect(() => {
    if (!workType) return;
    if (workType === "ACABADO")
      setPayload({
        acabado: "",
        alce: "",
        cantidad: 0,
        empacado: "",
        observaciones: "",
      });
    if (workType === "SUAJE")
      setPayload({
        original: "",
        trazo: "",
        sacabocado: "",
        perforado: "",
        figura: "",
        replecado: "",
        observaciones: "",
      });
    if (workType === "IMPRESION")
      setPayload({
        tiro: 0,
        frenteVuelta: "",
        placas: 0,
        tintas: 0,
        barniz: "",
        tEspeciales: "",
        observaciones: "",
      });
    if (workType === "MAQUINA_SUAJE")
      setPayload({
        tiro: 0,
        arreglos: "",
        folioInterno: "",
        observaciones: "",
      });
  }, [workType]);

  const selectedEmployee = useMemo(
    () => meta?.employees.find((e) => e.id === employeeId),
    [meta, employeeId]
  );

  // Auto-selección de empleado si no hay uno seleccionado y ya cargó meta
  useEffect(() => {
    if (!employeeId && meta?.employees && meta.employees.length > 0) {
      setEmployeeId(meta.employees[0].id);
    }
  }, [meta, employeeId]);

  async function save() {
    if (saving || loadingMeta) return;
    
    if (!employeeId) {
      // Intentar forzar el primero de nuevo si por algo se borró
      const first = meta?.employees?.[0]?.id;
      if (first) setEmployeeId(first);
      else {
        setModal({ open: true, title: "Error", msg: "No hay empleados activos cargados." });
        return;
      }
    }

    setSaving(true);
    try {
      if (!clientId) {
        setModal({ open: true, title: "Falta cliente", msg: "Selecciona un cliente." });
        return;
      }
      if (!workType) {
        setModal({ open: true, title: "Falta tipo", msg: "Selecciona tipo de trabajo." });
        return;
      }
      if (!jobTitle.trim()) {
        setModal({ open: true, title: "Falta trabajo", msg: "Escribe el nombre del trabajo." });
        return;
      }

      const res = await fetch("/api/ordenes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          employeeId: employeeId || meta?.employees[0]?.id,
          clientId,
          workDate,
          workType,
          jobTitle,
          notes: notes || "",
          payload,
        }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setModal({
          open: true,
          title: "Error",
          msg: j?.error || "No se pudo guardar la orden.",
        });
        return;
      }

      const saved = await res.json();
      setModal({
        open: true,
        title: "¡Orden Guardada!",
        msg: `Se ha registrado la orden satisfactoriamente. Número interno: ${saved.orderNo}`,
      });

      // Reset fields
      setJobTitle("");
      setNotes("");
      setWorkType("");
      setPayload({});
      setClientId("");
      setWorkDate(isoToday());
    } catch {
      setModal({
        open: true,
        title: "Error",
        msg: "Ocurrió un error inesperado al guardar.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <Shell
        mode="empleados"
        title="Panel de Producción"
        subtitle="Captura de Órdenes de Suaje"
      />

      <div className="container">
        <FadeIn>
          {loadingMeta && (
            <PageLoader label="Preparando entorno de trabajo..." />
          )}

          <div className="grid">
            {/* Panel de Selección de Trabajo */}
            <div className={"card " + (loadingMeta ? "loadingBlock" : "")}>
              <div className="cardHeader">
                <h2>1. Tipo de Trabajo</h2>
              </div>

              <div className="cardBody">
                <div className="label">Seleccionar Operador / Empleado</div>
                <select
                  className="select"
                  disabled={uiBusy}
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                >
                  <option value="">— Elegir empleado —</option>
                  {meta?.employees?.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.number} • {emp.name}
                    </option>
                  ))}
                </select>

                <div className="label">¿Qué trabajo se está realizando?</div>
                <div style={{ display: "grid", gap: 12 }}>
                  {workTypes.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      className={"rowItem " + (workType === t.key ? "active" : "")}
                      onClick={() => setWorkType(t.key)}
                      disabled={uiBusy}
                      style={{ textAlign: 'left', width: '100%', cursor: 'pointer' }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: '15px' }}>{t.title}</div>
                        <div className="small" style={{ marginTop: 2 }}>{t.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="hr" />

                <div className="label">Detalles de Entrega</div>
                <div className="label" style={{ marginTop: 0 }}>Seleccionar Cliente</div>
                <select
                  className="select"
                  disabled={uiBusy}
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                >
                  <option value="">— Elegir cliente —</option>
                  {meta?.clients?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <div className="label">Fecha de Trabajo</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    className="input"
                    disabled={uiBusy}
                    type="date"
                    value={workDate}
                    onChange={(e) => setWorkDate(e.target.value)}
                  />
                  <button
                    className="btn"
                    disabled={uiBusy}
                    onClick={() => setWorkDate(isoToday())}
                  >
                    <Calendar size={16} /> Hoy
                  </button>
                </div>
              </div>
            </div>

            {/* Panel de Captura Detallada */}
            <div className={"card " + (saving ? "loadingBlock" : "")}>
              <div className="cardHeader">
                <h2>2. Detalles de la Orden</h2>
                <span className="chip" style={{ background: workType ? 'var(--accent)' : 'var(--bg-subtle)', color: workType ? '#fff' : 'var(--muted)', borderColor: workType ? 'var(--accent)' : 'var(--line)' }}>
                  {workType ? workType : "Esperando tipo"}
                </span>
              </div>

              <div className="cardBody">
                <div className="label">Nombre del Trabajo / Descripción</div>
                <input
                  className="input"
                  style={{ fontSize: '18px', fontWeight: 600 }}
                  disabled={uiBusy}
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Ej: CAJAS PIZZA 30CM"
                />

                <div className="hr" />

                <div className="label">Campos Específicos del Proceso</div>
                <div style={{ background: '#f9f9f9', padding: '16px', borderRadius: '12px', border: '1px dashed #e4e4e7' }}>
                  <TypeFields
                    workType={workType}
                    payload={payload}
                    setPayload={setPayload}
                    disabled={uiBusy}
                  />
                </div>

                <div className="label">Notas Adicionales</div>
                <textarea
                  className="textarea"
                  disabled={uiBusy}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Instrucciones especiales..."
                />

                <div className="hr" />

                <button className="btn accent" onClick={save} disabled={uiBusy || !workType} style={{ width: '100%', padding: '20px', fontSize: '16px' }}>
                  {saving ? <Spinner /> : <Save size={20} />}
                  {saving ? "Guardando proceso..." : "FINALIZAR Y GUARDAR ORDEN"}
                </button>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>

      <Modal
        open={modal.open}
        title={modal.title}
        onClose={() => setModal((m) => ({ ...m, open: false }))}
        actions={
          <button
            className="btn primary"
            onClick={() => setModal((m) => ({ ...m, open: false }))}
          >
            ENTENDIDO
          </button>
        }
      >
        <div style={{ padding: '8px 0', fontSize: '15px' }}>
          {modal.msg}
        </div>
      </Modal>
    </div>
  );
}
