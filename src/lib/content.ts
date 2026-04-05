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

const CONTENT_DIR = path.join(process.cwd(), "content/curriculum")

function readJsonDir<T>(
  subject: string,
  dir: string,
  schema: { parse: (data: unknown) => T }
): T[] {
  const fullPath = path.join(CONTENT_DIR, subject, dir)
  if (!fs.existsSync(fullPath)) return []

  return fs
    .readdirSync(fullPath)
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const raw = JSON.parse(fs.readFileSync(path.join(fullPath, file), "utf-8"))
      return schema.parse(raw)
    })
}

function readJsonFile<T>(
  subject: string,
  filePath: string,
  schema: { parse: (data: unknown) => T }
): T | null {
  const fullPath = path.join(CONTENT_DIR, subject, filePath)
  if (!fs.existsSync(fullPath)) return null

  const raw = JSON.parse(fs.readFileSync(fullPath, "utf-8"))
  return schema.parse(raw)
}

export function getSubjects(): SubjectManifest[] {
  if (!fs.existsSync(CONTENT_DIR)) return []

  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) =>
      fs.existsSync(path.join(CONTENT_DIR, entry.name, "manifest.json"))
    )
    .map((entry) => {
      const raw = JSON.parse(
        fs.readFileSync(
          path.join(CONTENT_DIR, entry.name, "manifest.json"),
          "utf-8"
        )
      )
      return SubjectManifestSchema.parse(raw)
    })
    .sort((a, b) => a.order - b.order)
}

export function getSubject(slug: string): SubjectManifest | null {
  const manifestPath = path.join(CONTENT_DIR, slug, "manifest.json")
  if (!fs.existsSync(manifestPath)) return null

  const raw = JSON.parse(fs.readFileSync(manifestPath, "utf-8"))
  return SubjectManifestSchema.parse(raw)
}

export function getSubjectSlugs(): string[] {
  return getSubjects().map((subject) => subject.slug)
}

export function getModules(subject: string): Module[] {
  return readJsonDir(subject, "modules", ModuleSchema).sort(
    (a, b) => a.order - b.order
  )
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
