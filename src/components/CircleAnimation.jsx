import React from "react"  
import { motion } from "framer-motion";

export default function CircleAnimation({ progress, duration }) {
  // progress va da 0 (inizio domanda) a 1 (tempo scaduto)
  // Per svuotare il cerchio, inverti la progressione: 1 - progress
  return (
    <motion.svg width="300" height="300" viewBox="0 0 300 300" >
      <motion.circle
        cx="60"
        cy="60"
        r="50"
        stroke= "#d7cbf7"
        style={{
          strokeWidth: 12, // linea più spessa
          strokeLinecap: "round",
          fill: "transparent",
        }}
        transform= "rotate(-90 60 60)"
        initial={false}
        animate={{ pathLength: 1 - progress }}
        transition={{ duration: 0.2 }}
        
      />
    </motion.svg>
  );
}
