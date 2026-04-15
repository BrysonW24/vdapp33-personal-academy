import type { MacroBucket } from "@/types/curriculum"

export type HighLevelFilter =
  | "all"
  | "science"
  | "technology"
  | "society"
  | "business"
  | "human"
  | "culture"
  | "future"

export const HIGH_LEVEL_FILTERS: Array<{
  value: HighLevelFilter
  label: string
  buckets: MacroBucket[]
  description: string
}> = [
  {
    value: "all",
    label: "All",
    buckets: [],
    description: "See the full Nexus map.",
  },
  {
    value: "science",
    label: "Science",
    buckets: ["reality"],
    description: "Foundations of reality, matter, life, and the natural world.",
  },
  {
    value: "technology",
    label: "Technology",
    buckets: ["built-world"],
    description: "Systems, infrastructure, software, engineering, and the built stack.",
  },
  {
    value: "society",
    label: "Society",
    buckets: ["civilization"],
    description: "Institutions, power, law, history, and collective coordination.",
  },
  {
    value: "business",
    label: "Business",
    buckets: ["markets-assets"],
    description: "Markets, assets, finance, logistics, and commercial systems.",
  },
  {
    value: "human",
    label: "Human",
    buckets: ["human-being"],
    description: "Mind, health, behavior, relationships, and lived human reality.",
  },
  {
    value: "culture",
    label: "Culture",
    buckets: ["meaning-culture"],
    description: "Meaning, communication, history, belief, and cultural production.",
  },
  {
    value: "future",
    label: "Future",
    buckets: ["frontier"],
    description: "Frontier systems, big questions, and where the world may be going.",
  },
]

export function getBucketsForHighLevelFilter(value: HighLevelFilter) {
  return HIGH_LEVEL_FILTERS.find((filter) => filter.value === value)?.buckets ?? []
}

export function matchesHighLevelFilter(
  bucket: MacroBucket | undefined,
  filter: HighLevelFilter
) {
  if (filter === "all") return true
  if (!bucket) return false

  return getBucketsForHighLevelFilter(filter).includes(bucket)
}
