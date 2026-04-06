import fs from "fs"
import path from "path"
import {
  DayInLifeSchema,
  FrameworkSchema,
  LessonSchema,
  ModuleSchema,
  ProjectSchema,
  ToolSchema,
} from "@/lib/curriculum-schemas"
import {
  EntityManifestSchema,
  EntityRelatedEntitiesSchema,
  RoleOverviewSchema,
  TopicOverviewSchema,
  TopicSectionSchema,
} from "@/lib/entity-schemas"
import {
  getAllLessons,
  getFrameworks,
  getModule,
  getModules,
  getProject,
  getProjects,
  getSubject,
  getSubjects,
  getTool,
  getTools,
} from "@/lib/content"
import type {
  DayInLife,
  EntitySourceMeta,
  Framework,
  Lesson,
  Module,
  Project,
  TeachingStage,
  SubjectManifest,
  Tool,
} from "@/types/curriculum"
import type {
  EntityManifest,
  EntityRelatedEntities,
  EntityStats,
  OverlayEntityKind,
  RoleOverview,
  TopicOverview,
  TopicSection,
} from "@/types/entity"
import { sortModulesForDisplay } from "@/lib/teaching-contract"

const ENTITY_DIRS: Record<OverlayEntityKind, string> = {
  role: path.join(process.cwd(), "content/roles"),
  topic: path.join(process.cwd(), "content/topics"),
}
const entityFileCache = new Map<string, unknown | null>()
const entityDirCache = new Map<string, unknown[]>()
const entityListCache = new Map<OverlayEntityKind, EntityManifest[]>()

const TOPIC_SECTION_ORDER = [
  "what-it-is",
  "why-it-matters",
  "key-concepts",
  "frontier",
] as const

function readJsonFile<T>(
  fullPath: string,
  schema: { parse: (value: unknown) => T }
): T | null {
  if (entityFileCache.has(fullPath)) {
    return entityFileCache.get(fullPath) as T | null
  }

  if (!fs.existsSync(fullPath)) {
    entityFileCache.set(fullPath, null)
    return null
  }

  const raw = JSON.parse(fs.readFileSync(fullPath, "utf-8"))
  const value = schema.parse(raw)
  entityFileCache.set(fullPath, value)
  return value
}

function readEntityJson<T>(
  kind: OverlayEntityKind,
  slug: string,
  relativePath: string,
  schema: { parse: (value: unknown) => T }
): T | null {
  return readJsonFile(path.join(ENTITY_DIRS[kind], slug, relativePath), schema)
}

function readEntityDir<T>(
  kind: OverlayEntityKind,
  slug: string,
  relativeDir: string,
  schema: { parse: (value: unknown) => T }
): T[] {
  const fullPath = path.join(ENTITY_DIRS[kind], slug, relativeDir)
  if (entityDirCache.has(fullPath)) {
    return entityDirCache.get(fullPath) as T[]
  }

  if (!fs.existsSync(fullPath)) {
    entityDirCache.set(fullPath, [])
    return []
  }

  const value = fs
    .readdirSync(fullPath)
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const raw = JSON.parse(fs.readFileSync(path.join(fullPath, file), "utf-8"))
      return schema.parse(raw)
    })

  entityDirCache.set(fullPath, value)
  return value
}

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items))
}

function aliasedSlug(sourceSlug: string, originalSlug: string) {
  return `${sourceSlug}--${originalSlug}`
}

export function parseAliasedSlug(value: string) {
  const separatorIndex = value.indexOf("--")
  if (separatorIndex < 0) return null

  return {
    sourceSlug: value.slice(0, separatorIndex),
    originalSlug: value.slice(separatorIndex + 2),
  }
}

function createSourceMeta(
  sourceKind: "subject" | "role" | "topic",
  sourceSlug: string,
  originalSlug: string
): EntitySourceMeta {
  return {
    sourceKind,
    sourceSlug,
    originalSlug,
  }
}

function compareBySourceOrder<T extends { sourceMeta?: EntitySourceMeta }>(
  left: T,
  right: T
) {
  const subjectOrder = new Map(getSubjects().map((subject) => [subject.slug, subject.order]))

  const resolveOrder = (item: T) => {
    if (item.sourceMeta?.sourceKind === "role") return -1
    if (item.sourceMeta?.sourceKind === "subject") {
      return subjectOrder.get(item.sourceMeta.sourceSlug) ?? 999
    }
    return 999
  }

  const leftOrder = resolveOrder(left)
  const rightOrder = resolveOrder(right)

  if (leftOrder !== rightOrder) return leftOrder - rightOrder
  return 0
}

function aliasModule(module: Module, subject: SubjectManifest): Module {
  return {
    ...module,
    slug: aliasedSlug(subject.slug, module.slug),
    lessons: module.lessons.map((lessonSlug) => aliasedSlug(subject.slug, lessonSlug)),
    relatedModules: module.relatedModules.map((moduleSlug) =>
      aliasedSlug(subject.slug, moduleSlug)
    ),
    sourceMeta: createSourceMeta("subject", subject.slug, module.slug),
  }
}

function aliasLesson(lesson: Lesson, subject: SubjectManifest): Lesson {
  return {
    ...lesson,
    slug: aliasedSlug(subject.slug, lesson.slug),
    moduleSlug: aliasedSlug(subject.slug, lesson.moduleSlug),
    nextLesson: lesson.nextLesson
      ? aliasedSlug(subject.slug, lesson.nextLesson)
      : undefined,
    sourceMeta: createSourceMeta("subject", subject.slug, lesson.slug),
  }
}

function aliasFramework(framework: Framework, subject: SubjectManifest): Framework {
  return {
    ...framework,
    slug: aliasedSlug(subject.slug, framework.slug),
    sourceMeta: createSourceMeta("subject", subject.slug, framework.slug),
  }
}

function aliasProject(project: Project, subject: SubjectManifest): Project {
  return {
    ...project,
    slug: aliasedSlug(subject.slug, project.slug),
    sourceMeta: createSourceMeta("subject", subject.slug, project.slug),
  }
}

function aliasTool(tool: Tool, subject: SubjectManifest): Tool {
  return {
    ...tool,
    slug: aliasedSlug(subject.slug, tool.slug),
    relatedProject:
      typeof tool.relatedProject === "string"
        ? aliasedSlug(subject.slug, tool.relatedProject)
        : tool.relatedProject,
    sourceMeta: createSourceMeta("subject", subject.slug, tool.slug),
  }
}

function withRoleSourceMeta<T extends { slug: string; sourceMeta?: EntitySourceMeta }>(
  roleSlug: string,
  item: T
): T {
  return {
    ...item,
    sourceMeta: item.sourceMeta ?? createSourceMeta("role", roleSlug, item.slug),
  }
}

function getLocalRoleModules(slug: string): Module[] {
  return sortModulesForDisplay(
    readEntityDir("role", slug, "modules", ModuleSchema).map((module) =>
      withRoleSourceMeta(slug, module)
    )
  )
}

function getLocalRoleLessons(slug: string): Lesson[] {
  return readEntityDir("role", slug, "lessons", LessonSchema)
    .map((lesson) => withRoleSourceMeta(slug, lesson))
    .sort((left, right) => left.order - right.order)
}

function getLocalRoleFrameworks(slug: string): Framework[] {
  return readEntityDir("role", slug, "frameworks", FrameworkSchema)
    .map((framework) => withRoleSourceMeta(slug, framework))
    .sort((left, right) => left.name.localeCompare(right.name))
}

function getLocalRoleProjects(slug: string): Project[] {
  return readEntityDir("role", slug, "projects", ProjectSchema)
    .map((project) => withRoleSourceMeta(slug, project))
    .sort((left, right) => left.difficulty - right.difficulty || left.title.localeCompare(right.title))
}

function getLocalRoleTools(slug: string): Tool[] {
  return readEntityDir("role", slug, "tools", ToolSchema)
    .map((tool) => withRoleSourceMeta(slug, tool))
    .sort((left, right) => left.name.localeCompare(right.name))
}

function getLocalRoleDayInLifeScenarios(slug: string): DayInLife[] {
  return readEntityDir("role", slug, "day-in-life", DayInLifeSchema)
    .map((scenario) => withRoleSourceMeta(slug, scenario))
    .sort((left, right) => left.title.localeCompare(right.title))
}

export function getEntities(kind: OverlayEntityKind): EntityManifest[] {
  const cached = entityListCache.get(kind)
  if (cached) return cached

  const dir = ENTITY_DIRS[kind]
  if (!fs.existsSync(dir)) return []

  const value = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => fs.existsSync(path.join(dir, entry.name, "manifest.json")))
    .map((entry) => {
      const raw = JSON.parse(
        fs.readFileSync(path.join(dir, entry.name, "manifest.json"), "utf-8")
      )

      return EntityManifestSchema.parse(raw)
    })
    .sort((left, right) => left.order - right.order)

  entityListCache.set(kind, value)
  return value
}

export function getRoles() {
  return getEntities("role").filter((entity) => entity.kind === "role")
}

export function getTopics() {
  return getEntities("topic").filter((entity) => entity.kind === "topic")
}

export function getRole(slug: string) {
  const entity = readEntityJson("role", slug, "manifest.json", EntityManifestSchema)
  return entity?.kind === "role" ? entity : null
}

export function getTopic(slug: string) {
  const entity = readEntityJson("topic", slug, "manifest.json", EntityManifestSchema)
  return entity?.kind === "topic" ? entity : null
}

export function getEntityRelated(
  kind: OverlayEntityKind,
  slug: string
): EntityRelatedEntities {
  return (
    readEntityJson(
      kind,
      slug,
      "related-entities.json",
      EntityRelatedEntitiesSchema
    ) ?? {
      relatedSubjects: [],
      relatedTopics: [],
      relatedRoles: [],
    }
  )
}

export function getRoleOverview(slug: string): RoleOverview | null {
  return readEntityJson("role", slug, "overview.json", RoleOverviewSchema)
}

export function getTopicOverview(slug: string): TopicOverview | null {
  return readEntityJson("topic", slug, "overview.json", TopicOverviewSchema)
}

export function getTopicSections(slug: string): TopicSection[] {
  const order = new Map<string, number>(
    TOPIC_SECTION_ORDER.map((key, index) => [key, index])
  )

  return readEntityDir("topic", slug, "sections", TopicSectionSchema).sort((left, right) => {
    const leftOrder = order.get(left.slug) ?? 999
    const rightOrder = order.get(right.slug) ?? 999
    if (leftOrder !== rightOrder) return leftOrder - rightOrder
    return left.title.localeCompare(right.title)
  })
}

export function getTopicSection(slug: string, sectionSlug: string): TopicSection | null {
  return readEntityJson(
    "topic",
    slug,
    `sections/${sectionSlug}.json`,
    TopicSectionSchema
  )
}

export function getRoleDayInLifeScenarios(slug: string): DayInLife[] {
  return getLocalRoleDayInLifeScenarios(slug)
}

export function getRoleDayInLifeScenario(
  slug: string,
  scenarioSlug: string
): DayInLife | null {
  const scenario = readEntityJson(
    "role",
    slug,
    `day-in-life/${scenarioSlug}.json`,
    DayInLifeSchema
  )

  return scenario ? withRoleSourceMeta(slug, scenario) : null
}

export function getRelatedSubjectsForEntity(
  kind: OverlayEntityKind,
  slug: string
): SubjectManifest[] {
  const related = getEntityRelated(kind, slug)

  return unique(related.relatedSubjects)
    .map((subjectSlug) => getSubject(subjectSlug))
    .filter((subject): subject is SubjectManifest => Boolean(subject))
    .sort((left, right) => left.order - right.order)
}

export function getRoleModules(slug: string): Module[] {
  return [
    ...getLocalRoleModules(slug),
    ...getRelatedSubjectsForEntity("role", slug).flatMap((subject) =>
      getModules(subject.slug).map((module) => aliasModule(module, subject))
    ),
  ]
    .sort((left, right) => {
      const sourceOrder = compareBySourceOrder(left, right)
      if (sourceOrder !== 0) return sourceOrder
      return left.order - right.order
    })
}

export function getRoleModule(slug: string, moduleSlug: string): Module | null {
  const localModule = readEntityJson("role", slug, `modules/${moduleSlug}.json`, ModuleSchema)
  if (localModule) {
    return withRoleSourceMeta(slug, localModule)
  }

  const parsed = parseAliasedSlug(moduleSlug)
  if (!parsed) return null

  const subject = getSubject(parsed.sourceSlug)
  const sourceModule = getModule(parsed.sourceSlug, parsed.originalSlug)
  if (!subject || !sourceModule) return null

  return aliasModule(sourceModule, subject)
}

export function getRoleLessons(slug: string): Lesson[] {
  return [
    ...getLocalRoleLessons(slug),
    ...getRelatedSubjectsForEntity("role", slug).flatMap((subject) =>
      getAllLessons(subject.slug).map((lesson) => aliasLesson(lesson, subject))
    ),
  ]
    .sort((left, right) => {
      const sourceOrder = compareBySourceOrder(left, right)
      if (sourceOrder !== 0) return sourceOrder
      return left.order - right.order
    })
}

export function getRoleLessonsForModule(slug: string, moduleSlug: string): Lesson[] {
  const localModule = getLocalRoleModules(slug).find((module) => module.slug === moduleSlug)
  if (localModule) {
    return getLocalRoleLessons(slug)
      .filter((lesson) => lesson.moduleSlug === moduleSlug)
      .sort((left, right) => left.order - right.order)
  }

  const parsed = parseAliasedSlug(moduleSlug)
  if (!parsed) return []

  const subject = getSubject(parsed.sourceSlug)
  if (!subject) return []

  return getAllLessons(parsed.sourceSlug)
    .filter((lesson) => lesson.moduleSlug === parsed.originalSlug)
    .map((lesson) => aliasLesson(lesson, subject))
    .sort((left, right) => left.order - right.order)
}

export function getRoleLesson(slug: string, lessonSlug: string): Lesson | null {
  const localLesson = readEntityJson("role", slug, `lessons/${lessonSlug}.json`, LessonSchema)
  if (localLesson) {
    return withRoleSourceMeta(slug, localLesson)
  }

  const parsed = parseAliasedSlug(lessonSlug)
  if (!parsed) return null

  const subject = getSubject(parsed.sourceSlug)
  const lesson = getAllLessons(parsed.sourceSlug).find(
    (entry) => entry.slug === parsed.originalSlug
  )
  if (!subject || !lesson) return null

  return aliasLesson(lesson, subject)
}

export function getRoleFrameworks(slug: string): Framework[] {
  return [
    ...getLocalRoleFrameworks(slug),
    ...getRelatedSubjectsForEntity("role", slug).flatMap((subject) =>
      getFrameworks(subject.slug).map((framework) => aliasFramework(framework, subject))
    ),
  ]
    .sort((left, right) => {
      const sourceOrder = compareBySourceOrder(left, right)
      if (sourceOrder !== 0) return sourceOrder
      return left.name.localeCompare(right.name)
    })
}

export function getRoleProjects(slug: string): Project[] {
  return [
    ...getLocalRoleProjects(slug),
    ...getRelatedSubjectsForEntity("role", slug).flatMap((subject) =>
      getProjects(subject.slug).map((project) => aliasProject(project, subject))
    ),
  ]
    .sort((left, right) => {
      const sourceOrder = compareBySourceOrder(left, right)
      if (sourceOrder !== 0) return sourceOrder
      return left.difficulty - right.difficulty || left.title.localeCompare(right.title)
    })
}

export function getRoleProject(slug: string, projectSlug: string): Project | null {
  const localProject = readEntityJson("role", slug, `projects/${projectSlug}.json`, ProjectSchema)
  if (localProject) {
    return withRoleSourceMeta(slug, localProject)
  }

  const parsed = parseAliasedSlug(projectSlug)
  if (!parsed) return null

  const subject = getSubject(parsed.sourceSlug)
  const project = getProject(parsed.sourceSlug, parsed.originalSlug)
  if (!subject || !project) return null

  return aliasProject(project, subject)
}

export function getRoleTools(slug: string): Tool[] {
  return [
    ...getLocalRoleTools(slug),
    ...getRelatedSubjectsForEntity("role", slug).flatMap((subject) =>
      getTools(subject.slug).map((tool) => aliasTool(tool, subject))
    ),
  ]
    .sort((left, right) => {
      const sourceOrder = compareBySourceOrder(left, right)
      if (sourceOrder !== 0) return sourceOrder
      return left.name.localeCompare(right.name)
    })
}

export function getRoleTool(slug: string, toolSlug: string): Tool | null {
  const localTool = readEntityJson("role", slug, `tools/${toolSlug}.json`, ToolSchema)
  if (localTool) {
    return withRoleSourceMeta(slug, localTool)
  }

  const parsed = parseAliasedSlug(toolSlug)
  if (!parsed) return null

  const subject = getSubject(parsed.sourceSlug)
  const tool = getTool(parsed.sourceSlug, parsed.originalSlug)
  if (!subject || !tool) return null

  return aliasTool(tool, subject)
}

export function getTopicSourceModules(slug: string): Module[] {
  return getRelatedSubjectsForEntity("topic", slug)
    .flatMap((subject) => getModules(subject.slug).map((module) => aliasModule(module, subject)))
    .sort((left, right) => {
      const sourceOrder = compareBySourceOrder(left, right)
      if (sourceOrder !== 0) return sourceOrder
      return left.order - right.order
    })
}

export function getTopicFrameworks(slug: string): Framework[] {
  return getRelatedSubjectsForEntity("topic", slug)
    .flatMap((subject) =>
      getFrameworks(subject.slug).map((framework) => aliasFramework(framework, subject))
    )
    .sort((left, right) => {
      const sourceOrder = compareBySourceOrder(left, right)
      if (sourceOrder !== 0) return sourceOrder
      return left.name.localeCompare(right.name)
    })
}

export function getTopicProjects(slug: string): Project[] {
  return getRelatedSubjectsForEntity("topic", slug)
    .flatMap((subject) =>
      getProjects(subject.slug).map((project) => aliasProject(project, subject))
    )
    .sort((left, right) => {
      const sourceOrder = compareBySourceOrder(left, right)
      if (sourceOrder !== 0) return sourceOrder
      return left.difficulty - right.difficulty || left.title.localeCompare(right.title)
    })
}

export function getTopicProject(slug: string, projectSlug: string): Project | null {
  const parsed = parseAliasedSlug(projectSlug)
  if (!parsed) return null

  const subject = getSubject(parsed.sourceSlug)
  const project = getProject(parsed.sourceSlug, parsed.originalSlug)
  if (!subject || !project) return null

  return aliasProject(project, subject)
}

export function getTopicTools(slug: string): Tool[] {
  return getRelatedSubjectsForEntity("topic", slug)
    .flatMap((subject) => getTools(subject.slug).map((tool) => aliasTool(tool, subject)))
    .sort((left, right) => {
      const sourceOrder = compareBySourceOrder(left, right)
      if (sourceOrder !== 0) return sourceOrder
      return left.name.localeCompare(right.name)
    })
}

export function getTopicTool(slug: string, toolSlug: string): Tool | null {
  const parsed = parseAliasedSlug(toolSlug)
  if (!parsed) return null

  const subject = getSubject(parsed.sourceSlug)
  const tool = getTool(parsed.sourceSlug, parsed.originalSlug)
  if (!subject || !tool) return null

  return aliasTool(tool, subject)
}

export function getRoleStats(slug: string): EntityStats {
  return {
    modules: getRoleModules(slug).length,
    lessons: getRoleLessons(slug).length,
    frameworks: getRoleFrameworks(slug).length,
    projects: getRoleProjects(slug).length,
    tools: getRoleTools(slug).length,
    dayInLife: getRoleDayInLifeScenarios(slug).length,
    sections: 0,
  }
}

export function getTopicStats(slug: string): EntityStats {
  return {
    modules: getTopicSourceModules(slug).length,
    lessons: 0,
    frameworks: getTopicFrameworks(slug).length,
    projects: getTopicProjects(slug).length,
    tools: getTopicTools(slug).length,
    dayInLife: 0,
    sections: getTopicSections(slug).length,
  }
}
