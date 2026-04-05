import { z } from "zod"
import { SUBJECT_GROUPS } from "@/types/curriculum"

const DeepDivePageSchema = z.object({
  slug: z.string(),
  label: z.string(),
  icon: z.string(),
})

export const SubjectManifestSchema = z.object({
  slug: z.string(),
  name: z.string(),
  shortName: z.string(),
  group: z.enum(SUBJECT_GROUPS),
  icon: z.string(),
  color: z.string(),
  tagline: z.string(),
  blueprintSlug: z.string().default("blueprint"),
  deepDivePages: z.array(DeepDivePageSchema).default([]),
  order: z.number(),
})

const levelEnum = z.enum(["beginner", "intermediate", "advanced"])
const statusEnum = z.enum(["complete", "coming-soon"])

export const ModuleSchema = z.object({
  slug: z.string(),
  title: z.string(),
  shortSummary: z.string(),
  level: levelEnum,
  domain: z.string().optional(),
  category: z.string().optional(),
  whyItMatters: z.string(),
  coreConcepts: z.array(z.string()),
  lessons: z.array(z.string()),
  frameworks: z.array(z.string()),
  visualType: z.string().optional(),
  relatedModules: z.array(z.string()),
  status: statusEnum.default("coming-soon"),
  order: z.number(),
  levelNumber: z.number().optional(),
})

const QuizQuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()),
  correctIndex: z.number(),
  explanation: z.string(),
})

export const LessonSchema = z.object({
  slug: z.string(),
  moduleSlug: z.string(),
  title: z.string(),
  objective: z.string(),
  beginnerExplanation: z.string(),
  deeperExplanation: z.string(),
  keyTakeaways: z.array(z.string()),
  frameworks: z.array(z.string()),
  example: z.string(),
  commonMistakes: z.array(z.string()),
  exercise: z.string(),
  nextLesson: z.string().optional(),
  order: z.number(),
  quiz: z.array(QuizQuestionSchema).optional(),
  perspectives: z.record(z.string(), z.string()).optional(),
})

export const FrameworkSchema = z.object({
  slug: z.string(),
  name: z.string(),
  summary: z.string(),
  whenToUseIt: z.string(),
  steps: z.array(z.string()),
  example: z.string(),
  category: z.string(),
  domain: z.string().optional(),
})

const ProjectStepSchema = z.object({
  title: z.string(),
  description: z.string(),
  tips: z.string().optional(),
})

const ProjectRubricSchema = z.object({
  criteria: z.string(),
  description: z.string(),
})

export const ProjectSchema = z.object({
  slug: z.string(),
  title: z.string(),
  difficulty: z.number().min(1).max(10),
  estimatedHours: z.number(),
  description: z.string(),
  whyItMatters: z.string(),
  skillsLearned: z.array(z.string()),
  prerequisites: z.array(z.string()),
  steps: z.array(ProjectStepSchema),
  deliverables: z.array(z.string()),
  tools: z.array(z.string()),
  rubric: z.array(ProjectRubricSchema),
  domain: z.string().optional(),
})

const VocabularyItemSchema = z.object({
  term: z.string(),
  definition: z.string(),
})

export const ToolSchema = z
  .object({
    slug: z.string(),
    name: z.string(),
    category: z.string(),
    description: z.string(),
    whyUseIt: z.string(),
    pricingTier: z.enum(["free", "freemium", "paid", "enterprise"]),
    url: z.string().optional(),
    logoUrl: z.string().optional(),
    aiCapabilities: z.string().optional(),
    alternatives: z.array(z.string()),
    outputs: z.array(z.string()).optional(),
    vocabulary: z.array(VocabularyItemSchema).optional(),
    beginnerMistakes: z.array(z.string()).optional(),
    relatedProject: z.string().optional(),
  })
  .passthrough()

export const ScheduleEntrySchema = z.object({
  time: z.string(),
  activity: z.string(),
  tools: z.array(z.string()).optional(),
  note: z.string().optional(),
})

export const DayInLifeSchema = z.object({
  slug: z.string(),
  title: z.string(),
  setting: z.string(),
  companySize: z.string(),
  description: z.string(),
  salary: z.string(),
  schedule: z.array(ScheduleEntrySchema),
  responsibilities: z.array(z.string()),
  challenges: z.array(z.string()),
  rewards: z.array(z.string()),
  careerPath: z.array(z.string()),
})
