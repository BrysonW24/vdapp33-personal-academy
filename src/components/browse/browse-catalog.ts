import type {
  AcademyTier,
  CatalogContentStatus,
  MacroBucket,
  SubjectManifest,
} from "@/types/curriculum"
import type { EntityManifest, EntityStats } from "@/types/entity"

export type BrowseBucket =
  | "reality"
  | "human-being"
  | "civilization"
  | "built-world"
  | "markets-assets"
  | "meaning-culture"
  | "frontier"

export type BrowseTier =
  | "foundational"
  | "advanced"
  | "thought-provoking"
  | "frontier"

export type BrowseStatus = "full" | "starter" | "coming-soon"

export type BrowseKind = "subject" | "role" | "topic" | "module" | "signal" | "section"

export interface BrowseItem {
  id: string
  kind: BrowseKind
  title: string
  description: string
  href: string
  icon: string
  bucket: BrowseBucket
  tier: BrowseTier
  status: BrowseStatus
  keywords: string[]
  accentColor: string
}

export interface BrowseBucketGroup {
  bucket: BrowseBucket
  label: string
  description: string
  items: BrowseItem[]
}

export interface BrowseModuleSeed {
  subjectSlug: string
  subjectName: string
  subjectIcon: string
  subjectColor: string
  subjectBucket: BrowseBucket
  subjectTier: BrowseTier
  moduleSlug: string
  moduleTitle: string
  moduleSummary: string
  moduleLevel?: string
}

const SUBJECT_BUCKETS: Record<string, BrowseBucket> = {
  physics: "reality",
  "quantum-science": "reality",
  chemistry: "reality",
  "materials-science": "reality",
  biology: "reality",
  "earth-science": "reality",
  cosmology: "reality",
  "ecology-environmental-systems": "reality",
  mathematics: "reality",
  "statistics-probability": "reality",

  psychology: "human-being",
  relationships: "human-being",
  "self-knowledge": "human-being",
  emotions: "human-being",
  meditation: "human-being",
  consciousness: "human-being",
  love: "human-being",
  health: "human-being",
  "medicine-human-physiology": "human-being",
  anthropology: "human-being",
  linguistics: "human-being",

  politics: "civilization",
  law: "civilization",
  sociology: "civilization",
  geopolitics: "civilization",
  "public-administration": "civilization",
  demography: "civilization",
  "commercial-property-management": "civilization",
  "history-of-civilization": "civilization",
  economics: "civilization",
  "institutional-power": "civilization",
  "media-systems": "civilization",
  "intelligence-espionage": "civilization",
  "defense-warfare": "civilization",
  "trade-globalization": "civilization",
  "education-learning-science": "civilization",

  aerospace: "built-world",
  robotics: "built-world",
  "rocket-science": "built-world",
  cybersecurity: "built-world",
  "data-science": "built-world",
  "space-infrastructure": "built-world",
  "energy-systems": "built-world",
  "systems-engineering": "built-world",
  "software-engineering": "built-world",
  "civil-engineering": "built-world",
  "electrical-engineering": "built-world",
  "mechanical-engineering": "built-world",
  "architecture-urbanism": "built-world",
  "manufacturing-industry": "built-world",
  "mining-resources": "built-world",
  "maritime-systems": "built-world",
  "infrastructure-resilience": "built-world",

  "finance-accounting": "markets-assets",
  "supply-chain-logistics": "markets-assets",
  "agriculture-food-systems": "markets-assets",
  money: "markets-assets",
  investing: "markets-assets",

  design: "meaning-culture",
  typography: "meaning-culture",
  "religion-belief-systems": "meaning-culture",
  "world-history": "meaning-culture",
  "ancient-history": "meaning-culture",
  "modern-history": "meaning-culture",
  communication: "meaning-culture",
  "music-and-instruments": "meaning-culture",
  ethics: "meaning-culture",
  aesthetics: "meaning-culture",
  literature: "meaning-culture",
  mythology: "meaning-culture",
  creativity: "meaning-culture",
  "rhetoric-persuasion": "meaning-culture",
  "conflict-negotiation": "meaning-culture",
  "identity-culture": "meaning-culture",
  "morality-values": "meaning-culture",

  "artificial-intelligence": "frontier",
  biotechnology: "frontier",
  "energy-geopolitics": "frontier",
  "civilization-i-ii-iii": "frontier",
  "civilizational-scale": "frontier",
  "rise-and-fall-of-civilizations": "frontier",
  "deep-time": "frontier",
  "human-condition": "frontier",
  power: "frontier",
  truth: "frontier",
  progress: "frontier",
  "order-and-chaos": "frontier",
  "scarcity-and-abundance": "frontier",
  "collapse-and-renewal": "frontier",
  "future-of-humanity": "frontier",
  "existential-risk": "frontier",
  intelligence: "frontier",
  "technology-and-meaning": "frontier",
  "war-and-peace": "frontier",
  "myth-and-modernity": "frontier",
  "knowledge-itself": "frontier",
  meaning: "frontier",
  "human-nature": "frontier",
  mortality: "frontier",
  time: "frontier",
  "great-filters-and-fermi-paradox": "frontier",
}

const TOPIC_BUCKETS: Record<string, BrowseBucket> = {
  "artificial-intelligence": "frontier",
  consciousness: "human-being",
  emotions: "human-being",
  "evolution-and-animals": "reality",
  investing: "markets-assets",
  love: "human-being",
  meditation: "human-being",
  "music-and-instruments": "meaning-culture",
  philosophy: "meaning-culture",
  "world-history": "meaning-culture",
  "ancient-history": "meaning-culture",
  "modern-history": "meaning-culture",
  relationships: "human-being",
  money: "markets-assets",
  economics: "civilization",
  health: "human-being",
  communication: "meaning-culture",
  "self-knowledge": "human-being",
  power: "civilization",
  truth: "meaning-culture",
  "civilization-i-ii-iii": "frontier",
  "civilizational-scale": "frontier",
  "rise-and-fall-of-civilizations": "frontier",
  "deep-time": "frontier",
  "human-condition": "frontier",
  "order-and-chaos": "frontier",
  "scarcity-and-abundance": "frontier",
  "collapse-and-renewal": "frontier",
  "future-of-humanity": "frontier",
  "existential-risk": "frontier",
  intelligence: "frontier",
  "technology-and-meaning": "frontier",
  "war-and-peace": "frontier",
  "myth-and-modernity": "meaning-culture",
  "knowledge-itself": "frontier",
  meaning: "frontier",
  "human-nature": "frontier",
  mortality: "frontier",
  time: "frontier",
  "great-filters-and-fermi-paradox": "frontier",
}

const SUBJECT_TIER_OVERRIDES: Record<string, BrowseTier> = {
  physics: "foundational",
  "quantum-science": "frontier",
  chemistry: "foundational",
  biology: "foundational",
  mathematics: "foundational",
  "statistics-probability": "foundational",
  "earth-science": "foundational",
  cosmology: "frontier",
  psychology: "thought-provoking",
  politics: "foundational",
  law: "foundational",
  sociology: "advanced",
  geopolitics: "advanced",
  "public-administration": "advanced",
  demography: "foundational",
  "commercial-property-management": "advanced",
  "finance-accounting": "foundational",
  "supply-chain-logistics": "advanced",
  "agriculture-food-systems": "advanced",
  aerospace: "advanced",
  robotics: "advanced",
  "rocket-science": "frontier",
  cybersecurity: "advanced",
  "data-science": "advanced",
  "space-infrastructure": "frontier",
  "energy-systems": "advanced",
  "systems-engineering": "advanced",
  "software-engineering": "advanced",
  "civil-engineering": "advanced",
  "electrical-engineering": "advanced",
  "mechanical-engineering": "advanced",
  biotechnology: "frontier",
  design: "thought-provoking",
  typography: "thought-provoking",
  "religion-belief-systems": "thought-provoking",
}

const TOPIC_TIER_OVERRIDES: Record<string, BrowseTier> = {
  philosophy: "thought-provoking",
  "artificial-intelligence": "frontier",
  consciousness: "thought-provoking",
  emotions: "thought-provoking",
  "evolution-and-animals": "foundational",
  investing: "advanced",
  love: "thought-provoking",
  meditation: "thought-provoking",
  "music-and-instruments": "thought-provoking",
  "world-history": "foundational",
  "ancient-history": "foundational",
  "modern-history": "foundational",
  relationships: "thought-provoking",
  money: "advanced",
  economics: "advanced",
  health: "foundational",
  communication: "foundational",
  "self-knowledge": "thought-provoking",
  power: "thought-provoking",
  truth: "thought-provoking",
  "civilization-i-ii-iii": "frontier",
  "civilizational-scale": "frontier",
  "rise-and-fall-of-civilizations": "frontier",
  "deep-time": "frontier",
  "human-condition": "frontier",
  "order-and-chaos": "frontier",
  "scarcity-and-abundance": "frontier",
  "collapse-and-renewal": "frontier",
  "future-of-humanity": "frontier",
  "existential-risk": "frontier",
  intelligence: "frontier",
  "technology-and-meaning": "frontier",
  "war-and-peace": "frontier",
  "myth-and-modernity": "thought-provoking",
  "knowledge-itself": "frontier",
  meaning: "frontier",
  "human-nature": "frontier",
  mortality: "frontier",
  time: "frontier",
  "great-filters-and-fermi-paradox": "frontier",
}

const ROLE_BUCKETS: Record<string, BrowseBucket> = {
  astronaut: "frontier",
  "ai-researcher": "frontier",
  "intelligence-analyst": "civilization",
  diplomat: "civilization",
  "entrepreneur-startup-founder": "markets-assets",
  pilot: "built-world",
  "robotics-engineer": "built-world",
}

const ROLE_TIER_OVERRIDES: Record<string, BrowseTier> = {
  astronaut: "frontier",
  "ai-researcher": "frontier",
  "intelligence-analyst": "advanced",
  diplomat: "advanced",
  "entrepreneur-startup-founder": "advanced",
  pilot: "advanced",
  "robotics-engineer": "advanced",
}

const BUCKET_META: Record<BrowseBucket, { label: string; description: string }> = {
  reality: {
    label: "Reality",
    description: "The physical world: math, matter, life, climate, and the cosmos.",
  },
  "human-being": {
    label: "Human Being",
    description: "Mind, health, behavior, identity, and the inner life.",
  },
  civilization: {
    label: "Civilization",
    description: "Institutions, power, law, governance, history, and public life.",
  },
  "built-world": {
    label: "Built World",
    description: "Engineering, software, infrastructure, and the systems humans build.",
  },
  "markets-assets": {
    label: "Markets & Assets",
    description: "Capital, trade, money, operations, and asset systems.",
  },
  "meaning-culture": {
    label: "Meaning & Culture",
    description: "Culture, communication, art, ethics, and shared symbols.",
  },
  frontier: {
    label: "Frontier",
    description: "High-velocity domains where the future is actively being shaped.",
  },
}

const DEFAULT_TIER_ORDER: BrowseTier[] = [
  "foundational",
  "advanced",
  "thought-provoking",
  "frontier",
]

export const BROWSE_TIER_LABELS: Record<BrowseTier, string> = {
  foundational: "Foundational",
  advanced: "Advanced",
  "thought-provoking": "Thought-provoking",
  frontier: "Frontier",
}

export const BROWSE_STATUS_LABELS: Record<BrowseStatus, string> = {
  full: "Full",
  starter: "Starter",
  "coming-soon": "Coming soon",
}

export const BROWSE_KIND_LABELS: Record<BrowseKind, string> = {
  subject: "Subject",
  role: "Role",
  topic: "Topic",
  module: "Module",
  signal: "Signal",
  section: "Section",
}

export const BROWSE_BUCKET_LABELS: Record<BrowseBucket, string> = {
  reality: BUCKET_META.reality.label,
  "human-being": BUCKET_META["human-being"].label,
  civilization: BUCKET_META.civilization.label,
  "built-world": BUCKET_META["built-world"].label,
  "markets-assets": BUCKET_META["markets-assets"].label,
  "meaning-culture": BUCKET_META["meaning-culture"].label,
  frontier: BUCKET_META.frontier.label,
}

export function getBrowseBucketMeta(bucket: BrowseBucket) {
  return BUCKET_META[bucket]
}

function countToStatus(count: number): BrowseStatus {
  if (count >= 8) return "full"
  if (count >= 2) return "starter"
  return "coming-soon"
}

function resolveBucket(
  manifestBucket: MacroBucket | undefined,
  fallback: BrowseBucket
): BrowseBucket {
  return (manifestBucket as BrowseBucket | undefined) ?? fallback
}

function resolveTier(
  manifestTier: AcademyTier | undefined,
  fallback: BrowseTier
): BrowseTier {
  return (manifestTier as BrowseTier | undefined) ?? fallback
}

function resolveStatus(
  manifestStatus: CatalogContentStatus | undefined,
  fallback: BrowseStatus
): BrowseStatus {
  return (manifestStatus as BrowseStatus | undefined) ?? fallback
}

function mergeKeywords(...values: Array<string | undefined | null>) {
  return values.filter(Boolean).join(" ").toLowerCase().split(/\s+/).filter(Boolean)
}

export function getSubjectBrowseBucket(slug: string): BrowseBucket {
  return SUBJECT_BUCKETS[slug] ?? "civilization"
}

export function getTopicBrowseBucket(slug: string): BrowseBucket {
  return TOPIC_BUCKETS[slug] ?? "meaning-culture"
}

export function getRoleBrowseBucket(slug: string): BrowseBucket {
  return ROLE_BUCKETS[slug] ?? "civilization"
}

export function getSubjectBrowseTier(
  slug: string,
  stats: EntityStats,
): BrowseTier {
  if (SUBJECT_TIER_OVERRIDES[slug]) {
    return SUBJECT_TIER_OVERRIDES[slug]
  }

  if (stats.modules >= 12) return "foundational"
  if (stats.modules >= 6) return "advanced"
  return "thought-provoking"
}

export function getTopicBrowseTier(slug: string, stats: EntityStats): BrowseTier {
  return TOPIC_TIER_OVERRIDES[slug] ?? (stats.sections >= 4 ? "foundational" : "thought-provoking")
}

export function getRoleBrowseTier(slug: string, stats: EntityStats): BrowseTier {
  return ROLE_TIER_OVERRIDES[slug] ?? (stats.modules >= 8 ? "advanced" : "thought-provoking")
}

export function getEntityContentStatus(stats: EntityStats): BrowseStatus {
  return countToStatus(stats.modules + stats.frameworks + stats.projects + stats.tools + stats.lessons)
}

export function buildSubjectBrowseItem(
  subject: SubjectManifest,
  stats: EntityStats,
): BrowseItem {
  const bucket = resolveBucket(
    subject.macroBucket,
    getSubjectBrowseBucket(subject.slug)
  )
  const tier = resolveTier(
    subject.academyTier,
    getSubjectBrowseTier(subject.slug, stats)
  )

  return {
    id: `subject:${subject.slug}`,
    kind: "subject",
    title: subject.name,
    description: subject.tagline,
    href: `/${subject.slug}`,
    icon: subject.icon,
    bucket,
    tier,
    status: resolveStatus(subject.contentStatus, getEntityContentStatus(stats)),
    keywords: mergeKeywords(subject.name, subject.shortName, subject.group, subject.tagline),
    accentColor: subject.color,
  }
}

export function buildRoleBrowseItem(
  role: EntityManifest,
  stats: EntityStats,
): BrowseItem {
  const bucket = resolveBucket(role.macroBucket, getRoleBrowseBucket(role.slug))
  const tier = resolveTier(role.academyTier, getRoleBrowseTier(role.slug, stats))

  return {
    id: `role:${role.slug}`,
    kind: "role",
    title: role.name,
    description: role.tagline,
    href: `/roles/${role.slug}`,
    icon: role.icon,
    bucket,
    tier,
    status: resolveStatus(role.contentStatus, getEntityContentStatus(stats)),
    keywords: mergeKeywords(role.name, role.shortName, role.group, role.tagline, role.description),
    accentColor: role.color,
  }
}

export function buildTopicBrowseItem(
  topic: EntityManifest,
  stats: EntityStats,
): BrowseItem {
  const bucket = resolveBucket(topic.macroBucket, getTopicBrowseBucket(topic.slug))
  const tier = resolveTier(topic.academyTier, getTopicBrowseTier(topic.slug, stats))

  return {
    id: `topic:${topic.slug}`,
    kind: "topic",
    title: topic.name,
    description: topic.tagline,
    href: `/topics/${topic.slug}`,
    icon: topic.icon,
    bucket,
    tier,
    status: resolveStatus(topic.contentStatus, getEntityContentStatus(stats)),
    keywords: mergeKeywords(topic.name, topic.shortName, topic.group, topic.tagline, topic.description),
    accentColor: topic.color,
  }
}

export function buildSubjectSectionItems(
  subject: SubjectManifest,
  stats: EntityStats,
): BrowseItem[] {
  const bucket = resolveBucket(
    subject.macroBucket,
    getSubjectBrowseBucket(subject.slug)
  )
  const tier = resolveTier(
    subject.academyTier,
    getSubjectBrowseTier(subject.slug, stats)
  )
  const status = resolveStatus(
    subject.contentStatus,
    getEntityContentStatus(stats)
  )

  return [
    {
      id: `subject:${subject.slug}:blueprint`,
      kind: "section",
      title: `${subject.name} blueprint`,
      description: "The generated map for the subject arc.",
      href: `/${subject.slug}/blueprint`,
      icon: "Map",
      bucket,
      tier,
      status,
      keywords: mergeKeywords(subject.name, "blueprint", "map", "overview"),
      accentColor: subject.color,
    },
    {
      id: `subject:${subject.slug}:modules`,
      kind: "module",
      title: `${subject.name} modules`,
      description: "Open the structured module grid.",
      href: `/${subject.slug}/modules`,
      icon: "BookOpen",
      bucket,
      tier,
      status,
      keywords: mergeKeywords(subject.name, "modules", "learning"),
      accentColor: subject.color,
    },
    {
      id: `subject:${subject.slug}:projects`,
      kind: "section",
      title: `${subject.name} projects`,
      description: "Practical projects and proof-of-understanding paths.",
      href: `/${subject.slug}/projects`,
      icon: "FolderKanban",
      bucket,
      tier,
      status,
      keywords: mergeKeywords(subject.name, "projects", "applications"),
      accentColor: subject.color,
    },
    {
      id: `subject:${subject.slug}:tools`,
      kind: "section",
      title: `${subject.name} tools`,
      description: "The software and instruments people actually use.",
      href: `/${subject.slug}/tools`,
      icon: "Wrench",
      bucket,
      tier,
      status,
      keywords: mergeKeywords(subject.name, "tools", "software", "instruments"),
      accentColor: subject.color,
    },
    {
      id: `subject:${subject.slug}:signals`,
      kind: "signal",
      title: `${subject.name} signals`,
      description: "Curated live-relevance surface for the field.",
      href: `/${subject.slug}/signals`,
      icon: "Sparkles",
      bucket,
      tier,
      status,
      keywords: mergeKeywords(subject.name, "signals", "frontier", "news"),
      accentColor: subject.color,
    },
  ]
}

export function buildRoleSectionItems(
  role: EntityManifest,
  stats: EntityStats,
): BrowseItem[] {
  const bucket = resolveBucket(role.macroBucket, getRoleBrowseBucket(role.slug))
  const tier = resolveTier(role.academyTier, getRoleBrowseTier(role.slug, stats))
  const status = resolveStatus(role.contentStatus, getEntityContentStatus(stats))

  return [
    {
      id: `role:${role.slug}:overview`,
      kind: "section",
      title: `${role.name} overview`,
      description: "The role landing page and guided world.",
      href: `/roles/${role.slug}`,
      icon: "Compass",
      bucket,
      tier,
      status,
      keywords: mergeKeywords(role.name, "overview", "role", "guided world"),
      accentColor: role.color,
    },
    {
      id: `role:${role.slug}:modules`,
      kind: "module",
      title: `${role.name} training`,
      description: "The staged module path for this role.",
      href: `/roles/${role.slug}/modules`,
      icon: "BookOpen",
      bucket,
      tier,
      status,
      keywords: mergeKeywords(role.name, "training", "modules", "learning"),
      accentColor: role.color,
    },
    {
      id: `role:${role.slug}:projects`,
      kind: "section",
      title: `${role.name} projects`,
      description: "Practice and applied exercises for the role.",
      href: `/roles/${role.slug}/projects`,
      icon: "FolderKanban",
      bucket,
      tier,
      status,
      keywords: mergeKeywords(role.name, "projects", "applications"),
      accentColor: role.color,
    },
    {
      id: `role:${role.slug}:signals`,
      kind: "signal",
      title: `${role.name} signals`,
      description: "Current and frontier cues relevant to the role.",
      href: `/roles/${role.slug}/signals`,
      icon: "Sparkles",
      bucket,
      tier,
      status,
      keywords: mergeKeywords(role.name, "signals", "news", "frontier"),
      accentColor: role.color,
    },
  ]
}

export function buildTopicSectionItems(
  topic: EntityManifest,
  stats: EntityStats,
): BrowseItem[] {
  const bucket = resolveBucket(topic.macroBucket, getTopicBrowseBucket(topic.slug))
  const tier = resolveTier(topic.academyTier, getTopicBrowseTier(topic.slug, stats))
  const status = resolveStatus(topic.contentStatus, getEntityContentStatus(stats))

  return [
    {
      id: `topic:${topic.slug}:overview`,
      kind: "section",
      title: `${topic.name} overview`,
      description: "The concept-first landing page.",
      href: `/topics/${topic.slug}`,
      icon: "Compass",
      bucket,
      tier,
      status,
      keywords: mergeKeywords(topic.name, "overview", "topic"),
      accentColor: topic.color,
    },
    {
      id: `topic:${topic.slug}:modules`,
      kind: "module",
      title: `${topic.name} concepts`,
      description: "The concept and framework surface for the topic.",
      href: `/topics/${topic.slug}/modules`,
      icon: "BookOpen",
      bucket,
      tier,
      status,
      keywords: mergeKeywords(topic.name, "concepts", "modules", "frameworks"),
      accentColor: topic.color,
    },
    {
      id: `topic:${topic.slug}:signals`,
      kind: "signal",
      title: `${topic.name} signals`,
      description: "Curated current relevance for the topic.",
      href: `/topics/${topic.slug}/signals`,
      icon: "Sparkles",
      bucket,
      tier,
      status,
      keywords: mergeKeywords(topic.name, "signals", "news", "curated"),
      accentColor: topic.color,
    },
  ]
}

export function buildModuleBrowseItems(seeds: BrowseModuleSeed[]): BrowseItem[] {
  return seeds.map((seed) => ({
    id: `module:${seed.subjectSlug}:${seed.moduleSlug}`,
    kind: "module",
    title: seed.moduleTitle,
    description: `${seed.subjectName} module${seed.moduleLevel ? ` · ${seed.moduleLevel}` : ""} · ${seed.moduleSummary}`,
    href: `/${seed.subjectSlug}/modules/${seed.moduleSlug}`,
    icon: "BookOpen",
    bucket: seed.subjectBucket,
    tier: seed.subjectTier,
    status: "full",
    keywords: mergeKeywords(seed.subjectName, seed.moduleTitle, seed.moduleSummary, seed.moduleLevel),
    accentColor: seed.subjectColor,
  }))
}

export function buildSignalBrowseItems(
  subjects: Array<{ slug: string; name: string; icon: string; color: string }>,
  roles: Array<{ slug: string; name: string; icon: string; color: string }>,
  topics: Array<{ slug: string; name: string; icon: string; color: string }>,
): BrowseItem[] {
  const subjectSignals = subjects.map((subject) => ({
    id: `signal:subject:${subject.slug}`,
    kind: "signal" as const,
    title: `${subject.name} signals`,
    description: "Curated signals and developments for this subject.",
    href: `/${subject.slug}/signals`,
    icon: "Sparkles",
    bucket: getSubjectBrowseBucket(subject.slug),
    tier: getSubjectBrowseTier(subject.slug, { modules: 1, lessons: 1, frameworks: 1, projects: 1, tools: 1, dayInLife: 1, sections: 1 }),
    status: "full" as const,
    keywords: mergeKeywords(subject.name, "signals", "subject"),
    accentColor: subject.color,
  }))

  const roleSignals = roles.map((role) => ({
    id: `signal:role:${role.slug}`,
    kind: "signal" as const,
    title: `${role.name} signals`,
    description: "Relevant current cues for this role.",
    href: `/roles/${role.slug}/signals`,
    icon: "Sparkles",
    bucket: getRoleBrowseBucket(role.slug),
    tier: getRoleBrowseTier(role.slug, { modules: 1, lessons: 1, frameworks: 1, projects: 1, tools: 1, dayInLife: 1, sections: 1 }),
    status: "full" as const,
    keywords: mergeKeywords(role.name, "signals", "role"),
    accentColor: role.color,
  }))

  const topicSignals = topics.map((topic) => ({
    id: `signal:topic:${topic.slug}`,
    kind: "signal" as const,
    title: `${topic.name} signals`,
    description: "Curated signals and developments for this topic.",
    href: `/topics/${topic.slug}/signals`,
    icon: "Sparkles",
    bucket: getTopicBrowseBucket(topic.slug),
    tier: getTopicBrowseTier(topic.slug, { modules: 1, lessons: 1, frameworks: 1, projects: 1, tools: 1, dayInLife: 1, sections: 4 }),
    status: "full" as const,
    keywords: mergeKeywords(topic.name, "signals", "topic"),
    accentColor: topic.color,
  }))

  return [...subjectSignals, ...roleSignals, ...topicSignals]
}

export function groupBrowseItemsByBucket(items: BrowseItem[]): BrowseBucketGroup[] {
  return (Object.keys(BUCKET_META) as BrowseBucket[]).map((bucket) => ({
    bucket,
    label: BUCKET_META[bucket].label,
    description: BUCKET_META[bucket].description,
    items: items.filter((item) => item.bucket === bucket),
  }))
}

export function sortBrowseItems(items: BrowseItem[]) {
  const tierRank = new Map(DEFAULT_TIER_ORDER.map((tier, index) => [tier, index]))
  const kindRank: Record<BrowseKind, number> = {
    subject: 0,
    role: 1,
    topic: 2,
    module: 3,
    section: 4,
    signal: 5,
  }

  return [...items].sort((left, right) => {
    const bucketOrder = Object.keys(BUCKET_META) as BrowseBucket[]
    const bucketCompare =
      bucketOrder.indexOf(left.bucket) - bucketOrder.indexOf(right.bucket)
    if (bucketCompare !== 0) return bucketCompare

    const tierCompare =
      (tierRank.get(left.tier) ?? 0) - (tierRank.get(right.tier) ?? 0)
    if (tierCompare !== 0) return tierCompare

    const kindCompare = kindRank[left.kind] - kindRank[right.kind]
    if (kindCompare !== 0) return kindCompare

    return left.title.localeCompare(right.title)
  })
}

export function filterBrowseItems(
  items: BrowseItem[],
  query: string,
  filters: {
    kind: BrowseKind | "all"
    bucket: BrowseBucket | "all"
    tier: BrowseTier | "all"
    status: BrowseStatus | "all"
  },
) {
  const normalizedQuery = query.trim().toLowerCase()

  return sortBrowseItems(
    items.filter((item) => {
      if (filters.kind !== "all" && item.kind !== filters.kind) return false
      if (filters.bucket !== "all" && item.bucket !== filters.bucket) return false
      if (filters.tier !== "all" && item.tier !== filters.tier) return false
      if (filters.status !== "all" && item.status !== filters.status) return false

      if (!normalizedQuery) return true

      return mergeKeywords(
        item.title,
        item.description,
        item.href,
        item.kind,
        item.bucket,
        item.tier,
        item.status,
        ...item.keywords,
      ).join(" ").includes(normalizedQuery)
    }),
  )
}
