"use client"

import { HIGH_LEVEL_FILTERS, type HighLevelFilter } from "@/lib/high-level-filters"
import { cn } from "@/lib/utils"

interface HighLevelFilterRailProps {
  selected: HighLevelFilter
  onChange: (value: HighLevelFilter) => void
  className?: string
}

export function HighLevelFilterRail({
  selected,
  onChange,
  className,
}: HighLevelFilterRailProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {HIGH_LEVEL_FILTERS.map((filter) => (
        <button
          key={filter.value}
          type="button"
          onClick={() => onChange(filter.value)}
          className={cn(
            "rounded-full border px-3 py-2 text-[11px] font-medium uppercase tracking-[0.16em] transition-all duration-200 sm:px-4 sm:text-xs",
            selected === filter.value
              ? "border-editorial-ink/12 bg-editorial-green text-white shadow-sm"
              : "border-[rgba(44,49,59,0.12)] bg-white/92 text-editorial-muted hover:border-[rgba(44,49,59,0.2)] hover:bg-white hover:text-editorial-ink"
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
