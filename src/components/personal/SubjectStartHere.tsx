import Link from "next/link"
import type { ReactNode } from "react"
import {
  ArrowRight,
  BookOpen,
  Clock3,
  FolderKanban,
  Landmark,
  Library,
  Map,
  Wrench,
  type LucideIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Module, Project, SubjectManifest, Tool } from "@/types/curriculum"
import { TEACHING_CONTRACT_STEPS } from "@/lib/teaching-contract"
import { getSubjectDeepDiveCards } from "@/lib/subject-deep-dives"

interface SubjectStartHereProps {
  subject: SubjectManifest
  stats: {
    modules: number
    lessons: number
    frameworks: number
    projects: number
    tools: number
    dayInLife: number
  }
  firstModule: Module | null
  featuredProject: Project | null
  featuredTool: Tool | null
  visualPrimer?: ReactNode
  guideRail?: ReactNode
}

type SectionCard = {
  href: string
  label: string
  title: string
  description: string
  count?: number
  badgeText?: string
  emptyState: string
  icon: LucideIcon
}

export function SubjectStartHere({
  subject,
  stats,
  firstModule,
  featuredProject,
  featuredTool,
  visualPrimer,
  guideRail,
}: SubjectStartHereProps) {
  const deepDiveCards = getSubjectDeepDiveCards(subject)
  const featuredDeepDive = deepDiveCards[0] ?? null
  const deepDiveIconMap: Record<string, LucideIcon> = {
    Landmark,
    Map,
  }
  const sections: SectionCard[] = [
    ...deepDiveCards.map((page) => ({
      href: page.href,
      label: "Master Map",
      title: page.label,
      description: page.description,
      badgeText: "Flagship",
      emptyState: "Deep-dive views have not landed for this subject yet.",
      icon: deepDiveIconMap[page.icon] ?? Map,
    })),
    {
      href: `/${subject.slug}/blueprint`,
      label: "Map",
      title: "Blueprint",
      description: "See the subject arc and how the modules build on one another.",
      count: stats.modules,
      emptyState: "The blueprint is generated from module order as content lands.",
      icon: Map,
    },
    {
      href: `/${subject.slug}/modules`,
      label: "Core",
      title: "Modules",
      description: "Work through the structured curriculum from foundations to advanced ideas.",
      count: stats.modules,
      emptyState: "Module content has not landed yet.",
      icon: BookOpen,
    },
    {
      href: `/${subject.slug}/projects`,
      label: "Practice",
      title: "Projects",
      description: "Turn ideas into concrete work so the subject becomes usable knowledge.",
      count: stats.projects,
      emptyState: "This first migration is still thin on projects for this subject.",
      icon: FolderKanban,
    },
    {
      href: `/${subject.slug}/tools`,
      label: "Ecosystem",
      title: "Tools",
      description: "Learn the software, instruments, and platforms people in the field actually use.",
      count: stats.tools,
      emptyState: "Tool coverage has not been migrated for this subject yet.",
      icon: Wrench,
    },
    {
      href: `/${subject.slug}/toolkit`,
      label: "Mental Models",
      title: "Toolkit",
      description: "Open frameworks and reusable ways of thinking drawn from the subject.",
      count: stats.frameworks,
      emptyState: "Framework coverage is still sparse in this first pass.",
      icon: Library,
    },
    {
      href: `/${subject.slug}/day-in-the-life`,
      label: "Applied Reality",
      title: "Day in the Life",
      description: "See what the subject feels like in practice through real-world roles and routines.",
      count: stats.dayInLife,
      emptyState: "Career snapshots have not been migrated for this subject yet.",
      icon: Clock3,
    },
  ]

  const primaryHref = featuredDeepDive
    ? featuredDeepDive.href
    : firstModule
      ? `/${subject.slug}/modules/${firstModule.slug}`
      : `/${subject.slug}/blueprint`
  const primaryLabel = featuredDeepDive
    ? `Open ${featuredDeepDive.label}`
    : firstModule
      ? "Start the first module"
      : "Open the blueprint"

  return (
    <div className="container mx-auto px-4 py-5 space-y-4">
      <section className="grid gap-3 lg:grid-cols-[1.25fr,0.75fr]">
        <div className="rounded-[18px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.78)] shadow-editorial-soft backdrop-blur-[18px] p-5">
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <Badge
              className="border-transparent"
              style={{ backgroundColor: `${subject.color}18`, color: subject.color }}
            >
              {subject.shortName}
            </Badge>
            <Badge variant="outline">{stats.modules} modules</Badge>
            <Badge variant="outline">{stats.lessons} lessons</Badge>
            <Badge variant="outline">{stats.frameworks} frameworks</Badge>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-editorial-ink mb-2">
            {subject.name}
          </h1>
          <p className="text-sm text-editorial-muted leading-relaxed max-w-2xl">
            {subject.tagline}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild>
              <Link href={primaryHref}>
                {primaryLabel}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href={firstModule ? `/${subject.slug}/modules` : `/${subject.slug}/blueprint`}>
                {firstModule ? "Open all modules" : "See the subject arc"}
              </Link>
            </Button>
          </div>
        </div>

        <div className="rounded-[18px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,252,247,0.78)] shadow-editorial-soft backdrop-blur-[18px] p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted mb-3">
            Start Here
          </p>
          <h2 className="font-serif text-xl font-semibold text-editorial-ink mb-2">
            Learn for understanding first
          </h2>
          <p className="text-sm text-editorial-muted leading-relaxed mb-4">
            Nexus is intentionally learning-first. Use the blueprint to orient
            yourself, lock in the mental models, then branch into processes,
            projects, tools, and real-world context when the subject is ready.
          </p>
          <div className="space-y-3 text-sm text-editorial-muted">
            {TEACHING_CONTRACT_STEPS.map((step, index) => (
              <div key={step.slug} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-editorial-ink shadow-sm">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium text-editorial-ink">{step.label}</p>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {visualPrimer ? visualPrimer : null}

      <section className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon
          const hasContent =
            typeof section.count === "number" ? section.count > 0 : true

          return (
            <Link
              key={section.href}
              href={section.href}
              className="rounded-[16px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.78)] shadow-editorial-soft backdrop-blur-[18px] p-4 hover:shadow-editorial-hover transition-shadow"
            >
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-[14px]"
                    style={{ backgroundColor: `${subject.color}16`, color: subject.color }}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                      {section.label}
                    </p>
                    <h3 className="font-serif text-xl font-semibold text-editorial-ink">
                      {section.title}
                    </h3>
                  </div>
                </div>
                <Badge variant={hasContent || section.badgeText ? "secondary" : "coming-soon"}>
                  {section.badgeText
                    ? section.badgeText
                    : hasContent
                      ? `${section.count} items`
                      : "Thin"}
                </Badge>
              </div>

              <p className="text-sm text-editorial-muted leading-relaxed">
                {section.description}
              </p>
              <p className="text-xs text-editorial-muted mt-4">
                {hasContent ? "Open section" : section.emptyState}
              </p>
            </Link>
          )
        })}
      </section>

      {(firstModule || featuredProject || featuredTool) && (
        <section className="grid gap-2 lg:grid-cols-3">
          {firstModule && (
            <Link
              href={`/${subject.slug}/modules/${firstModule.slug}`}
              className="rounded-[16px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.78)] p-4 shadow-editorial-soft hover:shadow-editorial-hover transition-shadow"
            >
              <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted mb-2">
                First Module
              </p>
              <h3 className="font-serif text-xl font-semibold text-editorial-ink mb-2">
                {firstModule.title}
              </h3>
              <p className="text-sm text-editorial-muted line-clamp-3">
                {firstModule.shortSummary}
              </p>
            </Link>
          )}

          {featuredProject && (
            <Link
              href={`/${subject.slug}/projects/${featuredProject.slug}`}
              className="rounded-[16px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.78)] p-4 shadow-editorial-soft hover:shadow-editorial-hover transition-shadow"
            >
              <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted mb-2">
                Applied Project
              </p>
              <h3 className="font-serif text-xl font-semibold text-editorial-ink mb-2">
                {featuredProject.title}
              </h3>
              <p className="text-sm text-editorial-muted line-clamp-3">
                {featuredProject.description}
              </p>
            </Link>
          )}

          {featuredTool && (
            <Link
              href={`/${subject.slug}/tools/${featuredTool.slug}`}
              className="rounded-[16px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.78)] p-4 shadow-editorial-soft hover:shadow-editorial-hover transition-shadow"
            >
              <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted mb-2">
                Tool Spotlight
              </p>
              <h3 className="font-serif text-xl font-semibold text-editorial-ink mb-2">
                {featuredTool.name}
              </h3>
              <p className="text-sm text-editorial-muted line-clamp-3">
                {featuredTool.description}
              </p>
            </Link>
          )}
        </section>
      )}

      {guideRail ? guideRail : null}
    </div>
  )
}
