import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  Compass,
  FolderKanban,
  GraduationCap,
  Library,
  Sparkles,
  Wrench,
} from "lucide-react"
import { EntityCard } from "@/components/entities/EntityCard"
import { getSubjectStats, getSubjects } from "@/lib/content"
import { getRoles, getRoleStats, getTopics, getTopicStats } from "@/lib/entities"
import { SUBJECT_GROUP_LABELS } from "@/types/curriculum"

export default function PersonalAcademyHomePage() {
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
    <div className="container mx-auto px-4 py-8 space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="rounded-[28px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.82)] p-8 shadow-editorial-soft backdrop-blur-[18px]">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-editorial-blue text-white">
              <GraduationCap className="h-5 w-5" />
            </span>
            <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
              Curiosity engine
            </p>
          </div>

          <h1 className="font-serif text-4xl font-semibold text-editorial-ink sm:text-5xl">
            Personal Academy
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-editorial-muted">
            One shell for going broad and going deep. Subjects stay canonical, while roles
            and topics let you explore the same academy through real jobs, real systems,
            and the things you keep finding yourself curious about.
          </p>

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-editorial-muted">
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

          <div className="mt-8 flex flex-wrap gap-3">
            {featuredRole ? (
              <Link
                href={`/roles/${featuredRole.slug}`}
                className="inline-flex items-center gap-2 rounded-full bg-editorial-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-editorial-green/90"
              >
                Start with a role
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
            {featuredTopic ? (
              <Link
                href={`/topics/${featuredTopic.slug}`}
                className="inline-flex items-center gap-2 rounded-full bg-editorial-blue-soft px-5 py-2.5 text-sm font-medium text-editorial-blue transition-colors hover:bg-editorial-blue/10"
              >
                Explore a topic
              </Link>
            ) : null}
            {subjects[0] ? (
              <Link
                href={`/${subjects[0].slug}`}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-editorial-ink transition-colors hover:bg-editorial-canvas"
              >
                Open a subject
              </Link>
            ) : null}
          </div>
        </div>

        <div className="rounded-[28px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,252,247,0.82)] p-8 shadow-editorial-soft backdrop-blur-[18px]">
          <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
            Choose your lens
          </p>
          <div className="mt-5 space-y-4">
            <Link
              href="/"
              className="block rounded-[20px] border border-[rgba(44,49,59,0.08)] bg-white/80 p-5 shadow-editorial-soft transition-all duration-200 hover:-translate-y-[2px] hover:shadow-editorial-hover"
            >
              <div className="flex items-center gap-3">
                <Compass className="h-5 w-5 text-editorial-blue" />
                <div>
                  <h2 className="font-serif text-xl font-semibold text-editorial-ink">
                    Subjects
                  </h2>
                  <p className="text-sm text-editorial-muted">
                    Canonical curriculum packs across seven active subjects.
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
                    {topics.length} curiosity layers like AI, energy, investing, and consciousness.
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
