"use client"

import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

export function Footer() {
  return (
    <footer className="glass-card mt-10 p-6 text-center">
      <p className="text-sm text-pretty">
        Built by iyaps • GitHub: https://github.com/iyaps/your-repo • PWA Ready • Accessible
      </p>
      <motion.div
        className="mt-3 flex items-center justify-center gap-2"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
      >
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
          <Badge variant="secondary">PWA</Badge>
        </motion.div>
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.05 }}>
          <Badge variant="secondary">A11y</Badge>
        </motion.div>
      </motion.div>
    </footer>
  )
}
