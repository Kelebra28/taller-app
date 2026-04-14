"use client";
import { useState } from "react";
import { Shell } from "@/components/Shell";
import { FadeIn } from "@/components/Motion";
import { Modal } from "@/components/Modal";
import { Lock, LogIn, Mail } from "lucide-react";

export default function AdminLoginPage(){
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [modal,setModal] = useState({ open:false, title:"", msg:"" });

  async function login(){
    const res = await fetch("/api/auth/login",{ method:"POST", headers:{ "content-type":"application/json" }, body: JSON.stringify({ email, password }) });
    if(!res.ok){
      const j = await res.json().catch(()=>({}));
      return setModal({ open:true, title:"Error", msg: j?.error || "No se pudo iniciar sesión" });
    }
    window.location.href = "/admin";
  }

  return (
    <div>
      <Shell mode="admin" title="Admin • Taller" subtitle="Login administrador (cookies + jose)" />
      <div className="container">
        <FadeIn>
          <div className="card" style={{ width:"min(560px,100%)", margin:"0 auto" }}>
            <div className="cardHeader">
              <h2><Lock size={16} style={{verticalAlign:"-3px"}}/> Iniciar sesión</h2>
              <span className="chip">HttpOnly</span>
            </div>
            <div className="cardBody">
              <div className="label">Email</div>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <span className="tag"><Mail size={14}/></span>
                <input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} />
              </div>

              <div className="label">Password</div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span className="tag">
                  <Lock size={14} />
                </span>
                <input
                  className="input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="hr" />
              <button
                className="btn accent"
                style={{ width: "100%" }}
                onClick={login}
              >
                <LogIn size={16} /> Entrar
              </button>
            </div>
          </div>
        </FadeIn>
      </div>

      <Modal open={modal.open} title={modal.title} onClose={()=>setModal(m=>({...m,open:false}))}
        actions={<button className="btn primary" onClick={()=>setModal(m=>({...m,open:false}))}>OK</button>}
      >
        <div className="small" style={{lineHeight:1.6}}>{modal.msg}</div>
      </Modal>
    </div>
  );
}
