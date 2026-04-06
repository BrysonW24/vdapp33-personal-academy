import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export interface QuizResult {
  score: number
  total: number
}

export interface SubjectProgress {
  completedModules: string[]
  completedLessons: string[]
  completedProjects: string[]
  completedFrameworks: string[]
  viewedTools: string[]
  quizResults: Record<string, QuizResult>
}

const EMPTY_SUBJECT: SubjectProgress = {
  completedModules: [],
  completedLessons: [],
  completedProjects: [],
  completedFrameworks: [],
  viewedTools: [],
  quizResults: {},
}

const LEGACY = "_legacy"
const NEXUS_PROGRESS_KEY = "nexus-progress"
const LEGACY_PROGRESS_KEY = "personal-academy-progress"
const SUBJECT_ALIASES: Record<string, string> = {
  quantum: "quantum-science",
}

function resolveSubjectSlug(subject: string) {
  return SUBJECT_ALIASES[subject] ?? subject
}

function mergeSubjectProgress(
  base: SubjectProgress,
  overlay: SubjectProgress
): SubjectProgress {
  return {
    completedModules: addUniqueArrays(base.completedModules, overlay.completedModules),
    completedLessons: addUniqueArrays(base.completedLessons, overlay.completedLessons),
    completedProjects: addUniqueArrays(base.completedProjects, overlay.completedProjects),
    completedFrameworks: addUniqueArrays(
      base.completedFrameworks,
      overlay.completedFrameworks
    ),
    viewedTools: addUniqueArrays(base.viewedTools, overlay.viewedTools),
    quizResults: {
      ...overlay.quizResults,
      ...base.quizResults,
    },
  }
}

function addUniqueArrays(existing: string[], incoming: string[]) {
  return incoming.reduce((acc, item) => addUnique(acc, item), [...existing])
}

function normalizeSubjectProgressMap(
  subjects: Record<string, SubjectProgress>
): Record<string, SubjectProgress> {
  const normalized: Record<string, SubjectProgress> = {}

  Object.entries(subjects).forEach(([subject, progress]) => {
    const resolved = resolveSubjectSlug(subject)

    if (!normalized[resolved]) {
      normalized[resolved] = { ...progress }
      return
    }

    normalized[resolved] = mergeSubjectProgress(normalized[resolved], progress)
  })

  return normalized
}

export interface ProgressState {
  subjects: Record<string, SubjectProgress>
  completeModule: (subjectOrSlug: string, slug?: string) => void
  completeLesson: (subjectOrSlug: string, slug?: string) => void
  completeProject: (subjectOrSlug: string, slug?: string) => void
  completeFramework: (subjectOrSlug: string, slug?: string) => void
  viewTool: (subjectOrSlug: string, slug?: string) => void
  saveQuizResult: (
    subjectOrLessonSlug: string,
    lessonSlugOrScore: string | number,
    scoreOrTotal?: number,
    total?: number
  ) => void
  reset: () => void
  getSubjectProgress: (subject: string) => SubjectProgress
  isModuleComplete: (subjectOrSlug: string, slug?: string) => boolean
  isLessonComplete: (subjectOrSlug: string, slug?: string) => boolean
  isProjectComplete: (subjectOrSlug: string, slug?: string) => boolean
  completedModules: string[]
  completedLessons: string[]
  completedProjects: string[]
  completedFrameworks: string[]
  viewedTools: string[]
  quizResults: Record<string, QuizResult>
}

type PersistedProgressState = Pick<
  ProgressState,
  | "subjects"
  | "completedModules"
  | "completedLessons"
  | "completedProjects"
  | "completedFrameworks"
  | "viewedTools"
  | "quizResults"
>

interface LegacyPersistedProgressState {
  subjects?: Record<string, SubjectProgress>
  completedModules?: string[]
  completedLessons?: string[]
  completedProjects?: string[]
  completedFrameworks?: string[]
  viewedTools?: string[]
  quizResults?: Record<string, QuizResult>
}

function ensureSubject(
  subjects: Record<string, SubjectProgress>,
  subject: string
): SubjectProgress {
  return subjects[subject] ?? { ...EMPTY_SUBJECT }
}

function addUnique(arr: string[], item: string): string[] {
  return arr.includes(item) ? arr : [...arr, item]
}

function aggregateSubjects(subjects: Record<string, SubjectProgress>) {
  const completedModules = new Set<string>()
  const completedLessons = new Set<string>()
  const completedProjects = new Set<string>()
  const completedFrameworks = new Set<string>()
  const viewedTools = new Set<string>()
  const quizResults: Record<string, QuizResult> = {}

  Object.values(subjects).forEach((subject) => {
    subject.completedModules.forEach((slug) => completedModules.add(slug))
    subject.completedLessons.forEach((slug) => completedLessons.add(slug))
    subject.completedProjects.forEach((slug) => completedProjects.add(slug))
    subject.completedFrameworks.forEach((slug) =>
      completedFrameworks.add(slug)
    )
    subject.viewedTools.forEach((slug) => viewedTools.add(slug))

    Object.entries(subject.quizResults).forEach(([slug, result]) => {
      quizResults[slug] = result
    })
  })

  return {
    completedModules: [...completedModules],
    completedLessons: [...completedLessons],
    completedProjects: [...completedProjects],
    completedFrameworks: [...completedFrameworks],
    viewedTools: [...viewedTools],
    quizResults,
  }
}

function buildSnapshot(subjects: Record<string, SubjectProgress>) {
  const normalizedSubjects = normalizeSubjectProgressMap(subjects)

  return {
    subjects: normalizedSubjects,
    ...aggregateSubjects(normalizedSubjects),
  }
}

export function migrateProgressState(
  persisted: LegacyPersistedProgressState | undefined
) {
  if (!persisted) return buildSnapshot({})

  if (persisted.subjects) {
    return buildSnapshot(persisted.subjects)
  }

  const legacySubject: SubjectProgress = {
    completedModules: persisted.completedModules ?? [],
    completedLessons: persisted.completedLessons ?? [],
    completedProjects: persisted.completedProjects ?? [],
    completedFrameworks: persisted.completedFrameworks ?? [],
    viewedTools: persisted.viewedTools ?? [],
    quizResults: persisted.quizResults ?? {},
  }

  const hasLegacyData =
    legacySubject.completedModules.length > 0 ||
    legacySubject.completedLessons.length > 0 ||
    legacySubject.completedProjects.length > 0 ||
    legacySubject.completedFrameworks.length > 0 ||
    legacySubject.viewedTools.length > 0 ||
    Object.keys(legacySubject.quizResults).length > 0

  return buildSnapshot(hasLegacyData ? { [LEGACY]: legacySubject } : {})
}

const progressStorage = createJSONStorage<PersistedProgressState>(() => ({
  getItem: (name) => {
    if (typeof window === "undefined") return null
    return (
      window.localStorage.getItem(name) ??
      window.localStorage.getItem(LEGACY_PROGRESS_KEY)
    )
  },
  setItem: (name, value) => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(name, value)
  },
  removeItem: (name) => {
    if (typeof window === "undefined") return
    window.localStorage.removeItem(name)
  },
}))

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...buildSnapshot({}),

      completeModule: (subjectOrSlug, slug?) => {
        const [subject, targetSlug] = slug
          ? [resolveSubjectSlug(subjectOrSlug), slug]
          : [LEGACY, subjectOrSlug]

        set((state) => {
          const progress = ensureSubject(state.subjects, subject)
          return buildSnapshot({
            ...state.subjects,
            [subject]: {
              ...progress,
              completedModules: addUnique(progress.completedModules, targetSlug),
            },
          })
        })
      },

      completeLesson: (subjectOrSlug, slug?) => {
        const [subject, targetSlug] = slug
          ? [resolveSubjectSlug(subjectOrSlug), slug]
          : [LEGACY, subjectOrSlug]

        set((state) => {
          const progress = ensureSubject(state.subjects, subject)
          return buildSnapshot({
            ...state.subjects,
            [subject]: {
              ...progress,
              completedLessons: addUnique(progress.completedLessons, targetSlug),
            },
          })
        })
      },

      completeProject: (subjectOrSlug, slug?) => {
        const [subject, targetSlug] = slug
          ? [resolveSubjectSlug(subjectOrSlug), slug]
          : [LEGACY, subjectOrSlug]

        set((state) => {
          const progress = ensureSubject(state.subjects, subject)
          return buildSnapshot({
            ...state.subjects,
            [subject]: {
              ...progress,
              completedProjects: addUnique(progress.completedProjects, targetSlug),
            },
          })
        })
      },

      completeFramework: (subjectOrSlug, slug?) => {
        const [subject, targetSlug] = slug
          ? [resolveSubjectSlug(subjectOrSlug), slug]
          : [LEGACY, subjectOrSlug]

        set((state) => {
          const progress = ensureSubject(state.subjects, subject)
          return buildSnapshot({
            ...state.subjects,
            [subject]: {
              ...progress,
              completedFrameworks: addUnique(
                progress.completedFrameworks,
                targetSlug
              ),
            },
          })
        })
      },

      viewTool: (subjectOrSlug, slug?) => {
        const [subject, targetSlug] = slug
          ? [resolveSubjectSlug(subjectOrSlug), slug]
          : [LEGACY, subjectOrSlug]

        set((state) => {
          const progress = ensureSubject(state.subjects, subject)
          return buildSnapshot({
            ...state.subjects,
            [subject]: {
              ...progress,
              viewedTools: addUnique(progress.viewedTools, targetSlug),
            },
          })
        })
      },

      saveQuizResult: (a, b, c?, d?) => {
        const [subject, lessonSlug, score, total] =
          typeof b === "string"
            ? [resolveSubjectSlug(a), b, c as number, d as number]
            : [LEGACY, a, b as number, c as number]

        set((state) => {
          const progress = ensureSubject(state.subjects, subject)
          return buildSnapshot({
            ...state.subjects,
            [subject]: {
              ...progress,
              quizResults: {
                ...progress.quizResults,
                [lessonSlug]: { score, total },
              },
            },
          })
        })
      },

      reset: () => set(buildSnapshot({})),

      getSubjectProgress: (subject) =>
        get().subjects[resolveSubjectSlug(subject)] ?? { ...EMPTY_SUBJECT },

      isModuleComplete: (subjectOrSlug, slug?) => {
        const [subject, targetSlug] = slug
          ? [resolveSubjectSlug(subjectOrSlug), slug]
          : [LEGACY, subjectOrSlug]

        return (get().subjects[subject]?.completedModules ?? []).includes(targetSlug)
      },

      isLessonComplete: (subjectOrSlug, slug?) => {
        const [subject, targetSlug] = slug
          ? [resolveSubjectSlug(subjectOrSlug), slug]
          : [LEGACY, subjectOrSlug]

        return (get().subjects[subject]?.completedLessons ?? []).includes(targetSlug)
      },

      isProjectComplete: (subjectOrSlug, slug?) => {
        const [subject, targetSlug] = slug
          ? [resolveSubjectSlug(subjectOrSlug), slug]
          : [LEGACY, subjectOrSlug]

        return (get().subjects[subject]?.completedProjects ?? []).includes(targetSlug)
      },
    }),
    {
      name: NEXUS_PROGRESS_KEY,
      version: 1,
      storage: progressStorage,
      partialize: (state): PersistedProgressState => ({
        subjects: state.subjects,
        completedModules: state.completedModules,
        completedLessons: state.completedLessons,
        completedProjects: state.completedProjects,
        completedFrameworks: state.completedFrameworks,
        viewedTools: state.viewedTools,
        quizResults: state.quizResults,
      }),
      migrate: (persistedState) =>
        migrateProgressState(persistedState as LegacyPersistedProgressState | undefined),
    }
  )
)

export const DOMAIN_GROUPS: Record<
  string,
  { label: string; color: string; modules: string[] }
> = {}
