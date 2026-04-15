"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowRight } from "lucide-react"
import {
  BROWSE_KIND_LABELS,
  BROWSE_TIER_LABELS,
  type BrowseBucketGroup,
  type BrowseTier,
} from "@/components/browse/browse-catalog"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const TIER_FILTERS: Array<{ value: BrowseTier | "all"; label: string }> = [
  { value: "all", label: "All tiers" },
  { value: "foundational", label: "Foundational" },
  { value: "advanced", label: "Advanced" },
  { value: "thought-provoking", label: "Thought-provoking" },
  { value: "frontier", label: "Frontier" },
]

export function MacroBucketExplorer({
  groups,
  className,
}: {
  groups: BrowseBucketGroup[]
  className?: string
}) {
  const [selectedTier, setSelectedTier] = useState<BrowseTier | "all">("all")

  const filteredGroups = useMemo(
    () =>
      groups
        .map((group) => ({
          ...group,
          items:
            selectedTier === "all"
              ? group.items
              : group.items.filter((item) => item.tier === selectedTier),
        }))
        .filter((group) => group.items.length > 0),
    [groups, selectedTier]
  )

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-wrap gap-2">
        {TIER_FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setSelectedTier(filter.value)}
            className={cn(
              "rounded-full border px-3 py-2 text-xs uppercase tracking-[0.16em] transition-all duration-200",
              selectedTier === filter.value
                ? "border-[rgba(44,49,59,0.14)] bg-editorial-green text-white shadow-sm"
                : "border-[rgba(44,49,59,0.08)] bg-white/74 text-editorial-muted hover:bg-white hover:text-editorial-ink"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {filteredGroups.map((group) => (
          <section
            key={group.bucket}
            className="rounded-[30px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.78)] p-5 shadow-editorial-soft sm:p-6"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                  {group.label}
                </p>
                <h3 className="mt-2 font-serif text-2xl font-semibold text-editorial-ink sm:text-3xl">
                  {group.label} in one pass
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-editorial-muted sm:text-base">
                  {group.description}
                </p>
              </div>
              <Badge variant="secondary" className="w-fit">
                {group.items.length} featured surfaces
              </Badge>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
              {group.items.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="group flex h-full flex-col justify-between rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-white/82 p-4 transition-all duration-200 hover:-translate-y-[1px] hover:bg-white hover:shadow-editorial-soft"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-[rgba(44,49,59,0.08)] bg-white/90 text-[1.15rem] shadow-sm"
                        aria-hidden="true"
                      >
                        {item.emoji ?? "🗺️"}
                      </span>
                      <ArrowRight className="h-4 w-4 text-editorial-muted transition-transform duration-200 group-hover:translate-x-0.5" />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-[10px]">
                        {BROWSE_KIND_LABELS[item.kind]}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px]">
                        {BROWSE_TIER_LABELS[item.tier]}
                      </Badge>
                    </div>

                    <h4 className="mt-4 font-serif text-2xl font-semibold text-editorial-ink">
                      {item.title}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-editorial-muted">
                      {item.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
