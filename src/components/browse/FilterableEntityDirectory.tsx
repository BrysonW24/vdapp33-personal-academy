"use client"

import { useMemo, useState } from "react"
import { EntityCard } from "@/components/entities/EntityCard"
import { CollapsibleSection } from "@/components/browse/CollapsibleSection"
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
    <div className="container mx-auto space-y-3 px-4 py-5 sm:space-y-4">
      <section className="rounded-[18px] border border-[rgba(44,49,59,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(250,246,239,0.95))] p-4 shadow-editorial-soft sm:rounded-[22px] sm:p-6">
        <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
          {eyebrow}
        </p>
        <h1 className="mt-1 font-serif text-2xl font-semibold leading-tight text-editorial-ink sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-[1.6] text-editorial-muted">
          {description}
        </p>

        <div className="mt-4 space-y-2">
          <HighLevelFilterRail
            selected={selectedFilter}
            onChange={setSelectedFilter}
          />
          <p className="text-[13px] leading-relaxed text-editorial-muted">
            {selectedMeta.description}
          </p>
        </div>
      </section>

      <div className="space-y-2.5">
        {orderedBuckets.map((bucket) => {
          const bucketMeta = getBrowseBucketMeta(bucket)

          return (
            <CollapsibleSection
              key={bucket}
              title={bucketMeta.label}
              count={groupedEntries[bucket].length}
              description={bucketMeta.description}
            >
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
            </CollapsibleSection>
          )
        })}
      </div>
    </div>
  )
}
