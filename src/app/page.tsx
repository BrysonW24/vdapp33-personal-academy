import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  Compass,
  Library,
  Sparkles,
  Waypoints,
} from "lucide-react"
import { KnowledgeHierarchyScene } from "@/components/browse/KnowledgeHierarchyScene"
import { NexusWordmark } from "@/components/branding/NexusWordmark"
import { EntityCard } from "@/components/entities/EntityCard"
import { getSubjectStats, getSubjects } from "@/lib/content"
import { getRoles, getRoleStats, getTopics, getTopicStats } from "@/lib/entities"
import {
  SUBJECT_GROUP_LABELS,
  SUBJECT_GROUPS,
  type SubjectManifest,
} from "@/types/curriculum"

const STRUCTURE_CARDS = [
  {
    label: "Subjects",
    title: "Disciplined depth",
    body: "Subjects are the canonical foundations. They hold the structured curriculum, frameworks, projects, tools, and deeper field logic.",
    icon: BookOpen,
    color: "#2C6AA0",
  },
  {
    label: "Topics",
    title: "Cross-domain lenses",
    body: "Topics let Nexus go broad on purpose. They pull ideas together by question, tension, or worldview instead of by discipline alone.",
    icon: Sparkles,
    color: "#7A63D8",
  },
  {
    label: "Roles",
    title: "Embodied intelligence",
    body: "Roles show what the map looks like inside a capable person. They turn knowledge into perspective, pressure, tools, and day-to-day reality.",
    icon: Compass,
    color: "#F59E0B",
  },
] as const

const TEACHING_LENSES = [
  {
    label: "Concept",
    description: "What it is.",
  },
  {
    label: "Mechanism",
    description: "How it works.",
  },
  {
    label: "Importance",
    description: "Why it matters.",
  },
  {
    label: "Application",
    description: "Where you see it in the world.",
  },
] as const

const QUICK_JUMP_LINKS = [
  { label: "Roles", href: "#roles" },
  { label: "Topics", href: "#topics" },
  { label: "Sciences", href: "#subjects-sciences" },
  { label: "Engineering", href: "#subjects-engineering" },
  { label: "Society", href: "#subjects-society" },
  { label: "Markets", href: "#subjects-markets" },
  { label: "Life", href: "#subjects-life" },
  { label: "Humanities", href: "#subjects-humanities" },
  { label: "Mind", href: "#subjects-mind" },
] as const

export default function NexusHomePage() {
  const subjects = getSubjects()
  const roles = getRoles()
  const topics = getTopics()

  const groupedSubjects = subjects.reduce<Record<string, SubjectManifest[]>>((acc, subject) => {
    if (!acc[subject.group]) acc[subject.group] = []
    acc[subject.group].push(subject)
    return acc
  }, {})

  const orderedGroups = SUBJECT_GROUPS.filter((group) => groupedSubjects[group]?.length)

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
  const featuredSubject = subjects[0]

  return (
    <div className="container mx-auto space-y-8 px-4 py-5 sm:space-y-10 sm:py-8">
      <section className="grid gap-4 xl:grid-cols-[1.05fr,0.95fr] xl:gap-6">
        <div className="academy-hero-shell relative overflow-hidden rounded-[26px] border border-[rgba(44,49,59,0.08)] bg-[linear-gradient(145deg,rgba(255,255,255,0.94),rgba(251,246,239,0.88))] p-5 shadow-editorial-soft backdrop-blur-[18px] sm:rounded-[30px] sm:p-8">
          <div className="pointer-events-none absolute -left-10 top-20 h-44 w-44 rounded-full bg-[#1fb9ff]/20 blur-3xl" />
          <div className="pointer-events-none absolute left-32 top-8 h-44 w-44 rounded-full bg-[#8b5cf6]/16 blur-3xl" />
          <div className="pointer-events-none absolute left-48 top-28 h-40 w-40 rounded-full bg-[#ffb347]/24 blur-3xl" />
          <div className="academy-hero-grid absolute inset-0" />

          <div className="relative mb-3 flex flex-wrap items-center gap-2 sm:mb-5 sm:gap-3">
            <span className="rounded-full border border-[rgba(44,49,59,0.08)] bg-white/72 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-editorial-muted shadow-sm">
              Open-world knowledge
            </span>
            <span className="rounded-full border border-[rgba(44,49,59,0.08)] bg-white/72 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-editorial-muted shadow-sm">
              Human reality map
            </span>
          </div>

          <h1 className="sr-only">Nexus</h1>
          <div className="relative">
            <NexusWordmark size="hero" />
          </div>
          <p className="mt-3 max-w-2xl text-[15px] leading-[1.6] text-editorial-muted sm:mt-4 sm:text-lg sm:leading-relaxed">
            Nexus is a browse-first map of human reality. Use subjects for disciplined
            depth, topics for cross-domain lenses, and roles for embodied intelligence.
          </p>
          <p className="mt-2.5 max-w-2xl text-[13px] leading-[1.6] text-editorial-muted sm:mt-3 sm:text-base sm:leading-relaxed">
            Everything stays visible. You can start from a field, a bigger question,
            or a role in the world without losing the deeper structure underneath.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-2.5 text-xs text-editorial-muted sm:mt-6 sm:flex sm:flex-wrap sm:text-sm">
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              {subjectTotals.modules} modules
            </span>
            <span className="flex items-center gap-1.5">
              <Library className="h-4 w-4" />
              {subjectTotals.frameworks} frameworks
            </span>
            <span className="flex items-center gap-1.5">
              <Waypoints className="h-4 w-4" />
              {subjects.length} subjects · {topics.length} topics · {roles.length} roles
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              {subjectTotals.projects} projects · {subjectTotals.tools} tools
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-3">
            {featuredRole ? (
              <Link
                href={`/roles/${featuredRole.slug}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-editorial-green px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-editorial-green/90 sm:w-auto sm:px-5"
              >
                Open a role
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
            {featuredTopic ? (
              <Link
                href={`/topics/${featuredTopic.slug}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-editorial-blue-soft px-4 py-2.5 text-sm font-medium text-editorial-blue transition-colors hover:bg-editorial-blue/10 sm:w-auto sm:px-5"
              >
                Explore a topic
              </Link>
            ) : null}
            {featuredSubject ? (
              <Link
                href={`/${featuredSubject.slug}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-editorial-ink transition-colors hover:bg-editorial-canvas sm:w-auto sm:px-5"
              >
                Open a subject
              </Link>
            ) : null}
          </div>
        </div>

        <div className="rounded-[26px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,252,247,0.82)] p-4 shadow-editorial-soft backdrop-blur-[18px] sm:rounded-[30px] sm:p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
            Browse first
          </p>
          <div className="mt-4 space-y-3 sm:mt-5 sm:space-y-4">
            {STRUCTURE_CARDS.map((item) => {
              const Icon = item.icon

              return (
                <div
                  key={item.label}
                  className="rounded-[20px] border border-[rgba(44,49,59,0.08)] bg-white/82 p-4 shadow-editorial-soft sm:rounded-[22px] sm:p-5"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] sm:h-11 sm:w-11"
                      style={{ backgroundColor: `${item.color}16`, color: item.color }}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                        {item.label}
                      </p>
                      <h2 className="mt-1.5 font-serif text-[1.45rem] font-semibold leading-tight text-editorial-ink sm:mt-2 sm:text-2xl">
                        {item.title}
                      </h2>
                      <p className="mt-1.5 text-[13px] leading-[1.55] text-editorial-muted sm:mt-2 sm:text-sm sm:leading-relaxed">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr,1.05fr] xl:gap-6">
        <div className="rounded-[26px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.78)] p-5 shadow-editorial-soft sm:rounded-[30px] sm:p-8">
          <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
            How Nexus works
          </p>
          <h2 className="mt-2 max-w-3xl font-serif text-[2rem] font-semibold leading-tight text-editorial-ink sm:text-4xl">
            One map, three kinds of entry points
          </h2>
          <p className="mt-3 max-w-3xl text-[15px] leading-[1.6] text-editorial-muted sm:mt-4 sm:text-base sm:leading-relaxed">
            Subjects are the stable base. Topics cut across them as bigger questions,
            tensions, or worldview frames. Roles sit on the outer layer, where knowledge
            becomes the perspective and pressure of a real person in the world.
          </p>
          <p className="mt-2.5 max-w-3xl text-[13px] leading-[1.6] text-editorial-muted sm:mt-3 sm:text-base sm:leading-relaxed">
            The point is to let you start from wherever your curiosity is strongest
            without hiding the rest of the map.
          </p>

          <div className="mt-5 grid gap-2.5 sm:mt-6 sm:grid-cols-2 sm:gap-3">
            {TEACHING_LENSES.map((lens, index) => (
              <div
                key={lens.label}
                className="rounded-[18px] border border-[rgba(44,49,59,0.08)] bg-white/84 p-3.5 sm:rounded-[20px] sm:p-4"
              >
                <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-editorial-green text-xs font-semibold text-white sm:h-8 sm:w-8 sm:text-sm">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-editorial-ink">{lens.label}</p>
                    <p className="text-sm text-editorial-muted">{lens.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <KnowledgeHierarchyScene className="min-h-[300px] h-full sm:min-h-[360px]" />
      </section>

      <section className="rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.78)] p-4 shadow-editorial-soft sm:rounded-[24px] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
              Jump straight in
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-editorial-muted sm:text-base">
              Everything is on the page below. Use these anchors when you want to move
              quickly between roles, topics, and the subject families.
            </p>
          </div>

          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {QUICK_JUMP_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="shrink-0 rounded-full border border-[rgba(44,49,59,0.08)] bg-white px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-editorial-muted transition-colors hover:bg-editorial-canvas sm:px-4 sm:text-xs"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="roles" className="space-y-3 sm:space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
              Guided worlds
            </p>
            <h2 className="mt-2 font-serif text-[2rem] font-semibold leading-tight text-editorial-ink sm:text-3xl">
              Roles
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-editorial-muted sm:text-base">
              Roles are embodied tracks. They show what a capable person in a field
              actually does, what they notice, what they depend on, and what shapes
              their judgment.
            </p>
          </div>

          <Link
            href="/roles"
            className="inline-flex items-center gap-2 text-sm font-medium text-editorial-blue transition-colors hover:text-editorial-green"
          >
            Open all roles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
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

      <section id="topics" className="space-y-3 sm:space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
              Cross-domain lenses
            </p>
            <h2 className="mt-2 font-serif text-[2rem] font-semibold leading-tight text-editorial-ink sm:text-3xl">
              Topics
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-editorial-muted sm:text-base">
              Topics stay broad on purpose. They help you move through the academy by
              question, tension, worldview, and synthesis instead of discipline alone.
            </p>
          </div>

          <Link
            href="/topics"
            className="inline-flex items-center gap-2 text-sm font-medium text-editorial-blue transition-colors hover:text-editorial-green"
          >
            Open all topics
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
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

      <section id="subjects" className="space-y-6 sm:space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
              Canonical subjects
            </p>
            <h2 className="mt-2 font-serif text-[2rem] font-semibold leading-tight text-editorial-ink sm:text-3xl">
              Subjects still own the curriculum
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-editorial-muted sm:text-base">
              Every subject stays visible here. This is the deep end of Nexus: the
              foundations, the field logic, the frameworks, the tools, and the
              cumulative structures underneath the wider map.
            </p>
          </div>

          <Link
            href="/subjects"
            className="inline-flex items-center gap-2 text-sm font-medium text-editorial-blue transition-colors hover:text-editorial-green"
          >
            Open all subjects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {orderedGroups.map((group) => {
          const groupSubjects = groupedSubjects[group]

          return (
            <section
              key={group}
              id={`subjects-${group}`}
              className="space-y-3 sm:space-y-4"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
                  {SUBJECT_GROUP_LABELS[group] ?? group}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
                {groupSubjects.map((subject) => {
                  const stats = getSubjectStats(subject.slug)

                  return (
                    <EntityCard
                      key={subject.slug}
                      entity={subject}
                      href={`/${subject.slug}`}
                      eyebrow="Subject"
                      statLine={`${stats.modules} modules · ${stats.frameworks} frameworks · ${stats.projects} projects`}
                    />
                  )
                })}
              </div>
            </section>
          )
        })}
      </section>
    </div>
  )
}
