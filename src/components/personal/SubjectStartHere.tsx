import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  Clock3,
  FolderKanban,
  Library,
  Map,
  Wrench,
  type LucideIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Module, Project, SubjectManifest, Tool } from "@/types/curriculum"

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
}

type SectionCard = {
  href: string
  label: string
  title: string
  description: string
  count: number
  emptyState: string
  icon: LucideIcon
}

export function SubjectStartHere({
  subject,
  stats,
  firstModule,
  featuredProject,
  featuredTool,
}: SubjectStartHereProps) {
  const sections: SectionCard[] = [
    {
      href: `/${subject.slug}/blueprint`,
      label: "Path",
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
      description: "Browse frameworks and reusable ways of thinking drawn from the subject.",
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

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.25fr,0.75fr]">
        <div className="rounded-[28px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.78)] shadow-editorial-soft backdrop-blur-[18px] p-8">
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

          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-editorial-ink mb-4">
            {subject.name}
          </h1>
          <p className="text-lg text-editorial-muted leading-relaxed max-w-2xl">
            {subject.tagline}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href={firstModule ? `/${subject.slug}/modules/${firstModule.slug}` : `/${subject.slug}/blueprint`}>
                {firstModule ? "Start the first module" : "Open the blueprint"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href={`/${subject.slug}/modules`}>Browse all modules</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-[28px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,252,247,0.78)] shadow-editorial-soft backdrop-blur-[18px] p-8">
          <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted mb-3">
            Start Here
          </p>
          <h2 className="font-serif text-2xl font-semibold text-editorial-ink mb-3">
            Learn for understanding first
          </h2>
          <p className="text-editorial-muted leading-relaxed mb-5">
            Personal Academy is intentionally learning-first. Use the blueprint to
            orient yourself, work through modules for depth, then branch into
            projects, tools, and real-world context when the subject is ready.
          </p>
          <div className="space-y-2 text-sm text-editorial-muted">
            <p>{stats.projects > 0 ? "Projects are ready for applied practice." : "Projects are still coming in for this subject."}</p>
            <p>{stats.tools > 0 ? "Tool coverage is available when you want to get practical." : "Tool coverage has not landed yet in this migration."}</p>
            <p>{stats.dayInLife > 0 ? "Day-in-the-life stories add real-world grounding." : "Career snapshots are still thin for this subject."}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon
          const hasContent = section.count > 0

          return (
            <Link
              key={section.href}
              href={section.href}
              className="rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.78)] shadow-editorial-soft backdrop-blur-[18px] p-6 hover:shadow-editorial-hover transition-shadow"
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
                <Badge variant={hasContent ? "secondary" : "coming-soon"}>
                  {hasContent ? `${section.count} items` : "Thin"}
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
        <section className="grid gap-4 lg:grid-cols-3">
          {firstModule && (
            <Link
              href={`/${subject.slug}/modules/${firstModule.slug}`}
              className="rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.78)] p-6 shadow-editorial-soft hover:shadow-editorial-hover transition-shadow"
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
              className="rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.78)] p-6 shadow-editorial-soft hover:shadow-editorial-hover transition-shadow"
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
              className="rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.78)] p-6 shadow-editorial-soft hover:shadow-editorial-hover transition-shadow"
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
    </div>
  )
}
