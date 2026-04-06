import fs from "fs"
import path from "path"
import {
  DayInLifeSchema,
  FrameworkSchema,
  LessonSchema,
  ModuleSchema,
  ProjectSchema,
  SubjectManifestSchema,
  ToolSchema,
} from "@/lib/curriculum-schemas"
import type {
  DayInLife,
  Framework,
  Lesson,
  Module,
  Project,
  SubjectManifest,
  Tool,
} from "@/types/curriculum"
import { sortModulesForDisplay } from "@/lib/teaching-contract"

const CONTENT_DIR = path.join(process.cwd(), "content/curriculum")
const directoryCache = new Map<string, unknown[]>()
const fileCache = new Map<string, unknown | null>()
let subjectsCache: SubjectManifest[] | null = null
const SUBJECT_MANIFEST_ALIASES: Record<
  string,
  { slug: string; name: string; shortName: string }
> = {
  quantum: {
    slug: "quantum-science",
    name: "Quantum Science",
    shortName: "Quantum Science",
  },
}

const SYNTHETIC_SUBJECTS: SubjectManifest[] = [
  {
    kind: "subject",
    slug: "energy-systems",
    name: "Energy Systems",
    shortName: "Energy Systems",
    group: "engineering",
    icon: "Zap",
    color: "#F59E0B",
    tagline: "How humanity generates, stores, transmits, and consumes the power that drives civilisation.",
    description:
      "The physics, engineering, economics, and politics of power generation and consumption.",
    blueprintSlug: "blueprint",
    deepDivePages: [],
    order: 2,
  },
]

function getSubjectDir(slug: string) {
  const directPath = path.join(CONTENT_DIR, slug, "manifest.json")
  if (fs.existsSync(directPath)) return slug

  if (
    slug === "quantum-science" &&
    fs.existsSync(path.join(CONTENT_DIR, "quantum", "manifest.json"))
  ) {
    return "quantum"
  }

  if (
    slug === "quantum" &&
    fs.existsSync(path.join(CONTENT_DIR, "quantum-science", "manifest.json"))
  ) {
    return "quantum-science"
  }

  return slug
}

function transformSubjectManifest(
  raw: SubjectManifest,
  sourceSlug: string
): SubjectManifest {
  const alias = SUBJECT_MANIFEST_ALIASES[sourceSlug]
  if (!alias) return raw

  return {
    ...raw,
    slug: alias.slug,
    name: alias.name,
    shortName: alias.shortName,
  }
}

function readJsonDir<T>(
  subject: string,
  dir: string,
  schema: { parse: (data: unknown) => T }
): T[] {
  const cacheKey = `${getSubjectDir(subject)}:${dir}`
  const cached = directoryCache.get(cacheKey)
  if (cached) return cached as T[]

  const fullPath = path.join(CONTENT_DIR, getSubjectDir(subject), dir)
  if (!fs.existsSync(fullPath)) return []

  const value = fs
    .readdirSync(fullPath)
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const raw = JSON.parse(fs.readFileSync(path.join(fullPath, file), "utf-8"))
      return schema.parse(raw)
    })

  directoryCache.set(cacheKey, value)
  return value
}

function readJsonFile<T>(
  subject: string,
  filePath: string,
  schema: { parse: (data: unknown) => T }
): T | null {
  const cacheKey = `${getSubjectDir(subject)}:${filePath}`
  if (fileCache.has(cacheKey)) {
    return fileCache.get(cacheKey) as T | null
  }

  const fullPath = path.join(CONTENT_DIR, getSubjectDir(subject), filePath)
  if (!fs.existsSync(fullPath)) {
    fileCache.set(cacheKey, null)
    return null
  }

  const raw = JSON.parse(fs.readFileSync(fullPath, "utf-8"))
  const value = schema.parse(raw)
  fileCache.set(cacheKey, value)
  return value
}

export function getSubjects(): SubjectManifest[] {
  if (subjectsCache) return subjectsCache
  if (!fs.existsSync(CONTENT_DIR)) return []

  const hasCanonicalQuantumScience = fs.existsSync(
    path.join(CONTENT_DIR, "quantum-science", "manifest.json")
  )
  const hasEnergySystems = fs.existsSync(
    path.join(CONTENT_DIR, "energy-systems", "manifest.json")
  )

  const subjects = fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) =>
      fs.existsSync(path.join(CONTENT_DIR, entry.name, "manifest.json"))
    )
    .flatMap((entry) => {
      if (entry.name === "quantum" && hasCanonicalQuantumScience) return []

      const raw = JSON.parse(
        fs.readFileSync(
          path.join(CONTENT_DIR, entry.name, "manifest.json"),
          "utf-8"
        )
      )
      const parsed = SubjectManifestSchema.parse(raw)
      return [transformSubjectManifest(parsed, entry.name)]
    })
  
  if (!hasEnergySystems) {
    subjects.push(...SYNTHETIC_SUBJECTS)
  }

  subjectsCache = subjects.sort((a, b) => a.order - b.order)
  return subjectsCache
}

export function getSubject(slug: string): SubjectManifest | null {
  const syntheticSubject = SYNTHETIC_SUBJECTS.find((subject) => subject.slug === slug)
  if (syntheticSubject && !fs.existsSync(path.join(CONTENT_DIR, slug, "manifest.json"))) {
    return syntheticSubject
  }

  const resolvedSlug = getSubjectDir(slug)
  const manifestPath = path.join(CONTENT_DIR, resolvedSlug, "manifest.json")
  if (!fs.existsSync(manifestPath)) return null

  const raw = JSON.parse(fs.readFileSync(manifestPath, "utf-8"))
  const parsed = SubjectManifestSchema.parse(raw)
  return transformSubjectManifest(parsed, resolvedSlug)
}

export function getSubjectSlugs(): string[] {
  return getSubjects().map((subject) => subject.slug)
}

export function getModules(subject: string): Module[] {
  return sortModulesForDisplay(readJsonDir(subject, "modules", ModuleSchema))
}

export function getModule(subject: string, slug: string): Module | null {
  return readJsonFile(subject, `modules/${slug}.json`, ModuleSchema)
}

export function getAllLessons(subject: string): Lesson[] {
  return readJsonDir(subject, "lessons", LessonSchema).sort(
    (a, b) => a.order - b.order
  )
}

export function getLessons(subject: string, moduleSlug: string): Lesson[] {
  return getAllLessons(subject).filter((lesson) => lesson.moduleSlug === moduleSlug)
}

export function getLesson(subject: string, slug: string): Lesson | null {
  return readJsonFile(subject, `lessons/${slug}.json`, LessonSchema)
}

export function getFrameworks(subject: string): Framework[] {
  return readJsonDir(subject, "frameworks", FrameworkSchema).sort((a, b) =>
    a.name.localeCompare(b.name)
  )
}

export function getFramework(subject: string, slug: string): Framework | null {
  return readJsonFile(subject, `frameworks/${slug}.json`, FrameworkSchema)
}

export function getProjects(subject: string): Project[] {
  return readJsonDir(subject, "projects", ProjectSchema).sort(
    (a, b) => a.difficulty - b.difficulty || a.title.localeCompare(b.title)
  )
}

export function getProject(subject: string, slug: string): Project | null {
  return readJsonFile(subject, `projects/${slug}.json`, ProjectSchema)
}

export function getTools(subject: string): Tool[] {
  return readJsonDir(subject, "tools", ToolSchema).sort((a, b) =>
    a.name.localeCompare(b.name)
  )
}

export function getTool(subject: string, slug: string): Tool | null {
  return readJsonFile(subject, `tools/${slug}.json`, ToolSchema)
}

export function getDayInLifeScenarios(subject: string): DayInLife[] {
  return readJsonDir(subject, "day-in-life", DayInLifeSchema).sort((a, b) =>
    a.title.localeCompare(b.title)
  )
}

export function getDayInLifeScenario(
  subject: string,
  slug: string
): DayInLife | null {
  return readJsonFile(subject, `day-in-life/${slug}.json`, DayInLifeSchema)
}

export function getSubjectStats(subject: string) {
  return {
    modules: getModules(subject).length,
    lessons: getAllLessons(subject).length,
    frameworks: getFrameworks(subject).length,
    projects: getProjects(subject).length,
    tools: getTools(subject).length,
    dayInLife: getDayInLifeScenarios(subject).length,
  }
}
