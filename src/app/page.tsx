import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  FolderKanban,
  GraduationCap,
  Library,
  Sparkles,
  Wrench,
} from "lucide-react"
import { NexusWordmark } from "@/components/branding/NexusWordmark"
import { EntityCard } from "@/components/entities/EntityCard"
import { getSubjectStats, getSubjects } from "@/lib/content"
import { getRoles, getRoleStats, getTopics, getTopicStats } from "@/lib/entities"
import { SUBJECT_GROUP_LABELS } from "@/types/curriculum"

export default function NexusHomePage() {
  const subjects = getSubjects()
  const roles = getRoles()
  const topics = getTopics()

  const groupedSubjects = subjects.reduce<Record<string, typeof subjects>>((acc, subject) => {
    if (!acc[subject.group]) acc[subject.group] = []
    acc[subject.group].push(subject)
    return acc
  }, {})

  const subjectTotals = subjects.reduce(
    (acc, subject) => {
      const stats = getSubjectStats(subject.slug)
      return {
        modules: acc.modules + stats.modules,
        frameworks: acc.frameworks + stats.frameworks,
        projects: acc.projects + stats.projects,
        tools: acc.tools + stats.tools,
      }
    },
    { modules: 0, frameworks: 0, projects: 0, tools: 0 }
  )

  const featuredRole = roles[0]
  const featuredTopic = topics[0]

  return (
    <div className="container mx-auto space-y-10 px-4 py-6 sm:py-8">
      <section className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr] lg:items-start">
        <div className="academy-hero-shell relative overflow-hidden rounded-[28px] border border-[rgba(44,49,59,0.08)] bg-[linear-gradient(145deg,rgba(255,255,255,0.94),rgba(251,246,239,0.88))] p-6 shadow-editorial-soft backdrop-blur-[18px] sm:rounded-[32px] sm:p-10">
          <div className="pointer-events-none absolute -left-10 top-20 h-44 w-44 rounded-full bg-[#1fb9ff]/20 blur-3xl" />
          <div className="pointer-events-none absolute left-32 top-8 h-44 w-44 rounded-full bg-[#8b5cf6]/16 blur-3xl" />
          <div className="pointer-events-none absolute left-48 top-28 h-40 w-40 rounded-full bg-[#ffb347]/24 blur-3xl" />
          <div className="academy-hero-grid absolute inset-0" />

          <div className="relative mb-4 flex flex-wrap items-center gap-2 sm:mb-5 sm:gap-3">
            <span className="rounded-full border border-[rgba(44,49,59,0.08)] bg-white/72 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-editorial-muted shadow-sm">
              Open-world knowledge
            </span>
            <span className="rounded-full border border-[rgba(44,49,59,0.08)] bg-white/72 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-editorial-muted shadow-sm">
              Curiosity engine
            </span>
          </div>

          <h1 className="sr-only">Nexus</h1>
          <div className="relative">
            <NexusWordmark size="hero" />
          </div>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-editorial-muted sm:text-lg">
            Browse an open-world knowledge interface. Subjects stay canonical, while
            roles and topics let you move through the same system by job, by question,
            and by real-world application.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-editorial-muted sm:flex sm:flex-wrap">
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              {subjectTotals.modules} subject modules
            </span>
            <span className="flex items-center gap-1.5">
              <Library className="h-4 w-4" />
              {subjectTotals.frameworks} frameworks
            </span>
            <span className="flex items-center gap-1.5">
              <FolderKanban className="h-4 w-4" />
              {subjectTotals.projects} projects
            </span>
            <span className="flex items-center gap-1.5">
              <Wrench className="h-4 w-4" />
              {subjectTotals.tools} tools
            </span>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {featuredRole ? (
              <Link
                href={`/roles/${featuredRole.slug}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-editorial-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-editorial-green/90 sm:w-auto"
              >
                Start with a role
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
            {featuredTopic ? (
              <Link
                href={`/topics/${featuredTopic.slug}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-editorial-blue-soft px-5 py-2.5 text-sm font-medium text-editorial-blue transition-colors hover:bg-editorial-blue/10 sm:w-auto"
              >
                Explore a topic
              </Link>
            ) : null}
            {subjects[0] ? (
              <Link
                href={`/${subjects[0].slug}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-editorial-ink transition-colors hover:bg-editorial-canvas sm:w-auto"
              >
                Open a subject
              </Link>
            ) : null}
          </div>
        </div>

        <div className="rounded-[24px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,252,247,0.82)] p-6 shadow-editorial-soft backdrop-blur-[18px] sm:rounded-[28px] sm:p-8">
          <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
            Browse first
          </p>
          <div className="mt-5 space-y-4">
            <Link
              href="/subjects"
              className="block rounded-[20px] border border-[rgba(44,49,59,0.08)] bg-white/80 p-5 shadow-editorial-soft transition-all duration-200 hover:-translate-y-[2px] hover:shadow-editorial-hover"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-editorial-blue" />
                <div>
                  <h2 className="font-serif text-xl font-semibold text-editorial-ink">
                    Subjects
                  </h2>
                  <p className="text-sm text-editorial-muted">
                    Canonical curriculum packs across the academy.
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/roles"
              className="block rounded-[20px] border border-[rgba(44,49,59,0.08)] bg-white/80 p-5 shadow-editorial-soft transition-all duration-200 hover:-translate-y-[2px] hover:shadow-editorial-hover"
            >
              <div className="flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-editorial-green" />
                <div>
                  <h2 className="font-serif text-xl font-semibold text-editorial-ink">
                    Roles
                  </h2>
                  <p className="text-sm text-editorial-muted">
                    {roles.length} real destinations like Astronaut, AI Researcher, and Diplomat.
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/topics"
              className="block rounded-[20px] border border-[rgba(44,49,59,0.08)] bg-white/80 p-5 shadow-editorial-soft transition-all duration-200 hover:-translate-y-[2px] hover:shadow-editorial-hover"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-editorial-amber" />
                <div>
                  <h2 className="font-serif text-xl font-semibold text-editorial-ink">
                    Topics
                  </h2>
                  <p className="text-sm text-editorial-muted">
                    {topics.length} curiosity layers like AI, investing, consciousness, and history.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
            First-class roles
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-editorial-ink">
            Roles are real pages now
          </h2>
          <p className="mt-3 max-w-3xl text-editorial-muted">
            The old frontier directions are now clickable destinations with training,
            projects, tools, and grounded day-in-the-life views.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {roles.map((role) => {
            const stats = getRoleStats(role.slug)

            return (
              <EntityCard
                key={role.slug}
                entity={role}
                href={`/roles/${role.slug}`}
                eyebrow="Role"
                statLine={`${stats.modules} modules · ${stats.projects} projects · ${stats.dayInLife} stories`}
              />
            )
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
            Broad curiosity
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-editorial-ink">
            Topics go broad on purpose
          </h2>
          <p className="mt-3 max-w-3xl text-editorial-muted">
            Topics work like a personal encyclopedia layer: concept-first, with
            applications and tools drawn from the subject packs underneath.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {topics.map((topic) => {
            const stats = getTopicStats(topic.slug)

            return (
              <EntityCard
                key={topic.slug}
                entity={topic}
                href={`/topics/${topic.slug}`}
                eyebrow="Topic"
                statLine={`${stats.sections} concepts · ${stats.projects} applications · ${stats.tools} tools`}
              />
            )
          })}
        </div>
      </section>

      <section className="space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
            Canonical subjects
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-editorial-ink">
            Subjects still own the curriculum
          </h2>
        </div>

        {Object.entries(groupedSubjects).map(([group, groupSubjects]) => (
          <section key={group} className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
                {SUBJECT_GROUP_LABELS[group] ?? group}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {groupSubjects.map((subject) => {
                const stats = getSubjectStats(subject.slug)

                return (
                  <Link
                    key={subject.slug}
                    href={`/${subject.slug}`}
                    className="rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.78)] p-6 shadow-editorial-soft transition-all duration-200 hover:-translate-y-[2px] hover:shadow-editorial-hover"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <span className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                        Subject
                      </span>
                      <span className="text-xs text-editorial-muted">
                        {stats.modules} modules
                      </span>
                    </div>

                    <span
                      className="mb-4 inline-block h-2.5 w-12 rounded-full"
                      style={{ backgroundColor: subject.color }}
                    />

                    <h3 className="font-serif text-2xl font-semibold text-editorial-ink">
                      {subject.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-editorial-muted">
                      {subject.tagline}
                    </p>
                    <p className="mt-4 text-xs text-editorial-muted">
                      {stats.lessons} lessons · {stats.frameworks} frameworks · {stats.projects} projects
                    </p>
                  </Link>
                )
              })}
            </div>
          </section>
        ))}
      </section>
    </div>
  )
}
