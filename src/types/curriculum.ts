export const SUBJECT_GROUPS = ["sciences", "engineering", "society"] as const

export type SubjectGroup = (typeof SUBJECT_GROUPS)[number]
export type SubjectLevel = "beginner" | "intermediate" | "advanced"
export type ContentStatus = "complete" | "coming-soon"
export type ToolPricingTier = "free" | "freemium" | "paid" | "enterprise"

export const SUBJECT_GROUP_LABELS: Record<SubjectGroup, string> = {
  sciences: "Sciences",
  engineering: "Engineering",
  society: "Society",
}

export interface DeepDivePage {
  slug: string
  label: string
  icon: string
}

export interface SubjectManifest {
  slug: string
  name: string
  shortName: string
  group: SubjectGroup
  icon: string
  color: string
  tagline: string
  blueprintSlug: string
  deepDivePages: DeepDivePage[]
  order: number
}

export interface Module {
  slug: string
  title: string
  shortSummary: string
  level: SubjectLevel
  domain?: string
  category?: string
  whyItMatters: string
  coreConcepts: string[]
  lessons: string[]
  frameworks: string[]
  visualType?: string
  relatedModules: string[]
  status: ContentStatus
  order: number
  levelNumber?: number
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
  nextLesson?: string
  order: number
  quiz?: QuizQuestion[]
  perspectives?: Record<string, string>
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
}
