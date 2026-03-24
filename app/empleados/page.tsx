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
        <div className="label">Suajista</div>
        <input
          className="input"
          disabled={disabled}
          value={payload?.suajista ?? ""}
          onChange={(e) => set("suajista", e.target.value)}
        />

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
        <div className="label">Prensista</div>
        <input
          className="input"
          disabled={disabled}
          value={payload?.prensista ?? ""}
          onChange={(e) => set("prensista", e.target.value)}
        />

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
      <div className="label">Prensista</div>
      <input
        className="input"
        disabled={disabled}
        value={payload?.prensista ?? ""}
        onChange={(e) => set("prensista", e.target.value)}
      />

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
        suajista: "",
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
        prensista: "",
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
        prensista: "",
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

  async function save() {
    if (saving || loadingMeta) return;
    setSaving(true);

    try {
      if (!employeeId) {
        setModal({
          open: true,
          title: "Falta empleado",
          msg: "Selecciona un empleado.",
        });
        return;
      }
      if (!clientId) {
        setModal({
          open: true,
          title: "Falta cliente",
          msg: "Selecciona un cliente.",
        });
        return;
      }
      if (!workType) {
        setModal({
          open: true,
          title: "Falta tipo",
          msg: "Selecciona tipo de trabajo.",
        });
        return;
      }
      if (!jobTitle.trim()) {
        setModal({
          open: true,
          title: "Falta trabajo",
          msg: "Escribe el trabajo.",
        });
        return;
      }

      const res = await fetch("/api/ordenes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          employeeId,
          clientId,
          workDate,
          workType,
          jobTitle,
          notes,
          payload,
        }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setModal({
          open: true,
          title: "Error",
          msg: j?.error || "No se pudo guardar.",
        });
        return;
      }

      const saved = await res.json();
      setModal({
        open: true,
        title: "Guardado",
        msg: `Orden guardada. Interno: ${saved.orderNo}`,
      });

      setJobTitle("");
      setNotes("");
      setJobTitle("");
setNotes("");
setWorkType("");
setPayload({});
setClientId("");
setEmployeeId("");
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
        title="Órdenes de Trabajo • Taller"
        subtitle="Operación: captura rápida por empleado"
      />

      <div className="container">
        <FadeIn>
          {loadingMeta && (
            <PageLoader label="Cargando empleados y clientes..." />
          )}

          <div className="grid">
            {/* Panel Izquierdo */}
            <div className={"card " + (loadingMeta ? "loadingBlock" : "")}>
              {loadingMeta && (
                <div className="loadingOverlay">
                  <Spinner size={22} />
                </div>
              )}

              <div className="cardHeader">
                <h2>
                  <User size={16} style={{ verticalAlign: "-3px" }} /> Empleado
                </h2>
                <span className="chip">
                  {meta?.employees?.length ?? 0} activos
                </span>
              </div>

              <div className="cardBody">
                <div className="label">Seleccionar empleado</div>
                <select
                  className="select"
                  disabled={uiBusy}
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                >
                  <option value="">—</option>
                  {meta?.employees?.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.number} • {e.name}
                    </option>
                  ))}
                </select>

                <div className="hr" />

                <div className="label">Cliente</div>
                <select
                  className="select"
                  disabled={uiBusy}
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                >
                  <option value="">—</option>
                  {meta?.clients?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <div className="label">Fecha</div>
                <div style={{ display: "flex", gap: 10 }}>
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

                <div className="hr" />

                <div className="label">Tipo de trabajo</div>

                <div style={{ display: "grid", gap: 10 }}>
                  {workTypes.map((t) => (
                    <div
                      key={t.key}
                      className={
                        "rowItem " + (workType === t.key ? "active" : "")
                      }
                      style={{ cursor: "default" }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 900 }}>{t.title}</div>
                        <div className="small">{t.desc}</div>
                      </div>

                      <button
                        type="button"
                        className="btn"
                        style={{ minWidth: 110 }}
                        disabled={uiBusy}
                        onClick={() => setWorkType(t.key)}
                      >
                        Elegir
                      </button>
                    </div>
                  ))}
                </div>

                <div className="small" style={{ marginTop: 10 }}>
                  Seleccionado: <b>{workType || "—"}</b>
                </div>
              </div>
            </div>

            {/* Panel Derecho */}
            <div className={"card " + (saving ? "loadingBlock" : "")}>
              {saving && (
                <div className="loadingOverlay">
                  <Spinner size={22} />
                </div>
              )}

              <div className="cardHeader">
                <h2>
                  <ClipboardList size={16} style={{ verticalAlign: "-3px" }} />{" "}
                  Captura
                </h2>
                <span className="chip">
                  Empleado: {selectedEmployee ? selectedEmployee.number : "—"}
                </span>
              </div>

              <div className="cardBody">
                <div className="label">Trabajo</div>
                <input
                  className="input"
                  disabled={uiBusy}
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Ej: Hojas suajadas, Trípticos..."
                />

                <div className="label">Observaciones (generales)</div>
                <textarea
                  className="textarea"
                  disabled={uiBusy}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notas..."
                />

                <div className="hr" />

                <div className="label">Campos del tipo</div>
                <TypeFields
                  workType={workType}
                  payload={payload}
                  setPayload={setPayload}
                  disabled={uiBusy}
                />

                <div className="hr" />

                <button className="btn accent" onClick={save} disabled={uiBusy}>
                  {saving ? <Spinner /> : <Save size={16} />}
                  {saving ? "Guardando..." : "Guardar orden"}
                </button>

                <div className="hr" />
                <div className="small">Ya guarda payload por tipo en DB.</div>
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
            OK
          </button>
        }
      >
        <div className="small" style={{ lineHeight: 1.6 }}>
          {modal.msg}
        </div>
      </Modal>
    </div>
  );
}
