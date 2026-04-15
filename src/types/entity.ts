import type {
  AcademyTier,
  CatalogContentStatus,
  DayInLife,
  Framework,
  Lesson,
  Module,
  Project,
  MacroBucket,
  SubjectManifest,
  Tool,
} from "@/types/curriculum"

export type EntityKind = "subject" | "role" | "topic"
export type OverlayEntityKind = Exclude<EntityKind, "subject">
export type EntityTier = "flagship" | "thin"

export interface EntityManifest {
  slug: string
  name: string
  kind: OverlayEntityKind
  group: string
  icon: string
  emoji?: string
  color: string
  tagline: string
  description?: string
  tier?: EntityTier
  academyTier?: AcademyTier
  macroBucket?: MacroBucket
  contentStatus?: CatalogContentStatus
  hasNews?: boolean
  order: number
  shortName?: string
}

export interface EntityRelatedEntities {
  relatedSubjects: string[]
  relatedTopics: string[]
  relatedRoles: string[]
}

export interface RoleOverview {
  slug: string
  title: string
  summary: string
  coreWork: string
  frontierPull: string
  signals: string[]
  whenItCameAbout?: string
  whatPeopleDo: string[]
  howPeopleGetThere?: string
  strengths: string[]
  whoThrivesHere?: string
  exposures: string[]
  careerLevers: string[]
  careerPath: string[]
}

export interface TopicOverview {
  slug: string
  title: string
  whatItIs: string
  whyItMatters: string
  keyIdeas: string[]
  frontier: string
  openQuestions: string[]
}

export interface TopicSection {
  slug: string
  title: string
  body: string
  keyPoints: string[]
  furtherReading: string[]
}

export type EntityOverview = RoleOverview | TopicOverview

export interface EntityStats {
  modules: number
  lessons: number
  frameworks: number
  projects: number
  tools: number
  dayInLife: number
  sections: number
}

export interface RoleBundle {
  manifest: EntityManifest
  overview: RoleOverview | null
  related: EntityRelatedEntities
  relatedSubjects: SubjectManifest[]
  modules: Module[]
  lessons: Lesson[]
  frameworks: Framework[]
  projects: Project[]
  tools: Tool[]
  dayInLife: DayInLife[]
}

export interface TopicBundle {
  manifest: EntityManifest
  overview: TopicOverview | null
  related: EntityRelatedEntities
  relatedSubjects: SubjectManifest[]
  sections: TopicSection[]
  modules: Module[]
  frameworks: Framework[]
  projects: Project[]
  tools: Tool[]
}
