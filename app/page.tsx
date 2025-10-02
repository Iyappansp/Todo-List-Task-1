"use client"

import { AddTodoForm } from "@/components/add-todo-form"
import { SearchBar } from "@/components/search-bar"
import { CategoryFilter } from "@/components/category-filter"
import { TodoList } from "@/components/todo-list"
import { BulkActions } from "@/components/bulk-actions"
import { TimerModal } from "@/components/timer-modal"
import { Footer } from "@/components/footer"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard"
import { useRef } from "react"
import { useTheme } from "@/hooks/use-theme"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useTodos } from "@/hooks/use-todos"
import { motion } from "framer-motion"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { Sun, Moon, Plus } from "lucide-react"

export default function HomePage() {
  const { toggle, theme } = useTheme()
  const searchRef = useRef<HTMLInputElement>(null)
  const { setFilter } = useTodos()

  useKeyboardShortcuts({
    onNew: () => document.getElementById("title")?.focus(),
    onToggleTheme: () => toggle(),
    onFocusSearch: () => searchRef.current?.focus(),
  })

  return (
    <motion.main
      className="container-app"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold mb-4 text-balance">Todo Task</h1>
        <div className="flex gap-2">
          <TimerModal />
          <Button variant="outline" onClick={() => toggle()} className="flex items-center gap-2">
            <motion.span
              initial={false}
              animate={{ rotate: theme === "dark" ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="inline-flex"
            >
              {theme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
            </motion.span>
            <span>Toggle-Theme</span>
          </Button>
        </div>
      </header>

      <div className="grid gap-4">
        <AddTodoForm />
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <SearchBar />
          </div>
          <div className="hidden md:block">
            <CategoryFilter />
          </div>
          <div className="md:hidden">
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline">Filters</Button>
              </DrawerTrigger>
              <DrawerContent className="p-4">
                <div className="mx-auto max-w-sm">
                  <CategoryFilter />
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
        <Tabs defaultValue="all" className="w-full" onValueChange={(v) => setFilter(v as any)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <TodoList />
          </TabsContent>
          <TabsContent value="active" className="mt-4">
            <TodoList />
          </TabsContent>
          <TabsContent value="completed" className="mt-4">
            <TodoList />
          </TabsContent>
        </Tabs>

        <BulkActions />
        <Footer />
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="fixed bottom-6 right-6 md:hidden"
      >
        <Button
          className="rounded-full shadow-lg"
          onClick={() => document.getElementById("title")?.focus()}
          aria-label="Add new todo"
        >
          <Plus className="size-5" />
        </Button>
      </motion.div>
    </motion.main>
  )
}

