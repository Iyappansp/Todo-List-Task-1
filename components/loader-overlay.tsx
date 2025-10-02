"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Simple global pub/sub to toggle the loader from anywhere
const listeners = new Set<(v: boolean) => void>()

export function setGlobalLoading(v: boolean) {
  listeners.forEach((fn) => fn(v))
}

export default function LoaderOverlay() {
  const [visible, setVisible] = useState(true)

  // Initial mount loader (brief)
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 700)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const onToggle = (v: boolean) => setVisible(v)
    listeners.add(onToggle)
    return () => {
      listeners.delete(onToggle)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] grid place-items-center bg-black/20 backdrop-blur-sm"
        >
          <motion.svg
            width="64"
            height="64"
            viewBox="0 0 50 50"
            className="animate-spin-ease text-purple-500"
          >
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              className="loader-stroke"
            />
          </motion.svg>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
