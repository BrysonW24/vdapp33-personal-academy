import { ModuleCard } from "@/components/academy/cards/ModuleCard"
import {
  TEACHING_CONTRACT_STEPS,
  groupModulesByTeachingStage,
  usesTeachingContract,
} from "@/lib/teaching-contract"
import type { Module, SubjectLevel, TeachingStage } from "@/types/curriculum"

const LEVEL_ORDER: SubjectLevel[] = ["beginner", "intermediate", "advanced"]

const LEVEL_META: Record<
  SubjectLevel,
  {
    label: string
    kicker: string
    description: string
  }
> = {
  beginner: {
    label: "Beginner",
    kicker: "Foundations",
    description: "Start with the shape of the field, the core language, and the first working models.",
  },
  intermediate: {
    label: "Intermediate",
    kicker: "Working fluency",
    description: "Move from recognition into practical judgment, repeated patterns, and stronger comparisons.",
  },
  advanced: {
    label: "Advanced",
    kicker: "Synthesis",
    description: "Use the field at full resolution across edge cases, higher stakes, and deeper integration.",
  },
}

interface GroupedModuleIndexProps {
  eyebrow: string
  title: string
  description: string
  modules: Module[]
  basePath: string
  emptyState: string
  subjectSlug?: string
  themeColor?: string
}

interface ModuleGroup {
  key: string
  label: string
  kicker: string
  description: string
  modules: Module[]
}

function sortModules(modules: Module[]) {
  return [...modules].sort((left, right) => {
    const leftRank = left.levelNumber ?? left.order
    const rightRank = right.levelNumber ?? right.order

    if (leftRank !== rightRank) return leftRank - rightRank
    return left.title.localeCompare(right.title)
  })
}

function buildTeachingStageGroups(modules: Module[]): ModuleGroup[] {
  const grouped = groupModulesByTeachingStage(modules)

  const stageGroups: ModuleGroup[] = TEACHING_CONTRACT_STEPS.map((step) => ({
    key: step.slug,
    label: step.label,
    kicker: "Teaching contract",
    description: step.description,
    modules: sortModules(grouped.get(step.slug as TeachingStage) ?? []),
  })).filter((group) => group.modules.length > 0)

  const unstaged = sortModules(modules.filter((module) => !module.teachingStage))
  if (unstaged.length > 0) {
    stageGroups.push({
      key: "additional",
      label: "Additional modules",
      kicker: "Ungrouped",
      description: "These modules are still useful, but they have not been mapped to a teaching-contract stage yet.",
      modules: unstaged,
    })
  }

  return stageGroups
}

function buildLevelGroups(modules: Module[]): ModuleGroup[] {
  return LEVEL_ORDER.map((level) => ({
    key: level,
    label: LEVEL_META[level].label,
    kicker: LEVEL_META[level].kicker,
    description: LEVEL_META[level].description,
    modules: sortModules(modules.filter((module) => module.level === level)),
  })).filter((group) => group.modules.length > 0)
}

function describeSourceSpread(modules: Module[]) {
  const sourceCount = new Set(
    modules
      .map((module) => module.sourceMeta?.sourceSlug)
      .filter((value): value is string => Boolean(value))
  ).size

  if (sourceCount === 0) return null
  if (sourceCount === 1) return "Built from 1 source subject"
  return `Built from ${sourceCount} source subjects`
}

function getMapModeLabel(modules: Module[]) {
  return usesTeachingContract(modules) ? "Grouped by teaching contract" : "Grouped by level"
}

export function GroupedModuleIndex({
  eyebrow,
  title,
  description,
  modules,
  basePath,
  emptyState,
  subjectSlug,
  themeColor = "#2C6AA0",
}: GroupedModuleIndexProps) {
  const groupedModules = usesTeachingContract(modules)
    ? buildTeachingStageGroups(modules)
    : buildLevelGroups(modules)

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-4xl">
        <p className="mb-2 text-xs uppercase tracking-[0.18em] text-editorial-muted">
          {eyebrow}
        </p>
        <h1 className="font-serif text-3xl font-semibold text-editorial-ink sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-editorial-muted">
          {description}
        </p>
      </div>

      {modules.length === 0 ? (
        <div className="mt-10 rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.78)] p-12 text-center">
          <p className="text-lg text-editorial-muted">{emptyState}</p>
        </div>
      ) : (
        <div className="mt-10 space-y-10">
          <section className="rounded-[28px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.8)] p-6 shadow-editorial-soft sm:p-8">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                  Learning map
                </p>
                <h2 className="mt-2 font-serif text-2xl font-semibold text-editorial-ink">
                  Progress through the surface cleanly
                </h2>
              </div>
              <p className="max-w-2xl text-sm leading-relaxed text-editorial-muted">
                {getMapModeLabel(modules)} so the index reads like a progression, not a wall of cards.
              </p>
            </div>

            <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
              {groupedModules.map((group, index) => (
                <div
                  key={group.key}
                  className="min-w-[220px] flex-1 rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,252,247,0.84)] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className="inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-semibold"
                      style={{
                        backgroundColor: `${themeColor}14`,
                        color: themeColor,
                      }}
                    >
                      {index + 1}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.16em] text-editorial-muted">
                      {group.kicker}
                    </span>
                  </div>
                  <h3 className="mt-4 font-serif text-xl font-semibold text-editorial-ink">
                    {group.label}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-editorial-muted">
                    {group.description}
                  </p>
                  <p className="mt-4 text-xs font-medium uppercase tracking-[0.16em] text-editorial-muted">
                    {group.modules.length} module{group.modules.length === 1 ? "" : "s"}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {groupedModules.map((group) => {
            const sourceSpread = describeSourceSpread(group.modules)

            return (
              <section
                key={group.key}
                className="border-t border-[rgba(44,49,59,0.08)] pt-8"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                      {group.kicker}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <h2 className="font-serif text-2xl font-semibold text-editorial-ink sm:text-3xl">
                        {group.label}
                      </h2>
                      <span
                        className="inline-flex rounded-full px-3 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: `${themeColor}14`,
                          color: themeColor,
                        }}
                      >
                        {group.modules.length} module{group.modules.length === 1 ? "" : "s"}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-editorial-muted sm:text-base">
                      {group.description}
                    </p>
                  </div>

                  {sourceSpread ? (
                    <p className="text-xs uppercase tracking-[0.16em] text-editorial-muted">
                      {sourceSpread}
                    </p>
                  ) : null}
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {group.modules.map((module) => (
                    <ModuleCard
                      key={module.slug}
                      module={module}
                      subjectSlug={subjectSlug}
                      basePath={basePath}
                    />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
