"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowRight } from "lucide-react"
import {
  BROWSE_KIND_LABELS,
  getBrowseBucketMeta,
  type BrowseBucketGroup,
  type BrowseItem,
} from "@/components/browse/browse-catalog"
import { BrowseEntityIcon } from "@/components/browse/BrowseEntityIcon"
import { HighLevelFilterRail } from "@/components/browse/HighLevelFilterRail"
import {
  HIGH_LEVEL_FILTERS,
  matchesHighLevelFilter,
  type HighLevelFilter,
} from "@/lib/high-level-filters"

function interleaveSpotlightItems(groups: BrowseBucketGroup[]) {
  const slices = groups.map((group) => [...group.items])
  const result: BrowseItem[] = []

  for (let round = 0; round < 3; round += 1) {
    slices.forEach((slice) => {
      const item = slice[round]
      if (item) result.push(item)
    })
  }

  return result.slice(0, 8)
}

export function HomeDomainSpotlight({ groups }: { groups: BrowseBucketGroup[] }) {
  const [selectedFilter, setSelectedFilter] = useState<HighLevelFilter>("all")

  const filteredItems = useMemo(
    () => {
      if (selectedFilter === "all") {
        return interleaveSpotlightItems(groups)
      }

      return groups
        .flatMap((group) => group.items)
        .filter((item) => matchesHighLevelFilter(item.bucket, selectedFilter))
        .slice(0, 8)
    },
    [groups, selectedFilter]
  )

  const selectedMeta =
    HIGH_LEVEL_FILTERS.find((filter) => filter.value === selectedFilter) ??
    HIGH_LEVEL_FILTERS[0]

  const counts = filteredItems.reduce(
    (acc, item) => {
      if (item.kind === "subject") acc.subjects += 1
      if (item.kind === "topic") acc.topics += 1
      if (item.kind === "role") acc.roles += 1
      return acc
    },
    { subjects: 0, topics: 0, roles: 0 }
  )

  return (
    <section className="rounded-[24px] border border-[rgba(44,49,59,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(250,246,239,0.95))] p-5 shadow-editorial-soft sm:rounded-[30px] sm:p-7">
      <div className="flex flex-col gap-5">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
            Explore by domain
          </p>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="font-serif text-[2rem] font-semibold leading-tight text-editorial-ink sm:text-[2.35rem]">
                One map, many ways in
              </h2>
              <p className="mt-2 max-w-3xl text-[15px] leading-[1.65] text-editorial-muted sm:text-base">
                Use a high-level lens first when you want the shape of the world,
                then drop into subjects, topics, and roles without losing the
                surrounding map.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-editorial-muted">
              <span className="rounded-full border border-[rgba(44,49,59,0.1)] bg-white/92 px-3 py-2">
                {counts.subjects} subjects
              </span>
              <span className="rounded-full border border-[rgba(44,49,59,0.1)] bg-white/92 px-3 py-2">
                {counts.topics} topics
              </span>
              <span className="rounded-full border border-[rgba(44,49,59,0.1)] bg-white/92 px-3 py-2">
                {counts.roles} roles
              </span>
            </div>
          </div>
        </div>

        <HighLevelFilterRail
          selected={selectedFilter}
          onChange={setSelectedFilter}
        />

        <div className="rounded-[22px] border border-[rgba(44,49,59,0.1)] bg-white/88 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                {selectedMeta.label}
              </p>
              <h3 className="mt-2 font-serif text-[1.7rem] font-semibold leading-tight text-editorial-ink sm:text-[2rem]">
                {selectedFilter === "all"
                  ? "The full Nexus surface"
                  : `${selectedMeta.label} in focus`}
              </h3>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-editorial-muted sm:text-base">
                {selectedMeta.description}
              </p>
            </div>
            {selectedFilter !== "all" && filteredItems[0] ? (
              <Link
                href={filteredItems[0].href}
                className="inline-flex items-center gap-2 text-sm font-medium text-editorial-blue transition-colors hover:text-editorial-green"
              >
                Jump into {getBrowseBucketMeta(filteredItems[0].bucket).label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.slice(0, 8).map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="group rounded-[18px] border border-[rgba(44,49,59,0.1)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(250,246,239,0.94))] p-3.5 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-editorial-soft sm:p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-[rgba(44,49,59,0.08)] bg-white/88 text-[1.1rem] shadow-sm"
                      aria-hidden="true"
                    >
                      {item.emoji ?? "🗺️"}
                    </span>
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-[14px]"
                      style={{
                        backgroundColor: `${item.accentColor}18`,
                        color: item.accentColor,
                      }}
                    >
                      <BrowseEntityIcon iconName={item.icon} className="h-4.5 w-4.5" />
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-editorial-muted transition-transform duration-200 group-hover:translate-x-0.5" />
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="rounded-full border border-[rgba(44,49,59,0.1)] bg-white/92 px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-editorial-muted">
                    {BROWSE_KIND_LABELS[item.kind]}
                  </span>
                  <span className="rounded-full border border-[rgba(44,49,59,0.1)] bg-white/92 px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-editorial-muted">
                    {getBrowseBucketMeta(item.bucket).label}
                  </span>
                </div>

                <h4 className="mt-3 font-serif text-[1.15rem] font-semibold leading-tight text-editorial-ink sm:text-[1.3rem]">
                  {item.title}
                </h4>
                <p className="mt-2 text-[13px] leading-[1.55] text-editorial-muted sm:text-sm">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
