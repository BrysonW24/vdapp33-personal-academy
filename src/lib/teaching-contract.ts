import {
  TEACHING_STAGE_ORDER,
  type Module,
  type TeachingStage,
} from "@/types/curriculum"

export const TEACHING_STAGE_META: Record<
  TeachingStage,
  { label: string; description: string }
> = {
  orientation: {
    label: "Orientation",
    description: "Start with the shape of the field so you know what you are looking at.",
  },
  "mental-models": {
    label: "Mental Models",
    description: "Learn the compact models and tradeoffs that make the field memorable.",
  },
  frameworks: {
    label: "Frameworks",
    description: "Use repeatable lenses and comparison structures instead of memorising noise.",
  },
  processes: {
    label: "Processes",
    description: "Trace how the field actually moves from trigger to outcome.",
  },
  applications: {
    label: "Applications",
    description: "See where the ideas show up in real institutions, systems, and decisions.",
  },
  careers: {
    label: "Careers",
    description: "Understand what people in the field do, see, and get paid to handle.",
  },
  "go-deeper": {
    label: "Go Deeper",
    description: "Branch into more specific or contested terrain when curiosity is ready.",
  },
}

export const TEACHING_CONTRACT_STEPS = TEACHING_STAGE_ORDER.map((slug) => ({
  slug,
  label: TEACHING_STAGE_META[slug].label,
  description: TEACHING_STAGE_META[slug].description,
}))

function teachingStageRank(stage?: TeachingStage) {
  if (!stage) return 999
  return TEACHING_STAGE_ORDER.indexOf(stage)
}

export function usesTeachingContract(modules: Module[]) {
  return modules.some((module) => Boolean(module.teachingStage))
}

export function sortModulesForDisplay(modules: Module[]) {
  return [...modules].sort((left, right) => {
    const leftRank = teachingStageRank(left.teachingStage)
    const rightRank = teachingStageRank(right.teachingStage)

    if (leftRank !== rightRank) return leftRank - rightRank
    return (left.levelNumber ?? left.order) - (right.levelNumber ?? right.order)
  })
}

export function groupModulesByTeachingStage(modules: Module[]) {
  const ordered = sortModulesForDisplay(modules)
  const grouped = new Map<TeachingStage, Module[]>()

  for (const stage of TEACHING_STAGE_ORDER) {
    grouped.set(stage, [])
  }

  for (const entry of ordered) {
    if (!entry.teachingStage) continue
    grouped.get(entry.teachingStage)?.push(entry)
  }

  return grouped
}
