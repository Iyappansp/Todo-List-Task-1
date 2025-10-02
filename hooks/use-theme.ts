"use client"

import { create } from "zustand"

type Theme = "light" | "dark"

type ThemeState = {
  theme: Theme
  toggle: () => void
  set: (t: Theme) => void
}

const STORAGE_KEY = "ai-todo-theme"

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light"
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === "dark" || stored === "light") return stored
  // prefer system but default to light for simplicity
  return "light"
}

export const useTheme = create<ThemeState>((set, get) => ({
  theme: getInitialTheme(),
  toggle: () => {
    const next = get().theme === "dark" ? "light" : "dark"
    window.localStorage.setItem(STORAGE_KEY, next)
    set({ theme: next })
  },
  set: (t) => {
    window.localStorage.setItem(STORAGE_KEY, t)
    set({ theme: t })
  },
}))
