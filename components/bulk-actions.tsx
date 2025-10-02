"use client"

import { Button } from "@/components/ui/button"
import { useTodos } from "@/hooks/use-todos"

export function BulkActions() {
  const { ids, selectedIds, selectAll, clearSelection, bulkComplete, bulkDelete } = useTodos()
  const selectedCount = selectedIds.size
  if (ids.length === 0) return null

  return (
    <div className="flex items-center justify-between bg-secondary/60 border border-border rounded-md p-2">
      <p className="text-sm text-muted-foreground">
        {selectedCount > 0 ? `${selectedCount} selected` : "Select items for bulk actions"}
      </p>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => selectAll(ids)}>
          Select All
        </Button>
        <Button variant="ghost" onClick={() => clearSelection()}>
          Clear
        </Button>
        <Button variant="default" onClick={() => bulkComplete()} disabled={selectedCount === 0}>
          Mark Complete
        </Button>
        <Button variant="destructive" onClick={() => bulkDelete()} disabled={selectedCount === 0}>
          Delete
        </Button>
      </div>
    </div>
  )
}
