import fs from "fs"
import path from "path"
import {
  getModules,
  getProjects,
  getSubjectStats,
  getSubjects,
} from "@/lib/content"
import {
  ArchetypeProfileSchema,
  OnboardingQuestionBankSchema,
  SignalDigestSchema,
  SourcePackSchema,
} from "@/lib/guidance-schemas"
import { getRoles, getRoleStats, getTopics, getTopicStats } from "@/lib/entities"
import type {
  AcademyCatalog,
  AcademyEntityCatalogItem,
  ArchetypeProfile,
  OnboardingQuestionBank,
  SignalDigest,
  SourcePack,
} from "@/types/guidance"
import type { EntityKind } from "@/types/curriculum"

const ONBOARDING_BANK_PATH = path.join(
  process.cwd(),
  "content/onboarding/question-bank.json"
)
const ARCHETYPE_DIR = path.join(process.cwd(), "content/guidance/path-archetypes")
const SOURCE_DIR = path.join(process.cwd(), "content/sources")
const SIGNAL_DIR = path.join(process.cwd(), "content/signals")

function readJsonFile<T>(
  filePath: string,
  schema: { parse: (data: unknown) => T }
): T | null {
  if (!fs.existsSync(filePath)) return null

  const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"))
  return schema.parse(raw)
}

export function getOnboardingQuestionBank(): OnboardingQuestionBank {
  const bank = readJsonFile(ONBOARDING_BANK_PATH, OnboardingQuestionBankSchema)
  return bank ?? { steps: [] }
}

export function getArchetypes(): ArchetypeProfile[] {
  if (!fs.existsSync(ARCHETYPE_DIR)) return []

  return fs
    .readdirSync(ARCHETYPE_DIR)
    .filter((file) => file.endsWith(".json"))
    .map((file) =>
      readJsonFile(path.join(ARCHETYPE_DIR, file), ArchetypeProfileSchema)
    )
    .filter((entry): entry is ArchetypeProfile => Boolean(entry))
}

export function getArchetype(slug: string): ArchetypeProfile | null {
  return readJsonFile(path.join(ARCHETYPE_DIR, `${slug}.json`), ArchetypeProfileSchema)
}

function readEntityPack<T>(
  root: string,
  kind: EntityKind,
  slug: string,
  schema: { parse: (data: unknown) => T }
): T | null {
  const singularPath = path.join(root, kind, `${slug}.json`)
  if (fs.existsSync(singularPath)) return readJsonFile(singularPath, schema)

  const pluralKind =
    kind === "subject" ? "subjects" : kind === "role" ? "roles" : "topics"

  return readJsonFile(path.join(root, pluralKind, `${slug}.json`), schema)
}

export function getSourcePack(kind: EntityKind, slug: string): SourcePack | null {
  return readEntityPack(SOURCE_DIR, kind, slug, SourcePackSchema)
}

export function getSignalDigest(kind: EntityKind, slug: string): SignalDigest | null {
  return readEntityPack(SIGNAL_DIR, kind, slug, SignalDigestSchema)
}

export function hasSourcePack(kind: EntityKind, slug: string) {
  return Boolean(getSourcePack(kind, slug))
}

export function hasSignalDigest(kind: EntityKind, slug: string) {
  return Boolean(getSignalDigest(kind, slug))
}

function readAllEntityPacks<T>(
  root: string,
  schema: { parse: (data: unknown) => T }
): T[] {
  if (!fs.existsSync(root)) return []

  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) =>
      fs
        .readdirSync(path.join(root, entry.name))
        .filter((file) => file.endsWith(".json"))
        .map((file) => readJsonFile(path.join(root, entry.name, file), schema))
    )
    .filter((entry): entry is T => Boolean(entry))
}

export function getAllSourcePacks() {
  return readAllEntityPacks(SOURCE_DIR, SourcePackSchema)
}

export function getAllSignalDigests() {
  return readAllEntityPacks(SIGNAL_DIR, SignalDigestSchema)
}

function buildSubjectCatalogItem(subjectSlug: string): AcademyEntityCatalogItem | null {
  const subject = getSubjects().find((entry) => entry.slug === subjectSlug)
  if (!subject) return null

  const modules = getModules(subject.slug)
  const projects = getProjects(subject.slug)
  const stats = getSubjectStats(subject.slug)

  return {
    slug: subject.slug,
    name: subject.name,
    kind: "subject",
    tagline: subject.tagline,
    group: subject.group,
    color: subject.color,
    firstModuleSlug: modules[0]?.slug,
    firstModuleTitle: modules[0]?.title,
    firstProjectSlug: projects[0]?.slug,
    firstProjectTitle: projects[0]?.title,
    moduleCount: stats.modules,
    projectCount: stats.projects,
    toolCount: stats.tools,
    modules: modules.map((module) => ({
      slug: module.slug,
      title: module.title,
      lessons: module.lessons,
    })),
    sourceAvailable: hasSourcePack("subject", subject.slug),
    signalAvailable: hasSignalDigest("subject", subject.slug),
  }
}

export function getAcademyCatalog(): AcademyCatalog {
  const subjects = getSubjects()
    .map((subject) => buildSubjectCatalogItem(subject.slug))
    .filter((entry): entry is AcademyEntityCatalogItem => Boolean(entry))

  const roles = getRoles().map((role) => {
    const stats = getRoleStats(role.slug)
    return {
      slug: role.slug,
      name: role.name,
      kind: "role" as const,
      tagline: role.tagline,
      group: role.group,
      color: role.color,
      moduleCount: stats.modules,
      projectCount: stats.projects,
      toolCount: stats.tools,
      sourceAvailable: hasSourcePack("role", role.slug),
      signalAvailable: hasSignalDigest("role", role.slug),
    }
  })

  const topics = getTopics().map((topic) => {
    const stats = getTopicStats(topic.slug)
    return {
      slug: topic.slug,
      name: topic.name,
      kind: "topic" as const,
      tagline: topic.tagline,
      group: topic.group,
      color: topic.color,
      moduleCount: stats.modules,
      projectCount: stats.projects,
      toolCount: stats.tools,
      sourceAvailable: hasSourcePack("topic", topic.slug),
      signalAvailable: hasSignalDigest("topic", topic.slug),
    }
  })

  return { subjects, roles, topics }
}
