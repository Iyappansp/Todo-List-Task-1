"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DatePicker from "@/components/date-picker"
import { useTodos, type Todo } from "@/hooks/use-todos"
import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Controller, useForm } from "react-hook-form"
import { format, isValid, parseISO } from "date-fns"

const categories = ["work", "personal", "health", "learning", "misc"] as const
const priorities = ["low", "medium", "high"] as const

type FormValues = {
  title: string
  category: (typeof categories)[number]
  priority: (typeof priorities)[number]
  dueDate: string | null
}

export function TodoItem({ todo }: { todo: Todo }) {
  const { toggle, remove, edit, select, selectedIds } = useTodos()
  const [editing, setEditing] = useState(false)
  const [flash, setFlash] = useState(false)

  const selected = selectedIds.has(todo.id)
  const priorityNow = todo.priority || "medium"
  const priorityColor =
    priorityNow === "high" ? "bg-red-500" : priorityNow === "medium" ? "bg-amber-500" : "bg-emerald-500"

  const defaultValues = useMemo<FormValues>(
    () => ({
      title: todo.title,
      category: (todo.category ?? "misc") as FormValues["category"],
      priority: (todo.priority ?? "medium") as FormValues["priority"],
      dueDate: todo.dueDate ? (todo.dueDate.length > 10 ? todo.dueDate.slice(0, 10) : todo.dueDate) : null,
    }),
    [todo.title, todo.category, todo.priority, todo.dueDate],
  )

  const { register, control, handleSubmit, reset } = useForm<FormValues>({ defaultValues })

  const onSubmit = (values: FormValues) => {
    const title = values.title.trim()
    if (!title) return
    if (values.dueDate && !isValid(parseISO(values.dueDate))) return

    edit(todo.id, {
      title,
      category: values.category,
      priority: values.priority,
      dueDate: values.dueDate || null,
    })
    setEditing(false)
    setFlash(true)
    setTimeout(() => setFlash(false), 700)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -6 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card
        className={`glass-card hover:shadow-xl hover:scale-105 transition-transform duration-200 ${
          flash ? "ring-2 ring-primary/50" : ""
        }`}
      >
        <CardContent className="p-6 flex items-center gap-3">
          <Checkbox checked={selected} onCheckedChange={(v) => select(todo.id, !!v)} aria-label="Select todo" />
          <Checkbox checked={todo.completed} onCheckedChange={() => toggle(todo.id)} aria-label="Toggle complete" />

          <div className="flex-1">
            <AnimatePresence mode="wait" initial={false}>
              {editing ? (
                <motion.form
                  key="edit"
                  onSubmit={handleSubmit(onSubmit)}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center"
                >
                  <div className="md:col-span-2">
                    <Input
                      aria-label="Title"
                      placeholder="Edit title"
                      className="h-10 rounded-lg px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/60 focus:border-primary transition"
                      {...register("title", { required: true })}
                    />
                  </div>

                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger
                          aria-label="Category"
                          className="h-10 rounded-lg px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/60 focus:border-primary transition"
                        >
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  <Controller
                    name="priority"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger
                          aria-label="Priority"
                          className="h-10 rounded-lg px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/60 focus:border-primary transition"
                        >
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          {priorities.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  <Controller
                    name="dueDate"
                    control={control}
                    rules={{ validate: (v) => !v || isValid(parseISO(v)) || "Invalid date" }}
                    render={({ field }) => <DatePicker value={field.value} onChange={(iso) => field.onChange(iso)} />}
                  />
                </motion.form>
              ) : (
                <motion.div
                  key="view"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.18 }}
                  className="text-pretty"
                >
                  <p className={todo.completed ? "line-through text-muted-foreground" : ""}>{todo.title}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="uppercase">{todo.category || "misc"}</span>
                    <span>•</span>
                    <span className="group inline-flex items-center rounded-full bg-gray-200 dark:bg-gray-700 px-2 py-0.5 overflow-hidden hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors duration-200">
                      <span className={`size-1.5 rounded-full ${priorityColor}`} />
                      <span className="transition-all duration-200 w-0 opacity-0 group-hover:w-auto group-hover:opacity-100 pl-1">
                        {priorityNow}
                      </span>
                    </span>
                    {todo.dueDate && (
                      <span>
                        • due {isValid(parseISO(todo.dueDate)) ? format(parseISO(todo.dueDate), "dd-MM-yyyy") : new Date(todo.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-2">
            {editing ? (
              <>
                <Button variant="ghost" onClick={handleSubmit(onSubmit)}>
                  Save
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    reset(defaultValues)
                    setEditing(false)
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button variant="secondary" onClick={() => setEditing(true)} aria-pressed={editing}>
                Edit
              </Button>
            )}
            <Button variant="destructive" onClick={() => remove(todo.id)}>
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
