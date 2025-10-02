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
import DatePicker from "@/components/date-picker"

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
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
            <div className="sm:col-span-2">
              <Label htmlFor="title" className="sr-only">
                Title
              </Label>
              <Input
                id="title"
                placeholder="What needs to be done?"
                className="h-10 rounded-lg px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/60 focus:border-primary transition"
                {...form.register("title")}
                aria-invalid={!!form.formState.errors.title}
              />
              {form.formState.errors.title && (
                <p className="text-destructive text-sm mt-1">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="sm:col-span-1">
              <Select onValueChange={(v) => form.setValue("category", v as any)} value={form.watch("category") || ""}>
                <SelectTrigger
                  aria-label="Category"
                  className="h-10 rounded-lg px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/60 focus:border-primary transition"
                >
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

            <div className="sm:col-span-1">
              <Select onValueChange={(v) => form.setValue("priority", v as any)} value={form.watch("priority") || ""}>
                <SelectTrigger
                  aria-label="Priority"
                  className="h-10 rounded-lg px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/60 focus:border-primary transition"
                >
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-1">
              <DatePicker
                value={form.watch("dueDate") || null}
                onChange={(iso) => form.setValue("dueDate", iso ?? "")}
              />
            </div>
            <div className="sm:col-span-4 flex items-center gap-2">
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
