"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTodos } from "@/hooks/use-todos"

export function CategoryFilter() {
  const { category, setCategory } = useTodos()
  return (
    <Select value={category || "all"} onValueChange={(v) => setCategory(v as any)}>
      <SelectTrigger aria-label="Filter by category" className="input-like px-3 py-2 h-auto w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="work">Work</SelectItem>
        <SelectItem value="personal">Personal</SelectItem>
        <SelectItem value="health">Health</SelectItem>
        <SelectItem value="learning">Learning</SelectItem>
        <SelectItem value="misc">Misc</SelectItem>
      </SelectContent>
    </Select>
  )
}
