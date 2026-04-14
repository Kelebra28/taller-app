"use client";

import { useEffect, useMemo, useState } from "react";
import { Shell } from "@/components/Shell";
import { FadeIn } from "@/components/Motion";
import { Modal } from "@/components/Modal";
import { ReceiptPrint, type ReceiptPrintData } from "@/components/ReceiptPrint";
import { PageLoader } from "@/components/PageLoader";
import { Spinner } from "@/components/Loader";
import {
  Filter,
  Printer,
  RefreshCw,
  Save,
  Plus,
  Minus,
  Eye,
  X,
  Trash2,
  Pencil,
  Ban,
} from "lucide-react";
import { displayOrderNo, isoToday } from "@/lib/utils";

type Order = any;

type ReceiptDraft = {
  clientId: string;
  clientName: string;
  address: string;
  phone: string;
  rfc: string;
  items: Array<{
    orderId?: string;
    quantity: number;
    description: string;
    amount: number;
  }>;
};

/** Editor de payload amigable por tipo (sin JSON) */
function PayloadFields({
  workType,
  payload,
  setPayload,
  disabled,
}: {
  workType: string;
  payload: any;
  setPayload: (p: any) => void;
  disabled: boolean;
}) {
  const set = (k: string, v: any) => setPayload({ ...(payload || {}), [k]: v });

  if (!workType) return null;

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

      <div className="label">Folio interno</div>
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

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<
    Array<{
      id: string;
      name: string;
      phone?: string | null;
      rfc?: string | null;
    }>
  >([]);
  const [employees, setEmployees] = useState<
    Array<{ id: string; number: number; name: string }>
  >([]);

  const [filters, setFilters] = useState({
    employeeId: "",
    clientId: "",
    workType: "",
    dateFrom: "",
    dateTo: "",
  });

  // loaders
  const [loadingAdmin, setLoadingAdmin] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [buildingDraft, setBuildingDraft] = useState(false);
  const [savingReceipt, setSavingReceipt] = useState(false);
  const [printing, setPrinting] = useState(false);

  // recibo
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(
    new Set()
  );
  const [draft, setDraft] = useState<ReceiptDraft | null>(null);
  const [printData, setPrintData] = useState<ReceiptPrintData | null>(null);

  // detalle / edición orden
  const [focusedOrderId, setFocusedOrderId] = useState<string | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(false);
  const [editJobTitle, setEditJobTitle] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editPayload, setEditPayload] = useState<any>({});
  const [savingOrderEdit, setSavingOrderEdit] = useState(false);
  const [deletingOrder, setDeletingOrder] = useState(false);

  const [modal, setModal] = useState<{
    open: boolean;
    title: string;
    msg: string;
  }>({
    open: false,
    title: "",
    msg: "",
  });

  const uiBusy = loadingAdmin || loadingOrders || savingReceipt;

  async function loadMeta() {
    const [eRes, cRes] = await Promise.all([
      fetch("/api/empleados"),
      fetch("/api/clientes"),
    ]);
    if (eRes.ok) setEmployees(await eRes.json());
    if (cRes.ok) setClients(await cRes.json());
  }

  async function loadOrders() {
    if (loadingOrders) return;
    setLoadingOrders(true);

    try {
      const qs = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => v && qs.set(k, v));
      const res = await fetch("/api/ordenes?" + qs.toString(), {
        cache: "no-store",
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } finally {
      setLoadingOrders(false);
    }
  }

  useEffect(() => {
    (async () => {
      setLoadingAdmin(true);
      try {
        await loadMeta();
        await loadOrders();
      } finally {
        setLoadingAdmin(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clientOrders = useMemo(() => {
    if (!selectedClient) return [];
    return orders.filter((o) => o.client?.id === selectedClient);
  }, [orders, selectedClient]);

  const focusedOrder = useMemo(() => {
    if (!focusedOrderId) return null;
    return orders.find((o) => o.id === focusedOrderId) || null;
  }, [orders, focusedOrderId]);

  const selectedClientName = useMemo(
    () => clients.find((c) => c.id === selectedClient)?.name || "",
    [clients, selectedClient]
  );

  // Stepper
  const step1 = !!selectedClient;
  const step2 = selectedOrderIds.size > 0;
  const step3 = !!draft;

  function toggleOrder(id: string) {
    setSelectedOrderIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function clearReceiptState() {
    setDraft(null);
    setPrintData(null);
  }

  function clearSelection() {
    setSelectedOrderIds(new Set());
    setFocusedOrderId(null);
    setDraft(null);
    setPrintData(null);
    setEditingOrder(false);
  }

  async function createDraftFromSelection() {
    if (buildingDraft) return;
    setBuildingDraft(true);

    try {
      if (!selectedClient) {
        setModal({
          open: true,
          title: "Falta cliente",
          msg: "Selecciona un cliente.",
        });
        return;
      }

      const picked = clientOrders.filter((o) => selectedOrderIds.has(o.id));
      if (picked.length === 0) {
        setModal({
          open: true,
          title: "Nada seleccionado",
          msg: "Selecciona al menos 1 orden.",
        });
        return;
      }

      const c = clients.find((x) => x.id === selectedClient);

      const items = picked.map((o: any) => ({
        orderId: o.id,
        quantity: 1,
        description: `#${displayOrderNo(o.orderNo)} • ${o.workType} • ${
          o.jobTitle
        }`,
        amount: 0,
      }));

      setDraft({
        clientId: selectedClient,
        clientName: c?.name || "—",
        address: "",
        phone: c?.phone || "",
        rfc: c?.rfc || "",
        items,
      });

      setModal({
        open: true,
        title: "Borrador listo",
        msg: "Ahora ajusta importes/descripciones y guarda el recibo.",
      });
    } finally {
      setBuildingDraft(false);
    }
  }

  function updateItem(
    idx: number,
    patch: Partial<ReceiptDraft["items"][number]>
  ) {
    setDraft((prev) => {
      if (!prev) return prev;
      const next = [...prev.items];
      next[idx] = { ...next[idx], ...patch };
      return { ...prev, items: next };
    });
  }

  function removeItem(idx: number) {
    setDraft((prev) => {
      if (!prev) return prev;
      const next = prev.items.filter((_, i) => i !== idx);
      return { ...prev, items: next };
    });
  }

  function addManualItem() {
    if (!draft) return;
    setDraft({
      ...draft,
      items: [
        ...draft.items,
        { quantity: 1, description: "Servicio adicional", amount: 0 },
      ],
    });
  }

  const draftTotal = useMemo(() => {
    if (!draft) return 0;
    return draft.items.reduce((acc, i) => acc + (Number(i.amount) || 0), 0);
  }, [draft]);

  async function saveReceiptToDb() {
    if (savingReceipt) return;
    setSavingReceipt(true);

    try {
      if (!draft) return;
      if (draft.items.length === 0) {
        setModal({
          open: true,
          title: "Sin items",
          msg: "Agrega al menos un item al recibo.",
        });
        return;
      }

      const res = await fetch("/api/recibos", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          clientId: draft.clientId,
          address: draft.address || undefined,
          phone: draft.phone || undefined,
          rfc: draft.rfc || undefined,
          items: draft.items.map((i) => ({
            orderId: i.orderId,
            quantity: i.quantity,
            description: i.description,
            amount: i.amount,
          })),
        }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setModal({
          open: true,
          title: "Error",
          msg: j?.error || "No se pudo guardar el recibo.",
        });
        return;
      }

      const saved = await res.json();

      const issueDate = String(saved.issueDate).slice(0, 10);
      setPrintData({
        receiptNo: saved.receiptNo,
        issueDate,
        clientName: saved.client?.name || draft.clientName,
        address: saved.address || draft.address,
        phone: saved.phone || draft.phone,
        rows: (saved.items || []).map((it: any) => ({
          quantity: it.quantity,
          description: it.description,
          amount: Number(it.amount),
        })),
      });

      setModal({
        open: true,
        title: "Recibo guardado",
        msg: `Listo. Recibo No. ${saved.receiptNo}. Ya puedes imprimir.`,
      });
    } catch {
      setModal({
        open: true,
        title: "Error",
        msg: "Ocurrió un error inesperado al guardar el recibo.",
      });
    } finally {
      setSavingReceipt(false);
    }
  }

  async function printNow() {
    if (printing) return;
    setPrinting(true);
    try {
      await new Promise<void>((r) => requestAnimationFrame(() => r()));
      await new Promise<void>((r) => setTimeout(() => r(), 80));
      window.print();
    } finally {
      setTimeout(() => setPrinting(false), 400);
    }
  }

  async function saveOrderEdits() {
    if (!focusedOrder) return;
    if (savingOrderEdit) return;

    setSavingOrderEdit(true);
    try {
      const res = await fetch(`/api/ordenes/${focusedOrder.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          jobTitle: editJobTitle,
          notes: editNotes,
          payload: editPayload,
        }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setModal({
          open: true,
          title: "Error",
          msg: j?.error || "No se pudo guardar cambios.",
        });
        return;
      }

      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      setFocusedOrderId(updated.id);
      setEditingOrder(false);
      setModal({
        open: true,
        title: "Guardado",
        msg: "Cambios guardados en la orden.",
      });
    } finally {
      setSavingOrderEdit(false);
    }
  }

  async function runDeleteFocusedOrder() {
    if (!focusedOrder) return;
    if (deletingOrder) return;
  
    setDeletingOrder(true);
    try {
      const res = await fetch(`/api/ordenes/${focusedOrder.id}`, {
        method: "DELETE",
        headers: { "content-type": "application/json" },
      });
  
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setModal({ open: true, title: "Error", msg: j?.error || "No se pudo borrar la orden." });
        return;
      }
  
      // Limpia UI
      setOrders((prev) => prev.filter((o) => o.id !== focusedOrder.id));
      setSelectedOrderIds((prev) => {
        const next = new Set(prev);
        next.delete(focusedOrder.id);
        return next;
      });
      setFocusedOrderId(null);
      setEditingOrder(false);
  
      setModal({ open: true, title: "Borrada", msg: "Orden borrada correctamente." });
    } finally {
      setDeletingOrder(false);
      setConfirmDeleteOpen(false);
    }
  }
  async function deleteFocusedOrder() {
    if (!focusedOrder) return;
    if (deletingOrder) return;

    const ok = function deleteFocusedOrder() {
      if (!focusedOrder) return;
      setConfirmDeleteOpen(true);
    }
    if (!ok) return;

    setDeletingOrder(true);
    try {
      const res = await fetch(`/api/ordenes/${focusedOrder.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setModal({
          open: true,
          title: "Error",
          msg: j?.error || "No se pudo borrar la orden.",
        });
        return;
      }

      // limpia UI
      setOrders((prev) => prev.filter((o) => o.id !== focusedOrder.id));
      setSelectedOrderIds((prev) => {
        const next = new Set(prev);
        next.delete(focusedOrder.id);
        return next;
      });

      setFocusedOrderId(null);
      setEditingOrder(false);

      setModal({
        open: true,
        title: "Borrada",
        msg: "Orden borrada correctamente.",
      });
    } finally {
      setDeletingOrder(false);
    }
  }

  return (
    <div>
      <Shell
        mode="admin"
        title="Admin • Taller"
        subtitle="Órdenes, recibos y control"
        right={
          <button
            className="btn"
            onClick={loadOrders}
            disabled={loadingAdmin || loadingOrders}
          >
            {loadingOrders ? <Spinner /> : <RefreshCw size={16} />}
            {loadingOrders ? "Cargando..." : "Actualizar"}
          </button>
        }
      />

      <div className="container">
        <FadeIn>
          {loadingAdmin && (
            <PageLoader label="Cargando panel de administración..." />
          )}

          <div className="grid" style={{ gridTemplateColumns: "420px 1fr" }}>
            {/* LEFT */}
            <div className={"card " + (uiBusy ? "loadingBlock" : "")}>
              {uiBusy && (
                <div className="loadingOverlay">
                  <Spinner size={22} />
                </div>
              )}

              <div className="cardHeader">
                <h2>
                  <Filter size={16} style={{ verticalAlign: "-3px" }} /> Filtros
                </h2>
                <span className="chip">{orders.length} órdenes</span>
              </div>

              <div className="cardBody">
                <div className="label">Empleado</div>
                <select
                  className="select"
                  disabled={uiBusy}
                  value={filters.employeeId}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, employeeId: e.target.value }))
                  }
                >
                  <option value="">—</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.number} • {e.name}
                    </option>
                  ))}
                </select>

                <div className="label">Tipo</div>
                <select
                  className="select"
                  disabled={uiBusy}
                  value={filters.workType}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, workType: e.target.value }))
                  }
                >
                  <option value="">—</option>
                  <option value="ACABADO">ACABADO</option>
                  <option value="SUAJE">SUAJE</option>
                  <option value="IMPRESION">IMPRESION</option>
                  <option value="MAQUINA_SUAJE">MAQUINA_SUAJE</option>
                </select>

                <div className="label">Rango fechas</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <input
                    className="input"
                    disabled={uiBusy}
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, dateFrom: e.target.value }))
                    }
                  />
                  <input
                    className="input"
                    disabled={uiBusy}
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, dateTo: e.target.value }))
                    }
                  />
                </div>

                <div className="hr" />

                <button
                  className="btn accent"
                  style={{ width: "100%" }}
                  disabled={loadingAdmin || loadingOrders}
                  onClick={loadOrders}
                >
                  {loadingOrders ? <Spinner /> : <Filter size={16} />}
                  {loadingOrders ? "Cargando..." : "Aplicar filtros"}
                </button>

                <div className="hr" />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 10,
                    marginTop: 20
                  }}
                >
                  <div style={{ fontWeight: 800 }}>Generar Recibo</div>
                  <button
                    className="btn sm"
                    disabled={
                      uiBusy ||
                      (!selectedClient && selectedOrderIds.size === 0 && !draft)
                    }
                    onClick={clearSelection}
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                  >
                    <X size={14} /> Limpiar
                  </button>
                </div>

                <div className="label">
                  Seleccionar cliente (para armar recibo)
                </div>
                <select
                  className="select"
                  disabled={uiBusy}
                  value={selectedClient}
                  onChange={(e) => {
                    setSelectedClient(e.target.value);
                    setSelectedOrderIds(new Set());
                    setFocusedOrderId(null);
                    setEditingOrder(false);
                    clearReceiptState();
                  }}
                >
                  <option value="">—</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <div className="small" style={{ marginTop: 10 }}>
                  {selectedClient ? (
                    <>
                      Cliente para recibo: <b>{selectedClientName}</b>
                    </>
                  ) : (
                    <>
                      Selecciona un cliente para habilitar selección de órdenes.
                    </>
                  )}
                </div>

                <button
                  className="btn primary"
                  style={{ width: "100%", marginTop: 10 }}
                  onClick={createDraftFromSelection}
                  disabled={
                    uiBusy ||
                    buildingDraft ||
                    !selectedClient ||
                    selectedOrderIds.size === 0
                  }
                >
                  {buildingDraft ? <Spinner /> : <Printer size={16} />}
                  {buildingDraft ? "Creando..." : "Crear borrador"}
                </button>

                {printData && (
                  <button
                    className="btn"
                    style={{ width: "100%", marginTop: 10 }}
                    onClick={printNow}
                    disabled={printing}
                  >
                    {printing ? <Spinner /> : <Printer size={16} />}
                    {printing ? "Abriendo impresión..." : "Imprimir"}
                  </button>
                )}
              </div>
            </div>

            {/* RIGHT */}
            <div className="card">
              <div className="cardHeader">
                <h2>ÓRDENES / RECIBO</h2>
                <span className="chip">
                  {selectedClient ? "Selecciona órdenes" : "Selecciona cliente"}
                </span>
              </div>

              <div className="cardBody">
                {(loadingAdmin || loadingOrders) && (
                  <PageLoader label="Cargando órdenes..." />
                )}

                <div className="stepper">
                  <div className={"step " + (step1 ? "done" : "active")}>
                    1) Cliente
                  </div>
                  <div
                    className={
                      "step " + (step2 ? "done" : step1 ? "active" : "")
                    }
                  >
                    2) Órdenes
                  </div>
                  <div
                    className={
                      "step " + (step3 ? "done" : step2 ? "active" : "")
                    }
                  >
                    3) Borrador
                  </div>
                </div>

                {!selectedClient ? (
                  <div className="small" style={{ marginBottom: 12 }}>
                    Primero selecciona un <b>cliente para recibo</b> en el panel
                    izquierdo.
                  </div>
                ) : (
                  <div className="small" style={{ marginBottom: 12 }}>
                    Cliente: <b>{selectedClientName}</b> • Seleccionadas:{" "}
                    <b>{selectedOrderIds.size}</b>
                    <br />
                    Tip: click en la orden o usa el checkbox para incluirla.
                  </div>
                )}

                <div style={{ display: "grid", gap: 10 }}>
                  {(selectedClient ? clientOrders : orders)
                    .slice(0, 250)
                    .map((o: any) => {
                      const selected = selectedOrderIds.has(o.id);
                      const isFocused = focusedOrderId === o.id;

                      return (
                        <div
                          key={o.id}
                          className={
                            "rowItem orderRow " +
                            (selected ? "selected" : "") +
                            (isFocused ? " active" : "")
                          }
                          onClick={() => {
                            if (!selectedClient || uiBusy) return;
                            toggleOrder(o.id);
                            setFocusedOrderId(o.id);

                            setEditingOrder(false);
                            setEditJobTitle(o.jobTitle || "");
                            setEditNotes(o.notes || "");
                            setEditPayload(o.payload || {});
                          }}
                          role={selectedClient ? "button" : undefined}
                          tabIndex={selectedClient ? 0 : -1}
                          onKeyDown={(e) => {
                            if (!selectedClient || uiBusy) return;
                            if (e.key === "Enter" || e.key === " ") {
                              toggleOrder(o.id);
                              setFocusedOrderId(o.id);

                              setEditingOrder(false);
                              setEditJobTitle(o.jobTitle || "");
                              setEditNotes(o.notes || "");
                              setEditPayload(o.payload || {});
                            }
                          }}
                          style={{
                            cursor: selectedClient ? "pointer" : "default",
                          }}
                        >
                          <div className="orderCheck">
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() => {
                                if (!selectedClient || uiBusy) return;
                                toggleOrder(o.id);
                                setFocusedOrderId(o.id);

                                setEditingOrder(false);
                                setEditJobTitle(o.jobTitle || "");
                                setEditNotes(o.notes || "");
                                setEditPayload(o.payload || {});
                              }}
                              onClick={(e) => e.stopPropagation()}
                              disabled={!selectedClient || uiBusy}
                            />
                          </div>

                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div
                              style={{
                                display: "flex",
                                gap: 8,
                                flexWrap: "wrap",
                                alignItems: "center",
                              }}
                            >
                              <span className="tag">{o.workType}</span>
                              <span className="tag">
                                #{displayOrderNo(o.orderNo)}
                              </span>
                              <span
                                style={{
                                  fontWeight: 900,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  maxWidth: 520,
                                }}
                              >
                                {o.jobTitle}
                              </span>
                            </div>
                            <div className="small">
                              Cliente: {o.client?.name} • Empleado:{" "}
                              {o.employee?.name} • Fecha:{" "}
                              {String(o.workDate).slice(0, 10)}
                            </div>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              gap: 10,
                              alignItems: "center",
                            }}
                          >
                            <button
                              className="btn sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFocusedOrderId(o.id);

                                setEditingOrder(false);
                                setEditJobTitle(o.jobTitle || "");
                                setEditNotes(o.notes || "");
                                setEditPayload(o.payload || {});

                                setDetailModalOpen(true);
                              }}
                              disabled={!selectedClient}
                              title="Ver detalle"
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Detalle editable inline */}
                {selectedClient && focusedOrder && (
                  <>
                    <div className="hr" />

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 900 }}>Detalle de orden</div>
                        <div className="small">
                          #{displayOrderNo(focusedOrder.orderNo)} •{" "}
                          {focusedOrder.workType} •{" "}
                          {String(focusedOrder.workDate).slice(0, 10)}
                        </div>
                      </div>

                      <div
                        style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
                      >
                        <button
                          className="btn"
                          onClick={() => setEditingOrder((v) => !v)}
                          disabled={savingOrderEdit || deletingOrder}
                        >
                          {editingOrder ? (
                            <Ban size={16} />
                          ) : (
                            <Pencil size={16} />
                          )}
                          {editingOrder ? "Cancelar" : "Editar"}
                        </button>

                        <button type="button" className="btn danger" onClick={deleteFocusedOrder} disabled={!focusedOrder || deletingOrder}>
  {deletingOrder ? <Spinner /> : <Trash2 size={16} />}
  {deletingOrder ? "Borrando..." : "Borrar"}
</button>

                        <button
                          className="btn"
                          onClick={() => setDetailModalOpen(true)}
                        >
                          <Eye size={16} /> Ver grande
                        </button>
                      </div>
                    </div>

                    <div className="hr" />

                    <div className="label">Trabajo</div>
                    <input
                      className="input"
                      disabled={
                        !editingOrder || savingOrderEdit || deletingOrder
                      }
                      value={editJobTitle}
                      onChange={(e) => setEditJobTitle(e.target.value)}
                    />

                    <div className="label">Observaciones (generales)</div>
                    <textarea
                      className="textarea"
                      disabled={
                        !editingOrder || savingOrderEdit || deletingOrder
                      }
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                    />

                    <div className="label">Campos del tipo</div>
                    <PayloadFields
                      workType={focusedOrder.workType}
                      payload={editPayload}
                      setPayload={setEditPayload}
                      disabled={
                        !editingOrder || savingOrderEdit || deletingOrder
                      }
                    />

                    {editingOrder && (
                      <button
                        className="btn accent"
                        style={{ marginTop: 12 }}
                        disabled={savingOrderEdit || deletingOrder}
                        onClick={saveOrderEdits}
                      >
                        {savingOrderEdit ? <Spinner /> : <Save size={16} />}
                        {savingOrderEdit ? "Guardando..." : "Guardar cambios"}
                      </button>
                    )}
                  </>
                )}

                {/* Editor borrador */}
                {draft && (
                  <>
                    <div className="hr" />

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 10,
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 900 }}>
                          Borrador de recibo
                        </div>
                        <div className="small">
                          Edita importes, agrega items manuales y guarda.
                        </div>
                      </div>
                      <span className="chip">
                        Total: ${draftTotal.toFixed(2)}
                      </span>
                    </div>

                    <div className="label">Dirección (opcional)</div>
                    <input
                      className="input"
                      disabled={savingReceipt}
                      value={draft.address}
                      onChange={(e) =>
                        setDraft((d) => d && { ...d, address: e.target.value })
                      }
                    />

                    <div className="label">Teléfono</div>
                    <input
                      className="input"
                      disabled={savingReceipt}
                      value={draft.phone}
                      onChange={(e) =>
                        setDraft((d) => d && { ...d, phone: e.target.value })
                      }
                    />

                    <div className="label">RFC</div>
                    <input
                      className="input"
                      disabled={savingReceipt}
                      value={draft.rfc}
                      onChange={(e) =>
                        setDraft((d) => d && { ...d, rfc: e.target.value })
                      }
                    />

                    <div className="hr" />

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button
                        className="btn"
                        onClick={addManualItem}
                        disabled={savingReceipt}
                      >
                        <Plus size={16} /> Item manual
                      </button>

                      <button
                        className="btn accent"
                        onClick={saveReceiptToDb}
                        disabled={savingReceipt}
                      >
                        {savingReceipt ? <Spinner /> : <Save size={16} />}
                        {savingReceipt ? "Guardando..." : "Guardar recibo"}
                      </button>
                    </div>

                    <div className="hr" />

                    <div style={{ display: "grid", gap: 10 }}>
                      {draft.items.map((it, idx) => (
                        <div key={idx} className="rowItem">
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="label">Descripción</div>
                            <input
                              className="input"
                              disabled={savingReceipt}
                              value={it.description}
                              onChange={(e) =>
                                updateItem(idx, { description: e.target.value })
                              }
                            />

                            <div
                              style={{
                                display: "flex",
                                gap: 10,
                                marginTop: 10,
                                flexWrap: "wrap",
                              }}
                            >
                              <div style={{ flex: "0 0 160px" }}>
                                <div className="label">Cantidad</div>
                                <div style={{ display: "flex", gap: 10 }}>
                                  <button
                                    className="btn"
                                    disabled={savingReceipt}
                                    onClick={() =>
                                      updateItem(idx, {
                                        quantity: Math.max(
                                          1,
                                          (it.quantity || 1) - 1
                                        ),
                                      })
                                    }
                                  >
                                    <Minus size={16} />
                                  </button>
                                  <input
                                    className="input"
                                    disabled={savingReceipt}
                                    inputMode="numeric"
                                    value={String(it.quantity)}
                                    onChange={(e) => {
                                      const v = e.target.value.replace(
                                        /[^\d]/g,
                                        ""
                                      );
                                      updateItem(idx, {
                                        quantity: Math.max(1, Number(v || 1)),
                                      });
                                    }}
                                  />
                                  <button
                                    className="btn"
                                    disabled={savingReceipt}
                                    onClick={() =>
                                      updateItem(idx, {
                                        quantity: (it.quantity || 1) + 1,
                                      })
                                    }
                                  >
                                    <Plus size={16} />
                                  </button>
                                </div>
                              </div>

                              <div style={{ flex: "0 0 220px" }}>
                                <div className="label">Importe</div>
                                <input
                                  className="input"
                                  disabled={savingReceipt}
                                  inputMode="decimal"
                                  value={String(it.amount)}
                                  onChange={(e) => {
                                    const clean = e.target.value.replace(
                                      /[^\d.]/g,
                                      ""
                                    );
                                    updateItem(idx, {
                                      amount: Number(clean || 0),
                                    });
                                  }}
                                />
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "flex-end",
                                }}
                              >
                                <button
                                  className="btn danger"
                                  disabled={savingReceipt}
                                  onClick={() => removeItem(idx)}
                                >
                                  Quitar
                                </button>
                              </div>
                            </div>
                          </div>

                          <span className="tag">
                            ${Number(it.amount || 0).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
      <Modal
  open={confirmDeleteOpen}
  title="Confirmar borrado"
  onClose={() => setConfirmDeleteOpen(false)}
  actions={
    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
      <button className="btn" onClick={() => setConfirmDeleteOpen(false)} disabled={deletingOrder}>
        Cancelar
      </button>
      <button className="btn danger primary" onClick={runDeleteFocusedOrder} disabled={deletingOrder}>
        {deletingOrder ? <Spinner /> : <Trash2 size={16} />}
        {deletingOrder ? "Borrando..." : "Sí, borrar permanentemente"}
      </button>
    </div>
  }
>
  <div style={{ padding: '10px 0', fontSize: '15px' }}>
    {focusedOrder ? (
      <>
        Se eliminará la orden <b style={{ color: 'var(--accent)' }}>#{displayOrderNo(focusedOrder.orderNo)}</b>.
        <br />
        Esta acción es irreversible y afectará el historial de producción.
      </>
    ) : (
      "Por favor selecciona una orden para continuar."
    )}
  </div>
</Modal>
      {/* Modal detalle grande */}
      <Modal
        open={detailModalOpen}
        title={
          focusedOrder
            ? `Detalle • #${displayOrderNo(focusedOrder.orderNo)} • ${
                focusedOrder.workType
              }`
            : "Detalle"
        }
        onClose={() => setDetailModalOpen(false)}
        actions={
          <button
            className="btn primary"
            onClick={() => setDetailModalOpen(false)}
          >
            OK
          </button>
        }
      >
        {!focusedOrder ? (
          <div className="small">Selecciona una orden para ver su detalle.</div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            <div className="small">
              Cliente: <b>{focusedOrder.client?.name}</b> • Empleado:{" "}
              <b>{focusedOrder.employee?.name}</b> • Fecha:{" "}
              <b>{String(focusedOrder.workDate).slice(0, 10)}</b>
            </div>

            <div>
              <div className="label">Trabajo</div>
              <div className="rowItem">{focusedOrder.jobTitle}</div>
            </div>

            <div>
              <div className="label">Observaciones</div>
              <div className="rowItem" style={{ whiteSpace: "pre-wrap" }}>
                {focusedOrder.notes || "—"}
              </div>
            </div>

            <div>
              <div className="label">Campos del tipo</div>
              <div
                className="rowItem"
                style={{
                  whiteSpace: "pre-wrap",
                  fontFamily: "var(--mono)",
                  fontSize: 12,
                  lineHeight: 1.5,
                }}
              >
                {JSON.stringify(focusedOrder.payload ?? {}, null, 2)}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal general */}
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

      <div style={{ display: 'none' }} className="print-only">
        <ReceiptPrint
          data={
            printData ?? {
              receiptNo: 0,
              issueDate: isoToday(),
              clientName: "",
              address: "",
              phone: "",
              rows: [],
            }
          }
        />
      </div>
    </div>
  );
}
