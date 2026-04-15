export const SUBJECT_GROUPS = [
  "sciences",
  "engineering",
  "society",
  "markets",
  "life",
  "humanities",
  "mind",
] as const

export type SubjectGroup = string
export type SubjectLevel = "beginner" | "intermediate" | "advanced"
export type ContentStatus = "complete" | "coming-soon"
export type AcademyTier =
  | "foundational"
  | "advanced"
  | "thought-provoking"
  | "frontier"
export type MacroBucket =
  | "reality"
  | "human-being"
  | "civilization"
  | "built-world"
  | "markets-assets"
  | "meaning-culture"
  | "frontier"
export type CatalogContentStatus = "full" | "starter" | "coming-soon"
export type ToolPricingTier = "free" | "freemium" | "paid" | "enterprise"
export type EntityKind = "subject" | "role" | "topic"
export const TEACHING_STAGE_ORDER = [
  "orientation",
  "mental-models",
  "frameworks",
  "processes",
  "applications",
  "careers",
  "go-deeper",
] as const
export type TeachingStage = (typeof TEACHING_STAGE_ORDER)[number]
export type EntitySectionKey =
  | "blueprint"
  | "modules"
  | "projects"
  | "tools"
  | "toolkit"
  | "dayInLife"
  | "sources"
  | "signals"
  | "simulation"

export const SUBJECT_GROUP_LABELS: Record<string, string> = {
  sciences: "Sciences",
  engineering: "Engineering",
  society: "Society",
  markets: "Markets",
  life: "Life",
  humanities: "Humanities",
  mind: "Mind",
}

export interface GroupDefinition {
  slug: string
  label: string
  description?: string
  order: number
}

export interface DeepDivePage {
  slug: string
  label: string
  icon: string
}

export interface GoDeeperLink {
  label: string
  href: string
  description?: string
}

export interface MentalModelDefinition {
  title: string
  summary: string
  anchors: string[]
}

export interface ProcessBreakdown {
  title?: string
  steps: string[]
}

export interface LessonTeachingContract {
  mentalModel?: MentalModelDefinition
  howItWorks?: ProcessBreakdown
  upsides?: string[]
  downsides?: string[]
  workedExampleLabel?: string
  workedExample?: string
  realWorldApplications?: string[]
  whoWorksWithThis?: string[]
  goDeeper?: GoDeeperLink[]
}

export interface EntityReference {
  kind: EntityKind
  slug: string
  label?: string
}

export interface EntitySectionConfig {
  enabled: boolean
  label: string
}

export interface EntityNavigation {
  primary: EntitySectionKey[]
  secondary: EntitySectionKey[]
}

export interface EntityVisualProfile {
  heroScene?: string
  projectSurface?: "grid" | "quest-board"
  dashboard?: string
  simulationStyle?: string
}

export interface CuratedContentRef {
  sourceKind?: EntityKind
  sourceSlug: string
  slug: string
  alias?: string
}

export interface EntityContentRefs {
  modules?: CuratedContentRef[]
  lessons?: CuratedContentRef[]
  frameworks?: CuratedContentRef[]
  projects?: CuratedContentRef[]
  tools?: CuratedContentRef[]
  dayInLife?: CuratedContentRef[]
}

export interface EntitySourceMeta {
  sourceKind: EntityKind
  sourceSlug: string
  originalSlug: string
}

export interface SimulationOption {
  title: string
  rationale: string
  outcome: string
}

export interface SimulationStage {
  slug: string
  title: string
  summary: string
  situation: string
  questionsToAsk: string[]
  options: SimulationOption[]
}

export interface EntitySimulation {
  title: string
  summary: string
  scenario: string
  goal: string
  stages: SimulationStage[]
}

export interface SubjectManifest {
  kind?: "subject"
  slug: string
  name: string
  shortName: string
  group: SubjectGroup
  icon: string
  emoji?: string
  color: string
  tagline: string
  academyTier?: AcademyTier
  macroBucket?: MacroBucket
  contentStatus?: CatalogContentStatus
  description?: string
  blueprintSlug: string
  deepDivePages: DeepDivePage[]
  sections?: Partial<Record<EntitySectionKey, EntitySectionConfig>>
  navigation?: EntityNavigation
  relatedEntities?: EntityReference[]
  visualProfile?: EntityVisualProfile
  order: number
}

export interface EntityManifest {
  kind: Exclude<EntityKind, "subject">
  slug: string
  name: string
  shortName: string
  group: SubjectGroup
  icon: string
  emoji?: string
  color: string
  tagline: string
  academyTier?: AcademyTier
  macroBucket?: MacroBucket
  contentStatus?: CatalogContentStatus
  description: string
  blueprintSlug: string
  sections: Partial<Record<EntitySectionKey, EntitySectionConfig>>
  navigation: EntityNavigation
  relatedEntities: EntityReference[]
  visualProfile?: EntityVisualProfile
  curated?: EntityContentRefs
  order: number
}

export type AcademyEntity = SubjectManifest | EntityManifest

export interface Module {
  slug: string
  title: string
  shortSummary: string
  level: SubjectLevel
  teachingStage?: TeachingStage
  domain?: string
  category?: string
  whyItMatters: string
  coreConcepts: string[]
  mentalModels?: string[]
  lessons: string[]
  frameworks: string[]
  goDeeper?: GoDeeperLink[]
  visualType?: string
  relatedModules: string[]
  status: ContentStatus
  order: number
  levelNumber?: number
  sourceMeta?: EntitySourceMeta
}

export interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface Lesson {
  slug: string
  moduleSlug: string
  title: string
  objective: string
  beginnerExplanation: string
  deeperExplanation: string
  keyTakeaways: string[]
  frameworks: string[]
  example: string
  commonMistakes: string[]
  exercise: string
  teaching?: LessonTeachingContract
  nextLesson?: string
  order: number
  quiz?: QuizQuestion[]
  perspectives?: Record<string, string>
  sourceMeta?: EntitySourceMeta
}

export interface Framework {
  slug: string
  name: string
  summary: string
  whenToUseIt: string
  steps: string[]
  example: string
  category: string
  domain?: string
  sourceMeta?: EntitySourceMeta
}

export interface ProjectStep {
  title: string
  description: string
  tips?: string
}

export interface ProjectRubric {
  criteria: string
  description: string
}

export interface Project {
  slug: string
  title: string
  difficulty: number
  estimatedHours: number
  description: string
  whyItMatters: string
  skillsLearned: string[]
  prerequisites: string[]
  steps: ProjectStep[]
  deliverables: string[]
  tools: string[]
  rubric: ProjectRubric[]
  domain?: string
  sourceMeta?: EntitySourceMeta
}

export interface VocabularyItem {
  term: string
  definition: string
}

export interface Tool {
  slug: string
  name: string
  category: string
  description: string
  whyUseIt: string
  pricingTier: ToolPricingTier
  url?: string
  logoUrl?: string
  aiCapabilities?: string
  alternatives: string[]
  outputs?: string[]
  vocabulary?: VocabularyItem[]
  beginnerMistakes?: string[]
  relatedProject?: string
  sourceMeta?: EntitySourceMeta
  [key: string]: unknown
}

export interface ScheduleEntry {
  time: string
  activity: string
  tools?: string[]
  note?: string
}

export interface DayInLife {
  slug: string
  title: string
  setting: string
  companySize: string
  description: string
  salary: string
  schedule: ScheduleEntry[]
  responsibilities: string[]
  challenges: string[]
  rewards: string[]
  careerPath: string[]
  sourceMeta?: EntitySourceMeta
}

export interface EntityContentPack {
  modules?: Module[]
  lessons?: Lesson[]
  frameworks?: Framework[]
  projects?: Project[]
  tools?: Tool[]
  dayInLife?: DayInLife[]
}
