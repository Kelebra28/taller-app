"use client";
import { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Modal({ open, title, children, onClose, actions }:{
  open:boolean; title:string; children:React.ReactNode; onClose:()=>void; actions?:React.ReactNode;
}) {
  useEffect(()=>{
    function onKey(e:KeyboardEvent){ if(e.key==="Escape") onClose(); }
    if(open) window.addEventListener("keydown", onKey);
    return ()=>window.removeEventListener("keydown", onKey);
  },[open,onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          style={{position:"fixed",inset:0,background:"rgba(0,0,0,.72)",backdropFilter: "blur(8px)",display:"grid",placeItems:"center",zIndex:9999,padding:16}}
          onMouseDown={(e)=>{ if(e.target===e.currentTarget) onClose(); }}
        >
          <motion.div initial={{opacity:0,y:12,scale:.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:12,scale:.98}}
            transition={{duration:.18}} className="card" style={{
              width: "min(620px, 100%)",
              border: "1px solid rgba(255,255,255,.22)",
              background: "linear-gradient(180deg, rgba(20,20,28,.92), rgba(10,10,14,.88))",
              boxShadow: "0 30px 120px rgba(0,0,0,.85)",
              position: "relative",
            }}
          >
            <div className="cardHeader">
              <h2>{title}</h2>
              <button className="btn" onClick={onClose}><X size={16}/> Cerrar</button>
            </div>
            <div className="cardBody">{children}</div>
            {actions && <div className="cardBody" style={{paddingTop:0}}><div style={{display:"flex",gap:10,justifyContent:"flex-end",flexWrap:"wrap"}}>{actions}</div></div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
