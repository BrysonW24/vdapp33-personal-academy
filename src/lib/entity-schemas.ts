import { z } from "zod"

export const OverlayEntityKindSchema = z.enum(["role", "topic"])

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

export const EntityManifestSchema = z
  .object({
    slug: z.string().min(1),
    name: z.string().min(1),
    kind: OverlayEntityKindSchema,
    group: z.string().min(1),
    icon: z.string().min(1),
    emoji: z.string().optional(),
    color: z.string().min(1),
    tagline: z.string().min(1),
    academyTier: AcademyTierSchema.optional(),
    macroBucket: MacroBucketSchema.optional(),
    contentStatus: CatalogContentStatusSchema.optional(),
    tier: z.enum(["flagship", "thin"]).optional(),
    hasNews: z.boolean().optional(),
    order: z.number().int().nonnegative(),
    shortName: z.string().optional(),
  })
  .passthrough()

export const EntityRelatedEntitiesSchema = z.object({
  relatedSubjects: z.array(z.string()).default([]),
  relatedTopics: z.array(z.string()).default([]),
  relatedRoles: z.array(z.string()).default([]),
})

export const RoleOverviewSchema = z
  .object({
    slug: z.string().min(1),
    title: z.string().min(1),
    summary: z.string().min(1),
    coreWork: z.union([z.string(), z.array(z.string())]),
    frontierPull: z.string().min(1),
    signals: z.array(z.string()).default([]),
    whenItCameAbout: z.union([z.string(), z.array(z.string())]).optional(),
    whatPeopleDo: z.array(z.string()).default([]),
    howPeopleGetThere: z.union([z.string(), z.array(z.string())]).optional(),
    strengths: z.array(z.string()).default([]),
    whoThrivesHere: z.union([z.string(), z.array(z.string())]).optional(),
    exposures: z.array(z.string()).default([]),
    careerLevers: z.array(z.string()).default([]),
    careerPath: z.array(z.string()).default([]),
  })
  .transform((value) => ({
    slug: value.slug,
    title: value.title,
    summary: value.summary,
    coreWork:
      typeof value.coreWork === "string"
        ? value.coreWork
        : value.coreWork.map((item) => `• ${item}`).join("\n"),
    frontierPull: value.frontierPull,
    signals: value.signals,
    whenItCameAbout:
      typeof value.whenItCameAbout === "string"
        ? value.whenItCameAbout
        : value.whenItCameAbout?.join("\n\n"),
    whatPeopleDo: value.whatPeopleDo,
    howPeopleGetThere:
      typeof value.howPeopleGetThere === "string"
        ? value.howPeopleGetThere
        : value.howPeopleGetThere?.join("\n\n"),
    strengths: value.strengths,
    whoThrivesHere:
      typeof value.whoThrivesHere === "string"
        ? value.whoThrivesHere
        : value.whoThrivesHere?.join("\n\n"),
    exposures: value.exposures,
    careerLevers: value.careerLevers,
    careerPath: value.careerPath,
  }))

const KeyIdeaSchema = z.union([
  z.string(),
  z.object({
    title: z.string(),
    summary: z.string().optional(),
  }),
])

export const TopicOverviewSchema = z
  .object({
    slug: z.string().min(1),
    title: z.string().min(1),
    whatItIs: z.string().min(1),
    whyItMatters: z.string().min(1),
    keyIdeas: z.array(KeyIdeaSchema).default([]),
    frontier: z.string().min(1),
    openQuestions: z.array(z.string()).default([]),
  })
  .transform((value) => ({
    slug: value.slug,
    title: value.title,
    whatItIs: value.whatItIs,
    whyItMatters: value.whyItMatters,
    keyIdeas: value.keyIdeas.map((item) =>
      typeof item === "string" ? item : item.title
    ),
    frontier: value.frontier,
    openQuestions: value.openQuestions,
  }))

const FurtherReadingSchema = z.union([
  z.string(),
  z.object({
    title: z.string(),
    author: z.string().optional(),
    description: z.string().optional(),
    url: z.string().optional(),
  }),
])

export const TopicSectionSchema = z
  .object({
    slug: z.string().min(1),
    title: z.string().min(1),
    body: z.string().optional(),
    paragraphs: z.array(z.string()).optional(),
    keyPoints: z.array(z.string()).default([]),
    furtherReading: z.array(FurtherReadingSchema).default([]),
  })
  .transform((value) => {
    const body = value.body ?? value.paragraphs?.join("\n\n") ?? ""

    return {
      slug: value.slug,
      title: value.title,
      body,
      keyPoints: value.keyPoints,
      furtherReading: value.furtherReading.map((item) =>
        typeof item === "string"
          ? item
          : [item.title, item.author, item.description]
              .filter(Boolean)
              .join(" — ")
      ),
    }
  })
