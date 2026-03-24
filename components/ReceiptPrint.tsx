"use client";

import Image from "next/image";
import { useMemo } from "react";

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
        <div className="rem-header">
          <div className="rem-logoBox">
            {/* Pon tu logo aquí (usa /public/logo.png por ejemplo) */}
            {/* Si no tienes logo, deja el texto */}
            <div style={{ width: 70, height: 70, position: "relative" }}>
              {/* Cambia el src por tu archivo real en /public */}
              <Image src="/logo-header.svg" alt="Logo" fill style={{ objectFit: "contain" }} />
            </div>
          </div>

          <div className="rem-title">
            <h1>
              MAQUILA Y
              <br />
              MANUFACTURA DE
              <br />
              SUAJES
            </h1>
            <div className="addr">
              LUISA #200 COL. NATIVITAS MEXICO, D.F.
              <br />
              TEL. 5672 4720
            </div>
          </div>

          <div className="rem-no">
            <div>
              <b>No.</b> <span className="n">{data.receiptNo}</span>
            </div>
            <div style={{ marginTop: 6 }}>
              <b>FECHA:</b> {data.issueDate}
            </div>
          </div>
        </div>

        <div className="rem-lines">
          <div>
            <div className="lineRow">
              <div className="labelP">NOMBRE:</div>
              <div className="line">
                <span>{data.clientName}</span>
              </div>
            </div>

            <div className="lineRow">
              <div className="labelP">DIRECCIÓN:</div>
              <div className="line">
                <span>{data.address || ""}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="lineRow">
              <div className="labelP" style={{ minWidth: 48 }}>
                TEL:
              </div>
              <div className="line">
                <span>{data.phone || ""}</span>
              </div>
            </div>
          </div>
        </div>

        <table className="rem-table">
          <thead>
            <tr>
              <th style={{ width: 110 }}>CANTIDAD</th>
              <th>DESCRIPCIÓN</th>
              <th style={{ width: 140 }}>IMPORTE</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r, idx) => (
              <tr key={idx}>
                <td className="td-center">{r.quantity}</td>
                <td>{r.description}</td>
                <td className="td-right">${Number(r.amount || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="rem-footer">
          <div className="rem-note">ESTA REMISIÓN NO ES COMPROBANTE FISCAL</div>
          <div className="rem-total">
            <div>TOTAL</div>
            <div className="box">${total.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}