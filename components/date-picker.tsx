"use client"

import { useMemo } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon } from "lucide-react"
import { format, parse, isValid } from "date-fns"
import { cn } from "@/lib/utils"

export type DatePickerProps = {
  value: string | null | undefined
  onChange: (iso: string | null) => void
  className?: string
  placeholder?: string
}

export default function DatePicker({ value, onChange, className, placeholder = "dd-mm-yyyy" }: DatePickerProps) {
  const date: Date | undefined = useMemo(() => {
    if (!value) return undefined
    const d = parse(value, "yyyy-MM-dd", new Date())
    return isValid(d) ? d : undefined
  }, [value])

  const formatted = useMemo(() => (date ? format(date, "dd-MM-yyyy") : null), [date])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "w-44 h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm flex items-center justify-between gap-2 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary transition",
            className,
          )}
        >
          <span className={cn(!formatted && "text-muted-foreground")}>{formatted ?? placeholder}</span>
          <CalendarIcon className="size-4 opacity-70" aria-hidden="true" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="min-w-[280px] p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl"
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => onChange(d ? format(d, "yyyy-MM-dd") : null)}
          initialFocus
          className=""
          // Ensure cell size regardless of default class ordering
          style={{ ['--cell-size' as any]: '36px' }}
        />
      </PopoverContent>
    </Popover>
  )
}
