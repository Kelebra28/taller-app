"use client";

import { useMemo } from "react";

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type ReceiptPrintData = {
  receiptNo: number;
  issueDate: string; // YYYY-MM-DD
  clientName: string;
  address?: string;
  phone?: string;
  rows: Array<{ quantity: number; description: string; amount: number }>;
};

export function ReceiptPrint({ data }: { data: ReceiptPrintData }) {
  const total = useMemo(
    () => data.rows.reduce((acc, r) => acc + (Number(r.amount) || 0), 0),
    [data.rows]
  );

  return (
    <div id="printReceiptArea">
      <div className="remision">
        {/* Marca de Agua (Patrón repetido en diagonal) */}
        <div className="watermark" style={{
          position: 'absolute',
          top: '-20%',
          left: '-20%',
          width: '140%',
          height: '140%',
          opacity: 0.08, // Ajustado para ser más visible pero tenue
          zIndex: 0,
          pointerEvents: 'none',
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)', // Mayor densidad de columnas
          gap: '0px', // Sin espacio entre celdas
          transform: 'rotate(-25deg)', // Diagonal
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact',
          overflow: 'hidden'
        }}>
          {Array.from({ length: 240 }).map((_, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' }}>
              <img 
                src="/logo-header.svg" 
                alt="" 
                style={{ width: '180px', height: '180px', objectFit: 'contain' }} 
              />
            </div>
          ))}
        </div>

        <div style={{ position: 'relative', zIndex: 1, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
          <div className="rem-header" style={{ display: 'grid', gridTemplateColumns: 'min-content 1fr min-content', gap: '20px', alignItems: 'center' }}>
            {/* Left: Large Logo */}
            <div style={{ width: '220px', height: '120px', position: 'relative', padding: '10px' }}>
              <img src="/logo-header.svg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>

            {/* Center: Title / Subtitle */}
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ fontSize: '18px', fontWeight: 900, margin: 0, lineHeight: 1.2 }}>
                MAQUILA Y <br />
                MANUFACTURA DE <br />
                SUAJES
              </h1>
              <div style={{ fontSize: '10px', marginTop: '10px', fontWeight: 500 }}>
                LUISA #200 COL. NATIVITAS MEXICO, D.F.<br />
                TEL. 5672 4720
              </div>
            </div>

            {/* Right: Folio & Date */}
            <div style={{ textAlign: 'right', minWidth: '130px' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>
                No. <span style={{ fontSize: '18px' }}>{data.receiptNo}</span>
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700 }}>
                FECHA: {data.issueDate}
              </div>
            </div>
          </div>

          {/* Client Details Section */}
          <div style={{ marginTop: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '15px' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '10px', marginRight: '30px' }}>
                <span style={{ fontWeight: 800, fontSize: '12px' }}>NOMBRE:</span>
                <div style={{ flex: 1, borderBottom: '1px solid #000', fontSize: '12px', fontWeight: 600, paddingBottom: '2px' }}>
                  {data.clientName}
                </div>
              </div>
              <div style={{ width: '200px', display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                <span style={{ fontWeight: 800, fontSize: '12px' }}>TEL:</span>
                <div style={{ flex: 1, borderBottom: '1px solid #000', fontSize: '12px', fontWeight: 600, paddingBottom: '2px' }}>
                  {data.phone || ""}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', marginBottom: '25px' }}>
              <span style={{ fontWeight: 800, fontSize: '12px' }}>DIRECCIÓN:</span>
              <div style={{ flex: 1, borderBottom: '1px solid #000', fontSize: '12px', fontWeight: 600, paddingBottom: '2px' }}>
                {data.address || ""}
              </div>
            </div>
          </div>

          {/* Table */}
          <table className="rem-table" style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #000', padding: '8px', fontSize: '11px', textAlign: 'center', width: '90px' }}>CANTIDAD</th>
                <th style={{ border: '1px solid #000', padding: '8px', fontSize: '11px', textAlign: 'center' }}>DESCRIPCIÓN</th>
                <th style={{ border: '1px solid #000', padding: '8px', fontSize: '11px', textAlign: 'center', width: '120px' }}>IMPORTE</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((r, idx) => (
                <tr key={idx} style={{ height: '35px' }}>
                  <td style={{ border: '1px solid #000', padding: '4px 8px', textAlign: 'center', fontWeight: 600, fontSize: '12px' }}>{r.quantity}</td>
                  <td style={{ border: '1px solid #000', padding: '4px 8px', fontSize: '12px' }}>{r.description}</td>
                  <td style={{ border: '1px solid #000', padding: '4px 8px', textAlign: 'right', fontWeight: 600, fontSize: '12px' }}>
                    ${Number(r.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '10px' }}>
            <div style={{ fontSize: '10px', fontStyle: 'italic', marginTop: '10px' }}>
              ESTA REMISIÓN NO ES COMPROBANTE FISCAL
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, marginRight: '10px' }}>TOTAL</div>
              <div style={{ border: '1px solid #000', width: '120px', padding: '6px', textAlign: 'right', fontSize: '14px', fontWeight: 800 }}>
                ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}