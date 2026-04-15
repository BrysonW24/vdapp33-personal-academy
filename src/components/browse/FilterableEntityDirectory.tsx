"use client"

import { useMemo, useState } from "react"
import { EntityCard } from "@/components/entities/EntityCard"
import { HighLevelFilterRail } from "@/components/browse/HighLevelFilterRail"
import {
  getBrowseBucketMeta,
  type BrowseBucket,
} from "@/components/browse/browse-catalog"
import {
  HIGH_LEVEL_FILTERS,
  matchesHighLevelFilter,
  type HighLevelFilter,
} from "@/lib/high-level-filters"
import type { SubjectManifest } from "@/types/curriculum"
import type { EntityManifest } from "@/types/entity"

type DirectoryEntry = {
  bucket: BrowseBucket
  href: string
  statLine: string
  entity: SubjectManifest | EntityManifest
}

interface FilterableEntityDirectoryProps {
  eyebrow: string
  title: string
  description: string
  entries: DirectoryEntry[]
}

export function FilterableEntityDirectory({
  eyebrow,
  title,
  description,
  entries,
}: FilterableEntityDirectoryProps) {
  const [selectedFilter, setSelectedFilter] = useState<HighLevelFilter>("all")

  const filteredEntries = useMemo(
    () =>
      entries.filter((entry) =>
        matchesHighLevelFilter(entry.bucket, selectedFilter)
      ),
    [entries, selectedFilter]
  )

  const groupedEntries = useMemo(
    () =>
      filteredEntries.reduce<Record<string, DirectoryEntry[]>>((acc, entry) => {
        if (!acc[entry.bucket]) acc[entry.bucket] = []
        acc[entry.bucket].push(entry)
        return acc
      }, {}),
    [filteredEntries]
  )

  const orderedBuckets = useMemo(
    () =>
      (Object.keys(groupedEntries) as BrowseBucket[]).sort(
        (left, right) =>
          entries.findIndex((entry) => entry.bucket === left) -
          entries.findIndex((entry) => entry.bucket === right)
      ),
    [entries, groupedEntries]
  )

  const selectedMeta =
    HIGH_LEVEL_FILTERS.find((filter) => filter.value === selectedFilter) ??
    HIGH_LEVEL_FILTERS[0]

  return (
    <div className="container mx-auto space-y-6 px-4 py-6 sm:space-y-8 sm:py-8">
      <section className="rounded-[24px] border border-[rgba(44,49,59,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(250,246,239,0.95))] p-5 shadow-editorial-soft sm:rounded-[30px] sm:p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
          {eyebrow}
        </p>
        <h1 className="mt-2 font-serif text-[2.3rem] font-semibold leading-tight text-editorial-ink sm:text-5xl">
          {title}
        </h1>
        <p className="mt-3 max-w-3xl text-[15px] leading-[1.65] text-editorial-muted sm:mt-4 sm:text-lg sm:leading-relaxed">
          {description}
        </p>

        <div className="mt-5 space-y-3">
          <HighLevelFilterRail
            selected={selectedFilter}
            onChange={setSelectedFilter}
          />
          <p className="text-sm leading-relaxed text-editorial-muted">
            {selectedMeta.description}
          </p>
        </div>
      </section>

      {orderedBuckets.map((bucket) => {
        const bucketMeta = getBrowseBucketMeta(bucket)

        return (
          <section key={bucket} className="space-y-3 sm:space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
                {bucketMeta.label}
              </p>
              <h2 className="mt-2 font-serif text-[2rem] font-semibold leading-tight text-editorial-ink sm:text-3xl">
                {bucketMeta.label} {title.toLowerCase()}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-editorial-muted sm:text-base">
                {bucketMeta.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
              {groupedEntries[bucket].map((entry) => (
                <EntityCard
                  key={entry.entity.slug}
                  entity={entry.entity}
                  href={entry.href}
                  statLine={entry.statLine}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
