import { z } from "zod"
import { ARCHETYPE_SLUGS } from "@/types/guidance"

const archetypeEnum = z.enum(ARCHETYPE_SLUGS)

const OnboardingOptionSignalsSchema = z.object({
  subjects: z.array(z.string()),
  topics: z.array(z.string()),
  roles: z.array(z.string()),
  mode: z.enum(["guided", "explorer", "operator"]),
  intensity: z.enum(["gentle", "balanced", "ambitious", "obsessive"]),
  sessionStyle: z.enum(["micro", "deep"]),
  structure: z.enum(["structured", "adaptive"]),
  weeklyHours: z.number(),
})

const OnboardingOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
  weights: z.record(archetypeEnum, z.number()),
  signals: OnboardingOptionSignalsSchema,
})

export const OnboardingQuestionSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  type: z.enum(["single-choice", "multi-choice", "reflection"]),
  required: z.boolean(),
  placeholder: z.string().optional(),
  options: z.array(OnboardingOptionSchema).optional(),
})

export const OnboardingStepSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  questions: z.array(OnboardingQuestionSchema),
})

export const OnboardingQuestionBankSchema = z.object({
  steps: z.array(OnboardingStepSchema),
})

export const ArchetypeProfileSchema = z.object({
  slug: archetypeEnum,
  name: z.string(),
  summary: z.string(),
  thesis: z.string(),
  fitSignals: z.array(z.string()),
  defaults: z.object({
    coreSubjects: z.array(z.string()),
    supportingTopics: z.array(z.string()),
    roles: z.array(z.string()),
    mode: z.enum(["guided", "explorer", "operator"]),
    reviewRhythm: z.string(),
    milestoneTemplate: z.string(),
    weeklyCadencePresets: z.object({
      gentle: z.string(),
      balanced: z.string(),
      ambitious: z.string(),
      obsessive: z.string(),
    }),
  }),
})

const SourceItemSchema = z.object({
  name: z.string(),
  kind: z.enum([
    "principle",
    "book",
    "journal",
    "institution",
    "person",
    "company",
    "channel",
    "documentary",
    "dataset",
    "publication",
    "tool",
  ]),
  description: z.string(),
  link: z.string().url().optional(),
})

export const TruthStackTierSchema = z.object({
  slug: z.enum([
    "first-principles",
    "primary-authorities",
    "mature-interpreters",
    "practitioners",
    "institutions",
    "media-publications",
    "channels-documentaries",
    "frontier-watchlist",
  ]),
  title: z.string(),
  description: z.string(),
  items: z.array(SourceItemSchema),
})

export const SourcePackSchema = z.object({
  slug: z.string(),
  kind: z.enum(["subject", "role", "topic"]),
  title: z.string(),
  summary: z.string(),
  starterPack: z.array(z.string()),
  tiers: z.array(TruthStackTierSchema),
})

const SignalItemSchema = z.object({
  name: z.string(),
  summary: z.string(),
  whyItMatters: z.string(),
  entities: z.array(z.string()),
})

export const SignalSectionSchema = z.object({
  slug: z.enum([
    "major-developments",
    "important-companies",
    "important-institutions",
    "notable-people",
    "active-debates",
  ]),
  title: z.string(),
  items: z.array(SignalItemSchema),
})

export const SignalDigestSchema = z.object({
  slug: z.string(),
  kind: z.enum(["subject", "role", "topic"]),
  title: z.string(),
  summary: z.string(),
  sections: z.array(SignalSectionSchema),
})
