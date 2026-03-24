"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
export function FadeIn({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{opacity:0,y:10,filter:"blur(10px)"}} animate={{opacity:1,y:0,filter:"blur(0px)"}} transition={{duration:.35,ease:"easeOut"}}>
      {children}
    </motion.div>
  );
}
