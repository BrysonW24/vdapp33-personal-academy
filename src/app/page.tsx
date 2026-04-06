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
import { MacroBucketExplorer } from "@/components/browse/MacroBucketExplorer"
import { NexusWordmark } from "@/components/branding/NexusWordmark"
import { getBrowseCatalogData } from "@/lib/browse-data"
import { getSubjectStats, getSubjects } from "@/lib/content"
import { getRoles, getTopics } from "@/lib/entities"

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
    color: "#8A63D2",
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

export default function NexusHomePage() {
  const subjects = getSubjects()
  const roles = getRoles()
  const topics = getTopics()
  const { bucketGroups } = getBrowseCatalogData()

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
    <div className="container mx-auto space-y-10 px-4 py-6 sm:space-y-12 sm:py-8">
      <section className="grid gap-6 xl:grid-cols-[1.05fr,0.95fr]">
        <div className="academy-hero-shell relative overflow-hidden rounded-[30px] border border-[rgba(44,49,59,0.08)] bg-[linear-gradient(145deg,rgba(255,255,255,0.94),rgba(251,246,239,0.88))] p-6 shadow-editorial-soft backdrop-blur-[18px] sm:p-10">
          <div className="pointer-events-none absolute -left-10 top-20 h-44 w-44 rounded-full bg-[#1fb9ff]/20 blur-3xl" />
          <div className="pointer-events-none absolute left-32 top-8 h-44 w-44 rounded-full bg-[#8b5cf6]/16 blur-3xl" />
          <div className="pointer-events-none absolute left-48 top-28 h-40 w-40 rounded-full bg-[#ffb347]/24 blur-3xl" />
          <div className="academy-hero-grid absolute inset-0" />

          <div className="relative mb-4 flex flex-wrap items-center gap-2 sm:mb-5 sm:gap-3">
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
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-editorial-muted sm:text-lg">
            Nexus is a browse-first map of human reality. Use subjects for disciplined
            depth, topics for cross-domain lenses, and roles for embodied intelligence.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-editorial-muted sm:text-base">
            It is not trying to force one learning path. It gives you a clean way to
            move between reality, civilization, culture, frontier ideas, and the roles
            that make those systems tangible.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-editorial-muted sm:flex sm:flex-wrap">
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

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {featuredSubject ? (
              <Link
                href={`/${featuredSubject.slug}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-editorial-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-editorial-green/90 sm:w-auto"
              >
                Open a subject
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
            {featuredRole ? (
              <Link
                href={`/roles/${featuredRole.slug}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-editorial-blue-soft px-5 py-2.5 text-sm font-medium text-editorial-blue transition-colors hover:bg-editorial-blue/10 sm:w-auto"
              >
                Explore a role
              </Link>
            ) : null}
            {featuredTopic ? (
              <Link
                href={`/topics/${featuredTopic.slug}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-editorial-ink transition-colors hover:bg-editorial-canvas sm:w-auto"
              >
                Browse a topic
              </Link>
            ) : null}
          </div>
        </div>

        <div className="rounded-[30px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,252,247,0.82)] p-6 shadow-editorial-soft backdrop-blur-[18px] sm:p-8">
          <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
            Open by structure
          </p>
          <div className="mt-5 space-y-4">
            {STRUCTURE_CARDS.map((item) => {
              const Icon = item.icon

              return (
                <div
                  key={item.label}
                  className="rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-white/82 p-5 shadow-editorial-soft"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px]"
                      style={{ backgroundColor: `${item.color}16`, color: item.color }}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                        {item.label}
                      </p>
                      <h2 className="mt-2 font-serif text-2xl font-semibold text-editorial-ink">
                        {item.title}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-editorial-muted">
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

      <section className="grid gap-6 xl:grid-cols-[1fr,1.05fr]">
        <div className="rounded-[30px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.78)] p-6 shadow-editorial-soft sm:p-8">
          <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
            How Nexus works
          </p>
          <h2 className="mt-2 max-w-3xl font-serif text-3xl font-semibold text-editorial-ink sm:text-4xl">
            One map, three kinds of entry points
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-editorial-muted">
            Subjects are the stable base. Topics cut across them as bigger questions,
            tensions, or worldview frames. Roles sit on the outer layer, where knowledge
            becomes the perspective and pressure of a real person in the world.
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-editorial-muted sm:text-base">
            The point is to let you start from wherever your curiosity is strongest
            without losing the deeper structure underneath.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {TEACHING_LENSES.map((lens, index) => (
              <div
                key={lens.label}
                className="rounded-[20px] border border-[rgba(44,49,59,0.08)] bg-white/84 p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-editorial-green text-sm font-semibold text-white">
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

        <KnowledgeHierarchyScene className="h-full" />
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
            Explore the map
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-editorial-ink sm:text-4xl">
            Browse by the big domains of human reality
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-editorial-muted sm:text-base">
            These macro buckets sit above the raw catalog so the system stays navigable
            even as Nexus grows. Use them to jump into the part of the map you care
            about most, then move deeper through subjects, roles, and topics underneath.
          </p>
        </div>

        <MacroBucketExplorer groups={bucketGroups} />
      </section>
    </div>
  )
}
