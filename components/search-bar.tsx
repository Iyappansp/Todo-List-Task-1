"use client"

import { Input } from "@/components/ui/input"
import { useEffect, useRef, useState } from "react"
import { useTodos } from "@/hooks/use-todos"

export function SearchBar() {
  const { setSearch } = useTodos()
  const [val, setVal] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setSearch(val), 300)
    return () => clearTimeout(t)
  }, [val, setSearch])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC")
      if (((e.ctrlKey && !isMac) || (e.metaKey && isMac)) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  return (
    <div className="w-full">
      <Input
        ref={inputRef}
        placeholder="Search (Ctrl+K)…"
        className="input-like"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        aria-label="Search todos"
      />
    </div>
  )
}
