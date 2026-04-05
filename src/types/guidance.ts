import type { EntityKind } from "@/types/curriculum"

export type LearningMode = "guided" | "explorer" | "operator"
export type IntensityLevel = "gentle" | "balanced" | "ambitious" | "obsessive"
export type SessionStyle = "micro" | "deep"
export type StructurePreference = "structured" | "adaptive"
export type OnboardingQuestionType = "single-choice" | "multi-choice" | "reflection"
export type PathOptionKind = "recommended" | "exploration" | "practical"

export const ARCHETYPE_SLUGS = [
  "reality-foundations",
  "engineered-civilization",
  "human-systems",
  "meaning-and-depth",
  "role-synthesis",
] as const

export type ArchetypeSlug = (typeof ARCHETYPE_SLUGS)[number]

export interface OnboardingOptionSignals {
  subjects: string[]
  topics: string[]
  roles: string[]
  mode: LearningMode
  intensity: IntensityLevel
  sessionStyle: SessionStyle
  structure: StructurePreference
  weeklyHours: number
}

export interface OnboardingOption {
  id: string
  label: string
  description: string
  weights: Partial<Record<ArchetypeSlug, number>>
  signals: OnboardingOptionSignals
}

export interface OnboardingQuestion {
  id: string
  prompt: string
  type: OnboardingQuestionType
  required: boolean
  placeholder?: string
  options?: OnboardingOption[]
}

export interface OnboardingStep {
  slug: string
  title: string
  description: string
  questions: OnboardingQuestion[]
}

export interface OnboardingQuestionBank {
  steps: OnboardingStep[]
}

export interface WeeklyCadencePresets {
  gentle: string
  balanced: string
  ambitious: string
  obsessive: string
}

export interface ArchetypeDefaults {
  coreSubjects: string[]
  supportingTopics: string[]
  roles: string[]
  mode: LearningMode
  reviewRhythm: string
  milestoneTemplate: string
  weeklyCadencePresets: WeeklyCadencePresets
}

export interface ArchetypeProfile {
  slug: ArchetypeSlug
  name: string
  summary: string
  thesis: string
  fitSignals: string[]
  defaults: ArchetypeDefaults
}

export interface SourceItem {
  name: string
  kind:
    | "principle"
    | "book"
    | "journal"
    | "institution"
    | "person"
    | "company"
    | "channel"
    | "documentary"
    | "dataset"
    | "publication"
    | "tool"
  description: string
  link?: string
}

export interface TruthStackTier {
  slug:
    | "first-principles"
    | "primary-authorities"
    | "mature-interpreters"
    | "practitioners"
    | "institutions"
    | "media-publications"
    | "channels-documentaries"
    | "frontier-watchlist"
  title: string
  description: string
  items: SourceItem[]
}

export interface SourcePack {
  slug: string
  kind: EntityKind
  title: string
  summary: string
  starterPack: string[]
  tiers: TruthStackTier[]
}

export interface SignalItem {
  name: string
  summary: string
  whyItMatters: string
  entities: string[]
}

export interface SignalSection {
  slug:
    | "major-developments"
    | "important-companies"
    | "important-institutions"
    | "notable-people"
    | "active-debates"
  title: string
  items: SignalItem[]
}

export interface SignalDigest {
  slug: string
  kind: EntityKind
  title: string
  summary: string
  sections: SignalSection[]
}

export interface UserProfile {
  selectedOptionIds: string[]
  reflections: Record<string, string>
  archetypeScores: Record<ArchetypeSlug, number>
  preferredSubjects: string[]
  preferredTopics: string[]
  preferredRoles: string[]
  preferredMode: LearningMode
  intensity: IntensityLevel
  sessionStyle: SessionStyle
  structure: StructurePreference
  weeklyHours: number
  leadingArchetype: ArchetypeSlug
}

export interface LearningProjectRef {
  subjectSlug: string
  projectSlug: string
  title: string
}

export interface PathAssignment {
  coreSubject: string
  supportingTopic: string
  roleLens: string
  currentProject: LearningProjectRef | null
  weeklyCadence: string
  currentMilestone: string
  reviewRhythm: string
}

export interface PathOption {
  id: PathOptionKind
  label: string
  summary: string
  archetype: ArchetypeSlug
  assignment: PathAssignment
  rationale: string[]
}

export interface LearningBlueprint {
  createdAt: string
  leadingArchetype: ArchetypeSlug
  profile: UserProfile
  options: PathOption[]
  activePathId: PathOptionKind
}

export interface ReviewEntry {
  id: string
  createdAt: string
  changedModel: string
  unclear: string
  revisitNext: string
}

export interface AcademyEntityCatalogItem {
  slug: string
  name: string
  kind: EntityKind
  tagline?: string
  group?: string
  color?: string
  firstModuleSlug?: string
  firstModuleTitle?: string
  firstProjectSlug?: string
  firstProjectTitle?: string
  moduleCount?: number
  projectCount?: number
  toolCount?: number
  modules?: Array<{
    slug: string
    title: string
    lessons: string[]
  }>
  sourceAvailable: boolean
  signalAvailable: boolean
}

export interface AcademyCatalog {
  subjects: AcademyEntityCatalogItem[]
  topics: AcademyEntityCatalogItem[]
  roles: AcademyEntityCatalogItem[]
}

export interface NextBestAction {
  id: string
  title: string
  description: string
  href: string
  category:
    | "core-subject"
    | "supporting-topic"
    | "role-application"
    | "current-project"
    | "weekly-review"
    | "truth-stack"
    | "signals"
}

export interface TodaySession {
  title: string
  description: string
  href: string
  category: NextBestAction["category"]
}

export interface PathState {
  activePath: PathOption | null
  mode: LearningMode
  coreProgressPercent: number
  breadthScore: number
  depthScore: number
  synthesisScore: number
  reviewDue: boolean
  todaySession: TodaySession | null
  nextActions: NextBestAction[]
}
