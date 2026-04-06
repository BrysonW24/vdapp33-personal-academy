import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
  ArrowRight,
  BookOpen,
  Clock3,
  FileSearch,
  Layers3,
  Newspaper,
  Radar,
  Sparkles,
  Swords,
  Wrench,
} from "lucide-react"
import { QuestBoard } from "@/components/academy/progress/QuestBoard"
import { EntityHero } from "@/components/entities/EntityHero"
import { EntitySignalDashboard } from "@/components/entities/EntitySignalDashboard"
import { EntityLandingSection } from "@/components/sections/EntityLandingSection"
import { CareerLadder } from "@/components/visualizations/CareerLadder"
import { ExposureMap } from "@/components/visualizations/ExposureMap"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ReadableProse } from "@/components/ui/ReadableProse"
import { getRolePresentation } from "@/lib/role-presentations"
import type { Module, Project, SubjectLevel, SubjectManifest, Tool } from "@/types/curriculum"
import type { EntityManifest, EntityStats, RoleOverview } from "@/types/entity"
import type { SignalDigest, SourcePack } from "@/types/guidance"

type SectionCard = {
  href: string
  label: string
  title: string
  description: string
  count: number
  icon: LucideIcon
}

interface RoleAcademyHomeProps {
  role: EntityManifest
  overview: RoleOverview
  basePath: string
  stats: EntityStats
  modules: Module[]
  projects: Project[]
  sections: SectionCard[]
  relatedSubjects: SubjectManifest[]
  featuredTool?: Tool | null
  sourcePack?: SourcePack | null
  signalDigest?: SignalDigest | null
  featuredDayInLifeHref?: string
  featuredDayInLifeCount?: number
}

function listOrFallback(items: string[], fallback: string[]) {
  return items.length > 0 ? items : fallback
}

const LEVEL_ORDER: SubjectLevel[] = ["beginner", "intermediate", "advanced"]

const LEVEL_META: Record<
  SubjectLevel,
  { label: string; description: string; icon: typeof BookOpen }
> = {
  beginner: {
    label: "Beginner",
    description: "Start with the shape of the role, its core language, and the first dependable moves.",
    icon: BookOpen,
  },
  intermediate: {
    label: "Intermediate",
    description: "Build working fluency so the role starts to feel usable instead of theoretical.",
    icon: Layers3,
  },
  advanced: {
    label: "Advanced",
    description: "Handle harder tradeoffs, more ambiguity, and the parts of the role that require judgment.",
    icon: Radar,
  },
}

function sortModules(modules: Module[]) {
  return [...modules].sort((left, right) => {
    const leftRank = left.levelNumber ?? left.order
    const rightRank = right.levelNumber ?? right.order

    if (leftRank !== rightRank) return leftRank - rightRank
    return left.title.localeCompare(right.title)
  })
}

export function RoleAcademyHome({
  role,
  overview,
  basePath,
  stats,
  modules,
  projects,
  sections,
  relatedSubjects,
  featuredTool,
  sourcePack,
  signalDigest,
  featuredDayInLifeHref,
  featuredDayInLifeCount = 0,
}: RoleAcademyHomeProps) {
  const presentation = getRolePresentation(role, overview)

  const statChips = [
    { label: "Modules", value: stats.modules },
    { label: "Projects", value: stats.projects },
    { label: "Tools", value: stats.tools },
    { label: "Stories", value: stats.dayInLife },
  ]

  const strengths = listOrFallback(overview.strengths, overview.signals.slice(0, 6))
  const whatPeopleDo = listOrFallback(
    overview.whatPeopleDo,
    overview.coreWork
      .split(/\n|\. /)
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 4)
  )
  const careerLevers = listOrFallback(overview.careerLevers, [
    "Strong writing and debrief quality",
    "Clear judgment under pressure",
    "Calm coordination with other specialists",
    "A reputation for reliability when the stakes rise",
  ])
  const levelGroups = LEVEL_ORDER.map((level) => {
    const items = sortModules(modules.filter((module) => module.level === level))
    return {
      level,
      ...LEVEL_META[level],
      modules: items,
    }
  }).filter((group) => group.modules.length > 0)
  const questPreviewItems = projects
    .slice()
    .sort((left, right) => left.difficulty - right.difficulty || left.title.localeCompare(right.title))
    .slice(0, 6)
    .map((project) => ({
      id: project.slug,
      title: project.title,
      description: project.description,
      difficulty: project.difficulty,
      duration: `${project.estimatedHours} hours`,
      tools: project.tools,
      outcomes: project.skillsLearned,
      href: `${basePath}/projects/${project.slug}`,
      ctaLabel: "Open quest",
      badge:
        project.sourceMeta?.sourceKind === "role"
          ? "Core role"
          : project.sourceMeta?.sourceSlug,
    }))

  return (
    <div className="space-y-10 pb-16">
      <section className="container mx-auto px-4 pt-6 sm:pt-8">
        <div className="rounded-[28px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.84)] p-6 shadow-editorial-soft backdrop-blur-[18px] sm:rounded-[30px] sm:p-10">
          <EntityHero
            title={role.name}
            subtitle={role.tagline}
            entityKind="role"
            themeColor={role.color}
            variant={presentation.heroVariant ?? "gradient"}
            statChips={statChips}
            nodes={presentation.heroNodes}
            connections={presentation.heroConnections}
          />

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href={`${basePath}/modules`}>
                Open training
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href={`${basePath}/blueprint`}>See the role stack</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href={`${basePath}/day-in-the-life`}>Read the day-to-day reality</Link>
            </Button>
          </div>
        </div>
      </section>

      <EntityLandingSection
        eyebrow="How to use this role"
        title="Move from beginner to expert application"
        subtitle="This is the cleanest way through the role. Learn the basics first, build fluency in the middle, then pressure-test yourself with real quests and scenarios."
        tintColor={role.color}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {levelGroups.map((group) => {
            const Icon = group.icon
            const firstModule = group.modules[0]

            return (
              <Link
                key={group.level}
                href={`${basePath}/modules#${group.level}`}
                className="rounded-[24px] border border-[rgba(44,49,59,0.08)] bg-white/84 p-6 shadow-editorial-soft transition-all duration-200 hover:-translate-y-[2px] hover:shadow-editorial-hover"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-[14px]"
                    style={{ backgroundColor: `${role.color}14`, color: role.color }}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <Badge className="border-transparent" style={{ backgroundColor: `${role.color}12`, color: role.color }}>
                    {group.modules.length}
                  </Badge>
                </div>
                <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                  Training stage
                </p>
                <h3 className="mt-2 font-serif text-2xl font-semibold text-editorial-ink">
                  {group.label}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-editorial-muted">
                  {group.description}
                </p>
                {firstModule ? (
                  <>
                    <div className="mt-5 h-px bg-[rgba(44,49,59,0.08)]" />
                    <p className="mt-4 text-[10px] uppercase tracking-[0.16em] text-editorial-muted">
                      Start here
                    </p>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-editorial-ink">
                      {firstModule.title}
                    </p>
                    {group.modules.slice(1, 3).map((module) => (
                      <p key={module.slug} className="mt-2 text-sm leading-relaxed text-editorial-muted">
                        {module.title}
                      </p>
                    ))}
                  </>
                ) : null}
              </Link>
            )
          })}

          <Link
            href={projects.length > 0 ? `${basePath}/projects` : featuredDayInLifeHref ?? `${basePath}/day-in-the-life`}
            className="rounded-[24px] border border-[rgba(44,49,59,0.08)] bg-white/84 p-6 shadow-editorial-soft transition-all duration-200 hover:-translate-y-[2px] hover:shadow-editorial-hover"
          >
            <div className="flex items-start justify-between gap-3">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-[14px]"
                style={{ backgroundColor: `${role.color}14`, color: role.color }}
              >
                <Swords className="h-4.5 w-4.5" />
              </span>
              <Badge className="border-transparent" style={{ backgroundColor: `${role.color}12`, color: role.color }}>
                {projects.length + featuredDayInLifeCount}
              </Badge>
            </div>
            <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
              Applied layer
            </p>
            <h3 className="mt-2 font-serif text-2xl font-semibold text-editorial-ink">
              Expert
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-editorial-muted">
              Use quests, simulations, and real-world scenarios to pressure-test the training until it feels like work instead of study.
            </p>
            <div className="mt-5 h-px bg-[rgba(44,49,59,0.08)]" />
            <p className="mt-4 text-[10px] uppercase tracking-[0.16em] text-editorial-muted">
              Applied surfaces
            </p>
            <p className="mt-2 text-sm font-medium leading-relaxed text-editorial-ink">
              {projects.length > 0 ? `${projects.length} project quests` : "Role scenarios"}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-editorial-muted">
              {featuredDayInLifeCount > 0
                ? `${featuredDayInLifeCount} day-in-the-life scenarios`
                : "Use the role world to see how the decisions show up in practice."}
            </p>
          </Link>
        </div>
      </EntityLandingSection>

      <EntityLandingSection
        eyebrow={overview.title}
        title="Understand the role before you dive deeper"
        subtitle="This opening layer is designed to be memorable first. Get the shape of the role, where it came from, what it asks of people, and what makes someone good at it before branching into deeper surfaces."
        tintColor={role.color}
        columns={3}
      >
        {presentation.quickCards.map((card) => {
          const CardIcon = card.icon

          return (
            <div
              key={card.eyebrow}
              className="rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-white/84 p-6 shadow-editorial-soft"
            >
              <div className="flex items-start gap-3">
                {CardIcon ? (
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px]"
                    style={{ backgroundColor: `${role.color}12`, color: role.color }}
                  >
                    <CardIcon className="h-4.5 w-4.5" />
                  </span>
                ) : null}
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                    {card.eyebrow}
                  </p>
                  <h3 className="mt-2 font-serif text-xl font-semibold text-editorial-ink">
                    {card.title}
                  </h3>
                </div>
              </div>
              <p className="mt-3 text-sm leading-7 text-editorial-muted">{card.body}</p>
            </div>
          )
        })}
      </EntityLandingSection>

      <EntityLandingSection
        eyebrow="Role system"
        title="See the role in one screen"
        subtitle="This is the fast visual summary: what the role rewards, where the load sits, and how the different parts of the work connect."
        tintColor={role.color}
      >
        <div className="grid gap-5 xl:grid-cols-[1.45fr_0.9fr]">
          <EntitySignalDashboard
            eyebrow={presentation.dashboard.eyebrow}
            title={presentation.dashboard.title}
            summary={presentation.dashboard.summary}
            complexityScore={presentation.dashboard.complexityScore}
            demandMetrics={presentation.dashboard.demandMetrics}
            operationalSignals={presentation.dashboard.operationalSignals}
            readinessStages={presentation.dashboard.readinessStages}
            dependencyNodes={presentation.dashboard.dependencyNodes}
            dependencyConnections={presentation.dashboard.dependencyConnections}
          />

          <div className="space-y-5">
            <div className="rounded-[24px] border border-[rgba(44,49,59,0.08)] bg-white/84 p-6 shadow-editorial-soft">
              <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                What people actually do
              </p>
              <h3 className="mt-2 font-serif text-2xl font-semibold text-editorial-ink">
                Daily work in plain language
              </h3>
              <ul className="mt-4 space-y-3">
                {whatPeopleDo.map((item) => (
                  <li key={item} className="text-sm leading-7 text-editorial-muted">
                    <span className="mr-2 text-editorial-ink">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[24px] border border-[rgba(44,49,59,0.08)] bg-white/84 p-6 shadow-editorial-soft">
              <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                Signals to follow
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {overview.signals.map((chip) => (
                  <Badge
                    key={chip}
                    className="border-transparent"
                    style={{ backgroundColor: `${role.color}18`, color: role.color }}
                  >
                    {chip}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </EntityLandingSection>

      <EntityLandingSection
        eyebrow="What the work feels like"
        title="Read the reality, not just the romance"
        subtitle="The role only becomes useful when the human reality is clear: how people get in, what they need to be strong in, and what makes them effective once they are there."
        tintColor={role.color}
        columns={2}
      >
        <div className="rounded-[24px] border border-[rgba(44,49,59,0.08)] bg-white/84 p-6 shadow-editorial-soft">
          <h3 className="font-serif text-2xl font-semibold text-editorial-ink">
            What the role actually involves
          </h3>
          <ReadableProse text={overview.summary} className="mt-4" />
        </div>

        <div className="rounded-[24px] border border-[rgba(44,49,59,0.08)] bg-white/84 p-6 shadow-editorial-soft">
          <h3 className="font-serif text-2xl font-semibold text-editorial-ink">
            Why ambitious people are pulled to it
          </h3>
          <ReadableProse text={overview.frontierPull} className="mt-4" />
          {overview.whenItCameAbout ? (
            <>
              <div className="mt-6 h-px bg-[rgba(44,49,59,0.08)]" />
              <h4 className="mt-6 text-sm font-semibold text-editorial-ink">
                Where the role came from
              </h4>
              <ReadableProse text={overview.whenItCameAbout} className="mt-3" />
            </>
          ) : null}
        </div>
      </EntityLandingSection>

      <EntityLandingSection
        eyebrow="Getting there"
        title="What you need to be strong in"
        subtitle="This is the part people usually want clarity on first: how people enter the field, what kind of person tends to do well, and where careers accelerate."
        tintColor={role.color}
      >
        <div className="grid gap-5 xl:grid-cols-[1.05fr_1.2fr]">
          <div className="space-y-5">
            <div className="rounded-[24px] border border-[rgba(44,49,59,0.08)] bg-white/84 p-6 shadow-editorial-soft">
              <h3 className="font-serif text-2xl font-semibold text-editorial-ink">
                How people usually get there
              </h3>
              <ReadableProse
                text={
                  overview.howPeopleGetThere ||
                  "Most people enter by building unusual technical credibility, then proving they can handle responsibility in real operating environments."
                }
                className="mt-4"
              />
            </div>

            <div className="rounded-[24px] border border-[rgba(44,49,59,0.08)] bg-white/84 p-6 shadow-editorial-soft">
              <h3 className="font-serif text-2xl font-semibold text-editorial-ink">
                Who tends to thrive
              </h3>
              <ReadableProse
                text={
                  overview.whoThrivesHere ||
                  "People tend to do well when they can stay composed, handle complexity without drama, and turn preparation into clear action."
                }
                className="mt-4"
              />
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[24px] border border-[rgba(44,49,59,0.08)] bg-white/84 p-6 shadow-editorial-soft">
              <h3 className="font-serif text-2xl font-semibold text-editorial-ink">
                Core strengths
              </h3>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {strengths.map((strength) => (
                  <Badge
                    key={strength}
                    className="border-transparent px-3 py-1.5 text-xs"
                    style={{ backgroundColor: `${role.color}18`, color: role.color }}
                  >
                    {strength}
                  </Badge>
                ))}
              </div>
            </div>

            <ExposureMap
              className="shadow-editorial-soft"
              axes={presentation.exposure.axes}
              profiles={presentation.exposure.profiles}
            />
          </div>
        </div>
      </EntityLandingSection>

      <EntityLandingSection
        eyebrow="Role quests"
        title="Apply the role through real quests"
        subtitle="Projects are where the role stops being a description and starts becoming a training environment. Work them in order, then use the full quest board when you want the complete arc."
        tintColor={role.color}
      >
        <div className="space-y-6">
          <QuestBoard
            title="Role quest board"
            subtitle={`${projects.length} total quest${projects.length === 1 ? "" : "s"} available`}
            items={questPreviewItems}
          />
          {projects.length > questPreviewItems.length ? (
            <div className="flex justify-start">
              <Button asChild variant="secondary">
                <Link href={`${basePath}/projects`}>
                  Open all {projects.length} quests
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : null}
        </div>
      </EntityLandingSection>

      <EntityLandingSection
        eyebrow="Career arc"
        title="How people improve and progress"
        subtitle="Careers in serious roles usually compound through trust. The work gets better as people become more reliable, more accurate, and more useful in harder situations."
        tintColor={role.color}
      >
        <div className="grid gap-5 xl:grid-cols-[1.25fr_0.85fr]">
          <CareerLadder
            title={presentation.career.title}
            summary={presentation.career.summary}
            stages={presentation.career.stages}
          />

          <div className="rounded-[24px] border border-[rgba(44,49,59,0.08)] bg-white/84 p-6 shadow-editorial-soft">
            <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
              Career levers
            </p>
            <h3 className="mt-2 font-serif text-2xl font-semibold text-editorial-ink">
              What actually helps
            </h3>
            <ul className="mt-4 space-y-3">
              {careerLevers.map((lever) => (
                <li key={lever} className="text-sm leading-7 text-editorial-muted">
                  <span className="mr-2 text-editorial-ink">•</span>
                  {lever}
                </li>
              ))}
            </ul>
            {overview.exposures.length > 0 ? (
              <>
                <div className="mt-6 h-px bg-[rgba(44,49,59,0.08)]" />
                <h4 className="mt-6 text-sm font-semibold text-editorial-ink">
                  Common exposures
                </h4>
                <ul className="mt-3 space-y-2">
                  {overview.exposures.map((item) => (
                    <li key={item} className="text-sm leading-7 text-editorial-muted">
                      <span className="mr-2 text-editorial-ink">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        </div>
      </EntityLandingSection>

      <EntityLandingSection
        eyebrow="Go deeper"
        title="Navigate this role"
        subtitle="Once the role makes sense, use these surfaces to go deeper in the direction you care about."
        tintColor={role.color}
        columns={3}
      >
        {sections.map((section) => {
          const Icon = section.icon

          return (
            <Link
              key={section.href}
              href={section.href}
              className="rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-white/84 p-6 shadow-editorial-soft transition-all duration-200 hover:-translate-y-[2px] hover:shadow-editorial-hover"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-[14px]"
                    style={{ backgroundColor: `${role.color}16`, color: role.color }}
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
                <Badge variant="secondary">{section.count}</Badge>
              </div>
              <p className="text-sm leading-relaxed text-editorial-muted">
                {section.description}
              </p>
            </Link>
          )
        })}
      </EntityLandingSection>

      <EntityLandingSection
        eyebrow="Cross-links"
        title="Built on related subjects"
        subtitle="Subjects stay canonical. Roles synthesize the most relevant slices into one practical surface."
        tintColor={role.color}
        columns={relatedSubjects.length > 2 ? 3 : 2}
      >
        {relatedSubjects.map((subject) => (
          <Link
            key={subject.slug}
            href={`/${subject.slug}`}
            className="rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-white/82 p-6 shadow-editorial-soft transition-all duration-200 hover:-translate-y-[2px] hover:shadow-editorial-hover"
          >
            <span
              className="mb-4 inline-block h-2.5 w-12 rounded-full"
              style={{ backgroundColor: subject.color }}
            />
            <h3 className="font-serif text-xl font-semibold text-editorial-ink">
              {subject.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-editorial-muted">
              {subject.tagline}
            </p>
          </Link>
        ))}
      </EntityLandingSection>

      {(featuredTool || (featuredDayInLifeHref && featuredDayInLifeCount > 0) || sourcePack || signalDigest) && (
        <EntityLandingSection
          eyebrow="Applied"
          title="Real ways in"
          subtitle="Practical work, real tools, and grounded stories help the role stay alive instead of drifting into abstraction."
          tintColor={role.color}
          columns={3}
        >
          {sourcePack ? (
            <Link
              href={`${basePath}/sources`}
              className="rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-white/82 p-6 shadow-editorial-soft transition-all duration-200 hover:-translate-y-[2px] hover:shadow-editorial-hover"
            >
              <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                <FileSearch className="h-4 w-4" />
                Truth stack
              </div>
              <h3 className="font-serif text-xl font-semibold text-editorial-ink">
                {sourcePack.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-editorial-muted">
                {sourcePack.summary}
              </p>
            </Link>
          ) : null}

          {signalDigest ? (
            <Link
              href={`${basePath}/signals`}
              className="rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-white/82 p-6 shadow-editorial-soft transition-all duration-200 hover:-translate-y-[2px] hover:shadow-editorial-hover"
            >
              <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                <Newspaper className="h-4 w-4" />
                Signals
              </div>
              <h3 className="font-serif text-xl font-semibold text-editorial-ink">
                {signalDigest.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-editorial-muted">
                {signalDigest.summary}
              </p>
            </Link>
          ) : null}

          {featuredTool ? (
            <Link
              href={`${basePath}/tools/${featuredTool.slug}`}
              className="rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-white/82 p-6 shadow-editorial-soft transition-all duration-200 hover:-translate-y-[2px] hover:shadow-editorial-hover"
            >
              <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                <Wrench className="h-4 w-4" />
                Tool spotlight
              </div>
              <h3 className="font-serif text-xl font-semibold text-editorial-ink">
                {featuredTool.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-editorial-muted">
                {featuredTool.description}
              </p>
            </Link>
          ) : null}

          {projects.length > 0 ? (
            <Link
              href={`${basePath}/projects`}
              className="rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-white/82 p-6 shadow-editorial-soft transition-all duration-200 hover:-translate-y-[2px] hover:shadow-editorial-hover"
            >
              <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                <Sparkles className="h-4 w-4" />
                Quest board
              </div>
              <h3 className="font-serif text-xl font-semibold text-editorial-ink">
                Applied role quests
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-editorial-muted">
                Work through {projects.length} quests that turn the role from theory into concrete outputs and decisions.
              </p>
            </Link>
          ) : null}

          {featuredDayInLifeHref && featuredDayInLifeCount > 0 ? (
            <Link
              href={featuredDayInLifeHref}
              className="rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-white/82 p-6 shadow-editorial-soft transition-all duration-200 hover:-translate-y-[2px] hover:shadow-editorial-hover"
            >
              <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                <Clock3 className="h-4 w-4" />
                Day in the life
              </div>
              <h3 className="font-serif text-xl font-semibold text-editorial-ink">
                Real-world role snapshots
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-editorial-muted">
                {featuredDayInLifeCount} grounded scenarios showing what the work actually feels like day to day.
              </p>
            </Link>
          ) : null}
        </EntityLandingSection>
      )}
    </div>
  )
}
