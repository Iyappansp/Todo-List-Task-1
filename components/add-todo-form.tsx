"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useTodos, type Priority, type Category } from "@/hooks/use-todos"

import { motion } from "framer-motion"
import { Calendar as CalendarIcon } from "lucide-react"

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.enum(["work", "personal", "health", "learning", "misc"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  dueDate: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function AddTodoForm() {
  const { add } = useTodos()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", category: undefined, priority: "medium", dueDate: "" },
  })

  const onSubmit = (values: FormValues) => {
    add({
      title: values.title,
      category: values.category as Category | undefined,
      priority: values.priority as Priority | undefined,
      dueDate: values.dueDate ? values.dueDate : null,
    })
    form.reset({ title: "", category: undefined, priority: "medium", dueDate: "" })
  }
 
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <Card className="glass-card">
        <CardContent className="p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3 md:grid-cols-5">
            <div className="md:col-span-2">
              <Label htmlFor="title" className="sr-only">
                Title
              </Label>
              <Input
                id="title"
                placeholder="What needs to be done?"
                className="input-like"
                {...form.register("title")}
                aria-invalid={!!form.formState.errors.title}
              />
              {form.formState.errors.title && (
                <p className="text-destructive text-sm mt-1">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div>
              <Select onValueChange={(v) => form.setValue("category", v as any)} value={form.watch("category") || ""}>
                <SelectTrigger aria-label="Category" className="input-like px-3 py-2 h-auto">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="learning">Learning</SelectItem>
                  <SelectItem value="misc">Misc</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select onValueChange={(v) => form.setValue("priority", v as any)} value={form.watch("priority") || ""}>
                <SelectTrigger aria-label="Priority" className="input-like px-3 py-2 h-auto">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative">
              <Input
                type="date"
                className="input-like pr-16 md:pr-20"
                {...form.register("dueDate")}
                aria-label="Due date"
              />
              {/* Visible calendar glyph on desktop */}
              <CalendarIcon
                aria-hidden="true"
                className="hidden md:block pointer-events-none absolute right-4 md:right-5 top-1/2 -translate-y-1/2 size-5 md:size-6 text-gray-600 dark:text-gray-300 z-10"
              />
            </div>
            <div className="md:col-span-5 flex items-center gap-2">
              <Button type="submit" className="btn">
                Add
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
