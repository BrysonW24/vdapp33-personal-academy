import type { SubjectProgress } from "@/lib/progress"
import type {
  AcademyCatalog,
  AcademyEntityCatalogItem,
  ArchetypeProfile,
  ArchetypeSlug,
  IntensityLevel,
  LearningBlueprint,
  LearningMode,
  NextBestAction,
  OnboardingQuestionBank,
  PathOption,
  PathOptionKind,
  PathState,
  ReviewEntry,
  SessionStyle,
  StructurePreference,
  TodaySession,
  UserProfile,
} from "@/types/guidance"
import { ARCHETYPE_SLUGS } from "@/types/guidance"

type AnswerMap = Record<string, string[]>
type ReflectionMap = Record<string, string>

interface CountMap<T extends string> {
  [key: string]: number
}

interface ProgressSnapshot {
  subjects: Record<string, SubjectProgress>
}

function humanize(value: string) {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function pushCounts<T extends string>(items: T[], target: CountMap<T>) {
  items.forEach((item) => {
    target[item] = (target[item] ?? 0) + 1
  })
}

function rankCounts<T extends string>(counts: CountMap<T>) {
  return Object.entries(counts)
    .sort((left, right) => {
      if (right[1] !== left[1]) return right[1] - left[1]
      return left[0].localeCompare(right[0])
    })
    .map(([slug]) => slug as T)
}

function getOptionLookup(questionBank: OnboardingQuestionBank) {
  const lookup = new Map<string, NonNullable<NonNullable<OnboardingQuestionBank["steps"][number]["questions"][number]["options"]>[number]>>()

  questionBank.steps.forEach((step) => {
    step.questions.forEach((question) => {
      question.options?.forEach((option) => {
        lookup.set(option.id, option)
      })
    })
  })

  return lookup
}

function getRankedArchetypes(scores: Record<ArchetypeSlug, number>) {
  return [...ARCHETYPE_SLUGS].sort((left, right) => {
    const delta = (scores[right] ?? 0) - (scores[left] ?? 0)
    if (delta !== 0) return delta
    return ARCHETYPE_SLUGS.indexOf(left) - ARCHETYPE_SLUGS.indexOf(right)
  })
}

function getWinningValue<T extends string>(counts: CountMap<T>, fallback: T): T {
  return rankCounts(counts)[0] ?? fallback
}

function average(numbers: number[], fallback: number) {
  if (!numbers.length) return fallback
  return Math.round(numbers.reduce((sum, value) => sum + value, 0) / numbers.length)
}

function dedupe<T>(items: T[]) {
  return Array.from(new Set(items))
}

function mergeRankedPreferences(
  preferred: string[],
  defaults: string[],
  available: string[]
) {
  const allowed = new Set(available)
  return dedupe([...preferred, ...defaults]).filter((slug) => allowed.has(slug))
}

function getCatalogEntity(
  catalog: AcademyCatalog,
  kind: "subject" | "topic" | "role",
  slug: string
) {
  const collection =
    kind === "subject"
      ? catalog.subjects
      : kind === "topic"
        ? catalog.topics
        : catalog.roles

  return collection.find((entry) => entry.slug === slug) ?? null
}

function getPrimaryProject(catalog: AcademyCatalog, subjectSlug: string) {
  const subject = getCatalogEntity(catalog, "subject", subjectSlug)
  if (!subject?.firstProjectSlug || !subject.firstProjectTitle) return null

  return {
    subjectSlug,
    projectSlug: subject.firstProjectSlug,
    title: subject.firstProjectTitle,
  }
}

function replaceMilestoneTemplate(
  template: string,
  catalog: AcademyCatalog,
  values: {
    coreSubject: string
    supportingTopic: string
    role: string
  }
) {
  const coreLabel =
    getCatalogEntity(catalog, "subject", values.coreSubject)?.name ??
    humanize(values.coreSubject)
  const topicLabel =
    getCatalogEntity(catalog, "topic", values.supportingTopic)?.name ??
    humanize(values.supportingTopic)
  const roleLabel =
    getCatalogEntity(catalog, "role", values.role)?.name ?? humanize(values.role)

  return template
    .replaceAll("{coreSubject}", coreLabel)
    .replaceAll("{supportingTopic}", topicLabel)
    .replaceAll("{role}", roleLabel)
}

export function buildUserProfile(
  questionBank: OnboardingQuestionBank,
  answers: AnswerMap,
  reflections: ReflectionMap
): UserProfile {
  const optionLookup = getOptionLookup(questionBank)
  const selectedOptionIds = dedupe(Object.values(answers).flat())
  const scores = Object.fromEntries(
    ARCHETYPE_SLUGS.map((slug) => [slug, 0])
  ) as Record<ArchetypeSlug, number>

  const subjectCounts: CountMap<string> = {}
  const topicCounts: CountMap<string> = {}
  const roleCounts: CountMap<string> = {}
  const modeCounts: CountMap<LearningMode> = {}
  const intensityCounts: CountMap<IntensityLevel> = {}
  const sessionStyleCounts: CountMap<SessionStyle> = {}
  const structureCounts: CountMap<StructurePreference> = {}
  const weeklyHours: number[] = []

  selectedOptionIds.forEach((optionId) => {
    const option = optionLookup.get(optionId)
    if (!option) return

    ARCHETYPE_SLUGS.forEach((slug) => {
      scores[slug] += option.weights[slug] ?? 0
    })

    pushCounts(option.signals.subjects, subjectCounts)
    pushCounts(option.signals.topics, topicCounts)
    pushCounts(option.signals.roles, roleCounts)
    pushCounts([option.signals.mode], modeCounts)
    pushCounts([option.signals.intensity], intensityCounts)
    pushCounts([option.signals.sessionStyle], sessionStyleCounts)
    pushCounts([option.signals.structure], structureCounts)
    weeklyHours.push(option.signals.weeklyHours)
  })

  const rankedArchetypes = getRankedArchetypes(scores)

  return {
    selectedOptionIds,
    reflections,
    archetypeScores: scores,
    preferredSubjects: rankCounts(subjectCounts),
    preferredTopics: rankCounts(topicCounts),
    preferredRoles: rankCounts(roleCounts),
    preferredMode: getWinningValue(modeCounts, "guided"),
    intensity: getWinningValue(intensityCounts, "balanced"),
    sessionStyle: getWinningValue(sessionStyleCounts, "deep"),
    structure: getWinningValue(structureCounts, "structured"),
    weeklyHours: average(weeklyHours, 4),
    leadingArchetype: rankedArchetypes[0],
  }
}

function getPracticalArchetype(
  ranked: ArchetypeSlug[],
  available: ArchetypeSlug[]
): ArchetypeSlug {
  const preferred = ranked.find((slug) =>
    ["role-synthesis", "engineered-civilization", "human-systems"].includes(slug)
  )
  return preferred ?? available[0]
}

function chooseVariantSlug(
  ranked: string[],
  fallback: string,
  variant: PathOptionKind,
  predicate?: (slug: string) => boolean
) {
  if (variant === "practical" && predicate) {
    return ranked.find(predicate) ?? fallback
  }

  if (variant === "exploration" && ranked[1]) {
    return ranked[1]
  }

  return ranked[0] ?? fallback
}

function buildPathOption(
  id: PathOptionKind,
  archetype: ArchetypeProfile,
  profile: UserProfile,
  catalog: AcademyCatalog
): PathOption {
  const rankedSubjects = mergeRankedPreferences(
    profile.preferredSubjects,
    archetype.defaults.coreSubjects,
    catalog.subjects.map((entry) => entry.slug)
  )
  const rankedTopics = mergeRankedPreferences(
    profile.preferredTopics,
    archetype.defaults.supportingTopics,
    catalog.topics.map((entry) => entry.slug)
  )
  const rankedRoles = mergeRankedPreferences(
    profile.preferredRoles,
    archetype.defaults.roles,
    catalog.roles.map((entry) => entry.slug)
  )

  const coreSubject = chooseVariantSlug(
    rankedSubjects,
    catalog.subjects[0]?.slug ?? "",
    id,
    (slug) => Boolean(getCatalogEntity(catalog, "subject", slug)?.firstProjectSlug)
  )
  const supportingTopic = chooseVariantSlug(
    rankedTopics,
    catalog.topics[0]?.slug ?? "",
    id
  )
  const roleLens = chooseVariantSlug(
    rankedRoles,
    catalog.roles[0]?.slug ?? "",
    id
  )

  const currentProject = getPrimaryProject(catalog, coreSubject)
  const weeklyCadence = archetype.defaults.weeklyCadencePresets[profile.intensity]
  const currentMilestone = replaceMilestoneTemplate(archetype.defaults.milestoneTemplate, catalog, {
    coreSubject,
    supportingTopic,
    role: roleLens,
  })

  const label =
    id === "recommended"
      ? "Recommended Path"
      : id === "exploration"
        ? "Exploration Path"
        : "Practical Path"

  const summary =
    id === "recommended"
      ? `Start with ${humanize(coreSubject)} as your anchor and use ${humanize(supportingTopic)} as reinforcement.`
      : id === "exploration"
        ? `Keep the same overall direction, but widen the lens through ${humanize(supportingTopic)} and adjacent ideas.`
        : `Bias the system toward action, projects, and embodied judgment through the ${humanize(roleLens)} lens.`

  return {
    id,
    label,
    summary,
    archetype: archetype.slug,
    assignment: {
      coreSubject,
      supportingTopic,
      roleLens,
      currentProject,
      weeklyCadence,
      currentMilestone,
      reviewRhythm: archetype.defaults.reviewRhythm,
    },
    rationale: [
      `Archetype fit: ${archetype.name}.`,
      `Core subject: ${getCatalogEntity(catalog, "subject", coreSubject)?.name ?? humanize(coreSubject)}.`,
      `Supporting topic: ${getCatalogEntity(catalog, "topic", supportingTopic)?.name ?? humanize(supportingTopic)}.`,
      `Role lens: ${getCatalogEntity(catalog, "role", roleLens)?.name ?? humanize(roleLens)}.`,
    ],
  }
}

export function generateLearningBlueprint(params: {
  questionBank: OnboardingQuestionBank
  archetypes: ArchetypeProfile[]
  answers: AnswerMap
  reflections: ReflectionMap
  catalog: AcademyCatalog
}): LearningBlueprint {
  const { questionBank, archetypes, answers, reflections, catalog } = params
  const profile = buildUserProfile(questionBank, answers, reflections)
  const rankedArchetypes = getRankedArchetypes(profile.archetypeScores)

  const availableArchetypes = new Map(archetypes.map((archetype) => [archetype.slug, archetype]))
  const recommendedArchetype =
    availableArchetypes.get(rankedArchetypes[0]) ?? archetypes[0]
  const explorationArchetype =
    availableArchetypes.get(rankedArchetypes[1] ?? rankedArchetypes[0]) ??
    recommendedArchetype
  const practicalArchetype =
    availableArchetypes.get(getPracticalArchetype(rankedArchetypes, archetypes.map((entry) => entry.slug))) ??
    recommendedArchetype

  const options = [
    buildPathOption("recommended", recommendedArchetype, profile, catalog),
    buildPathOption("exploration", explorationArchetype, profile, catalog),
    buildPathOption("practical", practicalArchetype, profile, catalog),
  ]

  return {
    createdAt: new Date().toISOString(),
    leadingArchetype: profile.leadingArchetype,
    profile,
    options,
    activePathId: "recommended",
  }
}

export function getActivePath(blueprint: LearningBlueprint | null) {
  if (!blueprint) return null
  return (
    blueprint.options.find((option) => option.id === blueprint.activePathId) ??
    blueprint.options[0] ??
    null
  )
}

function getCoreProgressPercent(
  activePath: PathOption,
  catalog: AcademyCatalog,
  progress: ProgressSnapshot
) {
  const subject = getCatalogEntity(catalog, "subject", activePath.assignment.coreSubject)
  if (!subject?.moduleCount) return 0

  const completed = progress.subjects[subject.slug]?.completedModules.length ?? 0
  return Math.round((completed / subject.moduleCount) * 100)
}

function getBreadthScore(catalog: AcademyCatalog, progress: ProgressSnapshot) {
  const touchedSubjects = Object.entries(progress.subjects).filter(([, subjectProgress]) => {
    return (
      subjectProgress.completedModules.length > 0 ||
      subjectProgress.completedLessons.length > 0 ||
      subjectProgress.completedProjects.length > 0 ||
      subjectProgress.completedFrameworks.length > 0 ||
      subjectProgress.viewedTools.length > 0
    )
  }).length

  return Math.round((touchedSubjects / Math.max(catalog.subjects.length, 1)) * 100)
}

function getSynthesisScore(progress: ProgressSnapshot) {
  const totals = Object.values(progress.subjects).reduce(
    (acc, subject) => {
      acc.projects += subject.completedProjects.length
      acc.frameworks += subject.completedFrameworks.length
      acc.tools += subject.viewedTools.length
      return acc
    },
    { projects: 0, frameworks: 0, tools: 0 }
  )

  return Math.max(
    0,
    Math.min(100, totals.projects * 25 + totals.frameworks * 10 + totals.tools * 5)
  )
}

function findFirstIncompleteAction(
  activePath: PathOption,
  catalog: AcademyCatalog,
  progress: ProgressSnapshot
): NextBestAction | null {
  const subject = getCatalogEntity(catalog, "subject", activePath.assignment.coreSubject)
  if (!subject?.modules?.length) return null

  const subjectProgress = progress.subjects[subject.slug]

  for (const curriculumModule of subject.modules) {
    const moduleComplete =
      subjectProgress?.completedModules.includes(curriculumModule.slug) ?? false
    const firstIncompleteLesson = curriculumModule.lessons.find(
      (lessonSlug) => !(subjectProgress?.completedLessons.includes(lessonSlug) ?? false)
    )

    if (firstIncompleteLesson) {
      return {
        id: `lesson-${subject.slug}-${firstIncompleteLesson}`,
        title: `Continue ${subject.name}`,
        description: `Pick back up inside ${curriculumModule.title} and move the core subject forward.`,
        href: `/${subject.slug}/modules/${curriculumModule.slug}/${firstIncompleteLesson}`,
        category: "core-subject",
      }
    }

    if (!moduleComplete) {
      return {
        id: `module-${subject.slug}-${curriculumModule.slug}`,
        title: `Open ${curriculumModule.title}`,
        description: `This is the next unfinished module in your core subject path.`,
        href: `/${subject.slug}/modules/${curriculumModule.slug}`,
        category: "core-subject",
      }
    }
  }

  return null
}

function getSignalHref(activePath: PathOption, catalog: AcademyCatalog) {
  const subject = getCatalogEntity(catalog, "subject", activePath.assignment.coreSubject)
  if (subject?.signalAvailable) return `/${subject.slug}/signals`

  const topic = getCatalogEntity(catalog, "topic", activePath.assignment.supportingTopic)
  if (topic?.signalAvailable) return `/topics/${topic.slug}/signals`

  const role = getCatalogEntity(catalog, "role", activePath.assignment.roleLens)
  if (role?.signalAvailable) return `/roles/${role.slug}/signals`

  return "/signals"
}

function buildActionList(
  activePath: PathOption,
  mode: LearningMode,
  catalog: AcademyCatalog,
  progress: ProgressSnapshot,
  reviews: ReviewEntry[]
) {
  const actions: NextBestAction[] = []
  const coreAction = findFirstIncompleteAction(activePath, catalog, progress)
  if (coreAction) actions.push(coreAction)

  const topic = getCatalogEntity(catalog, "topic", activePath.assignment.supportingTopic)
  if (topic) {
    actions.push({
      id: `topic-${topic.slug}`,
      title: `Reinforce with ${topic.name}`,
      description: `Use your supporting topic to widen the current study lane without losing focus.`,
      href: `/topics/${topic.slug}/modules`,
      category: "supporting-topic",
    })
  }

  const role = getCatalogEntity(catalog, "role", activePath.assignment.roleLens)
  if (role) {
    actions.push({
      id: `role-${role.slug}`,
      title: `Think through the ${role.name} lens`,
      description: `Use the role page to keep the knowledge embodied and practical.`,
      href: `/roles/${role.slug}/projects`,
      category: "role-application",
    })
  }

  if (activePath.assignment.currentProject) {
    const { subjectSlug, projectSlug, title } = activePath.assignment.currentProject
    actions.push({
      id: `project-${subjectSlug}-${projectSlug}`,
      title: `Advance ${title}`,
      description: `Projects convert understanding into capability and keep the path from staying abstract.`,
      href: `/${subjectSlug}/projects/${projectSlug}`,
      category: "current-project",
    })
  }

  const lastReview = reviews[0]
  const reviewDue =
    !lastReview ||
    Date.now() - new Date(lastReview.createdAt).getTime() > 1000 * 60 * 60 * 24 * 7

  if (reviewDue) {
    actions.push({
      id: "weekly-review",
      title: "Run a weekly review",
      description: "Capture what changed your model of the world before the week evaporates.",
      href: "/my-path#weekly-review",
      category: "weekly-review",
    })
  }

  const coreSubject = getCatalogEntity(catalog, "subject", activePath.assignment.coreSubject)
  if (coreSubject?.sourceAvailable) {
    actions.push({
      id: `sources-${coreSubject.slug}`,
      title: `Open the ${coreSubject.name} truth stack`,
      description: "See the primary authorities, interpreters, practitioners, and frontier sources that matter here.",
      href: `/${coreSubject.slug}/sources`,
      category: "truth-stack",
    })
  }

  actions.push({
    id: "signals",
    title: "Check your current signals",
    description: "Use curated developments, institutions, and debates to keep the path tied to the real world.",
    href: getSignalHref(activePath, catalog),
    category: "signals",
  })

  const orderMap: Record<LearningMode, NextBestAction["category"][]> = {
    guided: [
      "core-subject",
      "supporting-topic",
      "weekly-review",
      "current-project",
      "truth-stack",
      "signals",
      "role-application",
    ],
    explorer: [
      "supporting-topic",
      "truth-stack",
      "signals",
      "core-subject",
      "role-application",
      "current-project",
      "weekly-review",
    ],
    operator: [
      "current-project",
      "role-application",
      "signals",
      "truth-stack",
      "core-subject",
      "supporting-topic",
      "weekly-review",
    ],
  }

  return actions.sort(
    (left, right) =>
      orderMap[mode].indexOf(left.category) - orderMap[mode].indexOf(right.category)
  )
}

export function buildPathState(params: {
  blueprint: LearningBlueprint | null
  mode: LearningMode
  catalog: AcademyCatalog
  progress: ProgressSnapshot
  reviews: ReviewEntry[]
}): PathState {
  const { blueprint, mode, catalog, progress, reviews } = params
  const activePath = getActivePath(blueprint)

  if (!activePath) {
    return {
      activePath: null,
      mode,
      coreProgressPercent: 0,
      breadthScore: 0,
      depthScore: 0,
      synthesisScore: 0,
      reviewDue: false,
      todaySession: null,
      nextActions: [],
    }
  }

  const coreProgressPercent = getCoreProgressPercent(activePath, catalog, progress)
  const breadthScore = getBreadthScore(catalog, progress)
  const depthScore = coreProgressPercent
  const synthesisScore = getSynthesisScore(progress)
  const nextActions = buildActionList(activePath, mode, catalog, progress, reviews)

  const lastReview = reviews[0]
  const reviewDue =
    !lastReview ||
    Date.now() - new Date(lastReview.createdAt).getTime() > 1000 * 60 * 60 * 24 * 7

  const firstAction = nextActions[0]
  const todaySession: TodaySession | null = firstAction
    ? {
        title: firstAction.title,
        description: firstAction.description,
        href: firstAction.href,
        category: firstAction.category,
      }
    : null

  return {
    activePath,
    mode,
    coreProgressPercent,
    breadthScore,
    depthScore,
    synthesisScore,
    reviewDue,
    todaySession,
    nextActions,
  }
}

export function getEntityPathReason(
  activePath: PathOption | null,
  entity: { kind: "subject" | "topic" | "role"; slug: string; name: string }
) {
  if (!activePath) return null

  if (entity.kind === "subject" && entity.slug === activePath.assignment.coreSubject) {
    return `${entity.name} is your current core subject, so this is where most of your depth work lives right now.`
  }

  if (entity.kind === "topic" && entity.slug === activePath.assignment.supportingTopic) {
    return `${entity.name} is your supporting topic, so it reinforces the current subject without scattering your attention.`
  }

  if (entity.kind === "role" && entity.slug === activePath.assignment.roleLens) {
    return `${entity.name} is your current role lens, so it helps turn abstract knowledge into embodied judgment.`
  }

  return null
}
