import { z } from "zod"

const AcademyTierSchema = z.enum([
  "foundational",
  "advanced",
  "thought-provoking",
  "frontier",
])

const MacroBucketSchema = z.enum([
  "reality",
  "human-being",
  "civilization",
  "built-world",
  "markets-assets",
  "meaning-culture",
  "frontier",
])

const CatalogContentStatusSchema = z.enum([
  "full",
  "starter",
  "coming-soon",
])

const DeepDivePageSchema = z.object({
  slug: z.string(),
  label: z.string(),
  icon: z.string(),
})

const GoDeeperLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
  description: z.string().optional(),
})

const MentalModelDefinitionSchema = z.object({
  title: z.string(),
  summary: z.string(),
  anchors: z.array(z.string()),
})

const ProcessBreakdownSchema = z.object({
  title: z.string().optional(),
  steps: z.array(z.string()),
})

const LessonTeachingContractSchema = z.object({
  mentalModel: MentalModelDefinitionSchema.optional(),
  howItWorks: ProcessBreakdownSchema.optional(),
  upsides: z.array(z.string()).optional(),
  downsides: z.array(z.string()).optional(),
  workedExampleLabel: z.string().optional(),
  workedExample: z.string().optional(),
  realWorldApplications: z.array(z.string()).optional(),
  whoWorksWithThis: z.array(z.string()).optional(),
  goDeeper: z.array(GoDeeperLinkSchema).optional(),
})

const EntityReferenceSchema = z.object({
  kind: z.enum(["subject", "role", "topic"]),
  slug: z.string(),
  label: z.string().optional(),
})

const EntitySectionConfigSchema = z.object({
  enabled: z.boolean(),
  label: z.string(),
})

const EntityNavigationSchema = z.object({
  primary: z.array(
    z.enum([
      "blueprint",
      "modules",
      "projects",
      "tools",
      "toolkit",
      "dayInLife",
      "sources",
      "signals",
      "simulation",
    ])
  ),
  secondary: z.array(
    z.enum([
      "blueprint",
      "modules",
      "projects",
      "tools",
      "toolkit",
      "dayInLife",
      "sources",
      "signals",
      "simulation",
    ])
  ),
})

const EntityVisualProfileSchema = z.object({
  heroScene: z.string().optional(),
  projectSurface: z.enum(["grid", "quest-board"]).optional(),
  dashboard: z.string().optional(),
  simulationStyle: z.string().optional(),
})

const CuratedContentRefSchema = z.object({
  sourceKind: z.enum(["subject", "role", "topic"]).optional(),
  sourceSlug: z.string(),
  slug: z.string(),
  alias: z.string().optional(),
})

const EntityContentRefsSchema = z.object({
  modules: z.array(CuratedContentRefSchema).optional(),
  lessons: z.array(CuratedContentRefSchema).optional(),
  frameworks: z.array(CuratedContentRefSchema).optional(),
  projects: z.array(CuratedContentRefSchema).optional(),
  tools: z.array(CuratedContentRefSchema).optional(),
  dayInLife: z.array(CuratedContentRefSchema).optional(),
})

export const SubjectManifestSchema = z.object({
  kind: z.literal("subject").optional().default("subject"),
  slug: z.string(),
  name: z.string(),
  shortName: z.string(),
  group: z.string(),
  icon: z.string(),
  emoji: z.string().optional(),
  color: z.string(),
  tagline: z.string(),
  academyTier: AcademyTierSchema.optional(),
  macroBucket: MacroBucketSchema.optional(),
  contentStatus: CatalogContentStatusSchema.optional(),
  description: z.string().optional(),
  blueprintSlug: z.string().default("blueprint"),
  deepDivePages: z.array(DeepDivePageSchema).default([]),
  sections: z
    .record(
      z.enum([
        "blueprint",
        "modules",
        "projects",
        "tools",
        "toolkit",
        "dayInLife",
        "sources",
        "signals",
        "simulation",
      ]),
      EntitySectionConfigSchema
    )
    .optional(),
  navigation: EntityNavigationSchema.optional(),
  relatedEntities: z.array(EntityReferenceSchema).optional(),
  visualProfile: EntityVisualProfileSchema.optional(),
  order: z.number(),
})

export const EntityManifestSchema = z.object({
  kind: z.enum(["role", "topic"]),
  slug: z.string(),
  name: z.string(),
  shortName: z.string(),
  group: z.string(),
  icon: z.string(),
  emoji: z.string().optional(),
  color: z.string(),
  tagline: z.string(),
  academyTier: AcademyTierSchema.optional(),
  macroBucket: MacroBucketSchema.optional(),
  contentStatus: CatalogContentStatusSchema.optional(),
  description: z.string(),
  blueprintSlug: z.string().default("blueprint"),
  sections: z.record(
    z.enum([
      "blueprint",
      "modules",
      "projects",
      "tools",
      "toolkit",
      "dayInLife",
      "sources",
      "signals",
      "simulation",
    ]),
    EntitySectionConfigSchema
  ),
  navigation: EntityNavigationSchema,
  relatedEntities: z.array(EntityReferenceSchema).default([]),
  visualProfile: EntityVisualProfileSchema.optional(),
  curated: EntityContentRefsSchema.optional(),
  order: z.number(),
})

export const GroupDefinitionSchema = z.object({
  slug: z.string(),
  label: z.string(),
  description: z.string().optional(),
  order: z.number(),
})

const levelEnum = z.enum(["beginner", "intermediate", "advanced"])
const statusEnum = z.enum(["complete", "coming-soon"])

export const ModuleSchema = z.object({
  slug: z.string(),
  title: z.string(),
  shortSummary: z.string(),
  level: levelEnum,
  teachingStage: z
    .enum([
      "orientation",
      "mental-models",
      "frameworks",
      "processes",
      "applications",
      "careers",
      "go-deeper",
    ])
    .optional(),
  domain: z.string().optional(),
  category: z.string().optional(),
  whyItMatters: z.string(),
  coreConcepts: z.array(z.string()),
  mentalModels: z.array(z.string()).optional(),
  lessons: z.array(z.string()),
  frameworks: z.array(z.string()),
  goDeeper: z.array(GoDeeperLinkSchema).optional(),
  visualType: z.string().optional(),
  relatedModules: z.array(z.string()),
  status: statusEnum.default("coming-soon"),
  order: z.number(),
  levelNumber: z.number().optional(),
  sourceMeta: z
    .object({
      sourceKind: z.enum(["subject", "role", "topic"]),
      sourceSlug: z.string(),
      originalSlug: z.string(),
    })
    .optional(),
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
  teaching: LessonTeachingContractSchema.optional(),
  nextLesson: z.string().optional(),
  order: z.number(),
  quiz: z.array(QuizQuestionSchema).optional(),
  perspectives: z.record(z.string(), z.string()).optional(),
  sourceMeta: z
    .object({
      sourceKind: z.enum(["subject", "role", "topic"]),
      sourceSlug: z.string(),
      originalSlug: z.string(),
    })
    .optional(),
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
  sourceMeta: z
    .object({
      sourceKind: z.enum(["subject", "role", "topic"]),
      sourceSlug: z.string(),
      originalSlug: z.string(),
    })
    .optional(),
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
  sourceMeta: z
    .object({
      sourceKind: z.enum(["subject", "role", "topic"]),
      sourceSlug: z.string(),
      originalSlug: z.string(),
    })
    .optional(),
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
    sourceMeta: z
      .object({
        sourceKind: z.enum(["subject", "role", "topic"]),
        sourceSlug: z.string(),
        originalSlug: z.string(),
      })
      .optional(),
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
  sourceMeta: z
    .object({
      sourceKind: z.enum(["subject", "role", "topic"]),
      sourceSlug: z.string(),
      originalSlug: z.string(),
    })
    .optional(),
})

export const EntityContentPackSchema = z.object({
  modules: z.array(ModuleSchema).optional(),
  lessons: z.array(LessonSchema).optional(),
  frameworks: z.array(FrameworkSchema).optional(),
  projects: z.array(ProjectSchema).optional(),
  tools: z.array(ToolSchema).optional(),
  dayInLife: z.array(DayInLifeSchema).optional(),
})

const SimulationOptionSchema = z.object({
  title: z.string(),
  rationale: z.string(),
  outcome: z.string(),
})

const SimulationStageSchema = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  situation: z.string(),
  questionsToAsk: z.array(z.string()),
  options: z.array(SimulationOptionSchema).min(2),
})

export const EntitySimulationSchema = z.object({
  title: z.string(),
  summary: z.string(),
  scenario: z.string(),
  goal: z.string(),
  stages: z.array(SimulationStageSchema).min(1),
})
