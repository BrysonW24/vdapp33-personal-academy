import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowRight, BookOpen, Clock3, FolderKanban, Library, Map, Wrench } from "lucide-react"
import { EntityHero } from "@/components/entities/EntityHero"
import { EntityLandingSection } from "@/components/sections/EntityLandingSection"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Project, SubjectManifest, Tool } from "@/types/curriculum"
import type { EntityManifest, EntityStats } from "@/types/entity"

type SectionCard = {
  href: string
  label: string
  title: string
  description: string
  count: number
  icon: typeof Map
}

interface EntityStartHereProps {
  entity: EntityManifest
  basePath: string
  stats: EntityStats
  intro: {
    title: string
    summary: string
    secondaryTitle: string
    secondaryBody: string
    chips: string[]
  }
  sections: SectionCard[]
  relatedSubjects: SubjectManifest[]
  featuredProject?: Project | null
  featuredTool?: Tool | null
  featuredDayInLifeHref?: string
  featuredDayInLifeCount?: number
  guideRail?: ReactNode
}

export function EntityStartHere({
  entity,
  basePath,
  stats,
  intro,
  sections,
  relatedSubjects,
  featuredProject,
  featuredTool,
  featuredDayInLifeHref,
  featuredDayInLifeCount = 0,
  guideRail,
}: EntityStartHereProps) {
  const statChips = [
    { label: "Modules", value: stats.modules },
    { label: "Projects", value: stats.projects },
    { label: "Tools", value: stats.tools },
    {
      label: entity.kind === "role" ? "Stories" : "Concepts",
      value: entity.kind === "role" ? stats.dayInLife : stats.sections,
    },
  ]

  return (
    <div className="space-y-10 pb-16">
      <section className="container mx-auto px-4 pt-8">
        <div className="rounded-[30px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.84)] p-8 shadow-editorial-soft backdrop-blur-[18px] sm:p-10">
          <EntityHero
            title={entity.name}
            subtitle={entity.tagline}
            entityKind={entity.kind}
            themeColor={entity.color}
            variant="gradient"
            statChips={statChips}
          />

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href={sections[0]?.href ?? basePath}>
                Start here
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href={basePath}>
                Open {entity.kind}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <EntityLandingSection
        eyebrow={intro.title}
        title={entity.kind === "role" ? "What the role actually involves" : "What this topic actually covers"}
        subtitle={intro.summary}
        tintColor={entity.color}
        columns={2}
      >
        <div className="rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-white/80 p-6 shadow-editorial-soft">
          <h3 className="font-serif text-xl font-semibold text-editorial-ink">
            {intro.secondaryTitle}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-editorial-muted">
            {intro.secondaryBody}
          </p>
        </div>

        <div className="rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-white/80 p-6 shadow-editorial-soft">
          <h3 className="font-serif text-xl font-semibold text-editorial-ink">
            Signals to follow
          </h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {intro.chips.map((chip) => (
              <Badge
                key={chip}
                className="border-transparent"
                style={{ backgroundColor: `${entity.color}18`, color: entity.color }}
              >
                {chip}
              </Badge>
            ))}
          </div>
        </div>
      </EntityLandingSection>

      <EntityLandingSection
        eyebrow="Surfaces"
        title="Navigate this surface"
        subtitle="Move through the same knowledge base through a role- or topic-shaped lens."
        tintColor={entity.color}
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
                    style={{ backgroundColor: `${entity.color}16`, color: entity.color }}
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
        subtitle="Subjects stay canonical. Roles and topics bring together the most relevant parts."
        tintColor={entity.color}
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

      {(featuredProject || featuredTool || (featuredDayInLifeHref && featuredDayInLifeCount > 0)) && (
        <EntityLandingSection
          eyebrow="Applied"
          title="Real ways in"
          subtitle="Practical work, real tools, and grounded stories keep the surface from feeling abstract."
          tintColor={entity.color}
          columns={3}
        >
          {featuredProject ? (
            <Link
              href={`${basePath}/projects/${featuredProject.slug}`}
              className="rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-white/82 p-6 shadow-editorial-soft transition-all duration-200 hover:-translate-y-[2px] hover:shadow-editorial-hover"
            >
              <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                <FolderKanban className="h-4 w-4" />
                Featured project
              </div>
              <h3 className="font-serif text-xl font-semibold text-editorial-ink">
                {featuredProject.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-editorial-muted">
                {featuredProject.description}
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

      {guideRail ? <section className="container mx-auto px-4">{guideRail}</section> : null}
    </div>
  )
}
