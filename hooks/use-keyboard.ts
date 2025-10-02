"use client"

import { useEffect } from "react"

type Handlers = {
  onNew?: () => void // Ctrl+N
  onToggleTheme?: () => void // Ctrl+D
  onFocusSearch?: () => void // Ctrl+K
  onOpenAI?: () => void // Ctrl+P
}

export function useKeyboardShortcuts(handlers: Handlers) {
  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if (!e.ctrlKey) return
      const key = e.key.toLowerCase()
      if (key === "n" && handlers.onNew) {
        e.preventDefault()
        handlers.onNew()
      } else if (key === "d" && handlers.onToggleTheme) {
        e.preventDefault()
        handlers.onToggleTheme()
      } else if (key === "k" && handlers.onFocusSearch) {
        e.preventDefault()
        handlers.onFocusSearch()
      } else if (key === "p" && handlers.onOpenAI) {
        e.preventDefault()
        handlers.onOpenAI()
      }
    }
    window.addEventListener("keydown", onKeydown)
    return () => window.removeEventListener("keydown", onKeydown)
  }, [handlers])
}
