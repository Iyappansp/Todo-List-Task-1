"use client"

import { useTodos } from "@/hooks/use-todos"
import { TodoItem } from "./todo-item"
import { Card, CardContent } from "@/components/ui/card"
import { AnimatePresence, motion } from "framer-motion"

export function TodoList() {
  const { filtered } = useTodos()
  return (
    <Card className="glass-card">
      <CardContent className="p-4">
        {filtered.length === 0 ? (
          <p className="text-muted-foreground">No todos match your filters.</p>
        ) : (
          <motion.div
            className="grid gap-2"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
          >
            <AnimatePresence initial={false}>
              {filtered.map((t) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <TodoItem todo={t} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
