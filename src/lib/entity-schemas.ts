import { z } from "zod"

export const OverlayEntityKindSchema = z.enum(["role", "topic"])

export const EntityManifestSchema = z
  .object({
    slug: z.string().min(1),
    name: z.string().min(1),
    kind: OverlayEntityKindSchema,
    group: z.string().min(1),
    icon: z.string().min(1),
    color: z.string().min(1),
    tagline: z.string().min(1),
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
