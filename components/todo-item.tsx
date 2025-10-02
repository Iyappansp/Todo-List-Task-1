"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTodos, type Todo } from "@/hooks/use-todos"
import { useState } from "react"
import { motion } from "framer-motion"

export function TodoItem({ todo }: { todo: Todo }) {
  const { toggle, remove, edit, select, selectedIds } = useTodos()
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(todo.title)
  const p = todo.priority || "medium"
  const priorityColor = p === "high" ? "bg-red-500" : p === "medium" ? "bg-amber-500" : "bg-emerald-500"

  const save = () => {
    if (title.trim() && title !== todo.title) edit(todo.id, { title })
    setEditing(false)
  }

  const selected = selectedIds.has(todo.id)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -6 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card className="glass-card">
        <CardContent className="p-6 flex items-center gap-3">
          <Checkbox checked={selected} onCheckedChange={(v) => select(todo.id, !!v)} aria-label="Select todo" />
          <Checkbox checked={todo.completed} onCheckedChange={() => toggle(todo.id)} aria-label="Toggle complete" />
          <div className="flex-1">
            {editing ? (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={save}
                onKeyDown={(e) => e.key === "Enter" && save()}
                aria-label="Edit title"
                autoFocus
                className="input-like"
              />
            ) : (
              <div className="text-pretty">
                <p className={todo.completed ? "line-through text-muted-foreground" : ""}>{todo.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="uppercase">{(todo.category || "misc")}</span>
                  <span>•</span>
                  <span className="group inline-flex items-center rounded-full bg-gray-200 dark:bg-gray-700 px-2 py-0.5 overflow-hidden">
                    <span className={`size-1.5 rounded-full ${priorityColor}`} />
                    <span className="transition-all duration-200 w-0 opacity-0 group-hover:w-auto group-hover:opacity-100 pl-1">
                      {p}
                    </span>
                  </span>
                  {todo.dueDate && <span>• due {new Date(todo.dueDate).toLocaleDateString()}</span>}
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setEditing((s) => !s)} aria-pressed={editing}>
              {editing ? "Save" : "Edit"}
            </Button>
            <Button variant="destructive" onClick={() => remove(todo.id)}>
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
