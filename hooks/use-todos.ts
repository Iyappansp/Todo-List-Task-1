"use client"

import { create } from "zustand"
import { nanoid } from "nanoid"
import { useEffect, useMemo } from "react"

export type Priority = "low" | "medium" | "high"
export type Category = "work" | "personal" | "health" | "learning" | "misc"

export type Todo = {
  id: string
  title: string
  completed: boolean
  category?: Category
  priority?: Priority
  dueDate?: string | null
  createdAt: number
  updatedAt: number
}

type FilterMode = "all" | "active" | "completed"

type TodoState = {
  todos: Todo[]
  selectedIds: Set<string>
  search: string
  filter: FilterMode
  category?: Category | "all"
  // actions
  add: (t: Omit<Todo, "id" | "createdAt" | "updatedAt" | "completed">) => void
  edit: (id: string, patch: Partial<Todo>) => void
  remove: (id: string) => void
  toggle: (id: string) => void
  clearCompleted: () => void
  setSearch: (q: string) => void
  setFilter: (f: FilterMode) => void
  setCategory: (c?: Category | "all") => void
  select: (id: string, on: boolean) => void
  selectAll: (ids: string[]) => void
  clearSelection: () => void
  bulkComplete: () => void
  bulkDelete: () => void
}

const STORAGE_KEY = "ai-todos"

const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  selectedIds: new Set(),
  search: "",
  filter: "all",
  category: "all",
  add: (t) =>
    set((s) => ({
      todos: [
        {
          id: nanoid(),
          completed: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          ...t,
        },
        ...s.todos,
      ],
    })),
  edit: (id, patch) =>
    set((s) => ({
      todos: s.todos.map((todo) => (todo.id === id ? { ...todo, ...patch, updatedAt: Date.now() } : todo)),
    })),
  remove: (id) => set((s) => ({ todos: s.todos.filter((t) => t.id !== id) })),
  toggle: (id) =>
    set((s) => ({
      todos: s.todos.map((t) => (t.id === id ? { ...t, completed: !t.completed, updatedAt: Date.now() } : t)),
    })),
  clearCompleted: () => set((s) => ({ todos: s.todos.filter((t) => !t.completed) })),
  setSearch: (q) => set({ search: q }),
  setFilter: (f) => set({ filter: f }),
  setCategory: (c) => set({ category: c }),
  select: (id, on) =>
    set((s) => {
      const next = new Set(s.selectedIds)
      if (on) next.add(id)
      else next.delete(id)
      return { selectedIds: next }
    }),
  selectAll: (ids) => set({ selectedIds: new Set(ids) }),
  clearSelection: () => set({ selectedIds: new Set() }),
  bulkComplete: () =>
    set((s) => {
      const ids = s.selectedIds
      return {
        todos: s.todos.map((t) => (ids.has(t.id) ? { ...t, completed: true } : t)),
        selectedIds: new Set(),
      }
    }),
  bulkDelete: () =>
    set((s) => {
      const ids = s.selectedIds
      return {
        todos: s.todos.filter((t) => !ids.has(t.id)),
        selectedIds: new Set(),
      }
    }),
}))

export function useTodos() {
  const state = useTodoStore()
  // persistence
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Todo[]
        if (Array.isArray(parsed)) {
          // initialize once
          useTodoStore.setState({ todos: parsed })
        }
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos))
    } catch {}
  }, [state.todos])

  const filtered = useMemo(() => {
    const q = state.search.trim().toLowerCase()
    return state.todos.filter((t) => {
      if (state.filter === "active" && t.completed) return false
      if (state.filter === "completed" && !t.completed) return false
      if (state.category && state.category !== "all" && t.category !== state.category) return false
      if (!q) return true
      return (
        t.title.toLowerCase().includes(q) ||
        (t.category || "").toLowerCase().includes(q) ||
        (t.priority || "").toLowerCase().includes(q)
      )
    })
  }, [state.todos, state.filter, state.category, state.search])

  const ids = useMemo(() => filtered.map((t) => t.id), [filtered])

  return { ...state, filtered, ids }
}
