import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  Clock3,
  FolderKanban,
  GraduationCap,
  Library,
  Sparkles,
  Wrench,
} from "lucide-react"
import { getSubjects, getSubjectStats } from "@/lib/content"
import {
  SUBJECT_GROUP_LABELS,
  type SubjectGroup,
  type SubjectManifest,
} from "@/types/curriculum"

function readinessLabel(stats: {
  frameworks: number
  projects: number
  tools: number
  dayInLife: number
}) {
  if (stats.projects === 0 && stats.tools === 0 && stats.frameworks === 0 && stats.dayInLife === 0) {
    return "Modules first"
  }

  if (stats.projects === 0 || stats.tools === 0) {
    return "Still filling out"
  }

  return "Rich subject"
}

type InterestingPath = {
  title: string
  summary: string
  note: string
  depth?: {
    coreWork: string
    frontierPull: string
    signals: string[]
  }
  relatedSubjects?: string[]
}

const INTERESTING_PATHS: Record<SubjectGroup, InterestingPath[]> = {
  sciences: [
    {
      title: "Astronaut",
      summary:
        "You train for years, work with extreme systems, and see Earth from orbit.",
      note: "A natural bridge into physics, aerospace, and rocket science.",
      relatedSubjects: ["physics", "aerospace", "rocket-science"],
    },
    {
      title: "AI Animal Communication Researcher",
      summary:
        "You build models that analyze animal signals, behaviour, and context to test whether AI can help humans interpret non-human communication.",
      note: "Interesting because it blends frontier AI with field biology, cognition, and one of the strangest questions in science.",
      depth: {
        coreWork:
          "This is really about multimodal pattern-finding across sound, movement, environment, and social behaviour rather than pretending translation is already solved.",
        frontierPull:
          "The exciting part is asking whether AI can surface structure humans keep missing in whale song, bird calls, primate gestures, or other non-human systems.",
        signals: ["Multimodal AI", "Bioacoustics", "Behaviour models", "Field data"],
      },
    },
    {
      title: "Wildlife Filmmaker",
      summary:
        "Part storyteller, part explorer, part survivalist, often in remote environments.",
      note: "Interesting because observation, patience, and exploration all matter at once.",
    },
    {
      title: "Surgeon",
      summary:
        "Technically demanding, high stakes, and deeply meaningful when done well.",
      note: "Precision, consequence, and embodied science all meet in one role.",
    },
    {
      title: "Deep-Sea Scientist",
      summary:
        "You study extreme environments, strange life, and hard-to-reach systems that most people never see firsthand.",
      note: "A science role driven by exploration, instrumentation, and wonder.",
      relatedSubjects: ["physics"],
    },
  ],
  engineering: [
    {
      title: "AI Researcher",
      summary:
        "You work on systems that can change how people learn, work, and build things.",
      note: "One of the clearest frontier roles if you are drawn to building the future directly.",
    },
    {
      title: "Formula 1 Engineer",
      summary:
        "High pressure, tiny margins, elite performance, and decisions that matter in seconds.",
      note: "A pure systems-and-performance obsession with almost no margin for sloppiness.",
      relatedSubjects: ["physics", "aerospace"],
    },
    {
      title: "Robotics Engineer",
      summary:
        "You combine software, hardware, AI, and real-world action to make machines do useful things.",
      note: "Interesting because it turns abstract intelligence into movement, action, and physical capability.",
    },
    {
      title: "Terraforming Systems Engineer",
      summary:
        "You think in atmospheres, habitats, water, energy, and what it would take to make hostile worlds support life.",
      note: "Interesting because it forces planetary-scale systems thinking across survival, ecology, and infrastructure.",
      depth: {
        coreWork:
          "The real work is less sci-fi branding and more closed-loop life support, materials, climate control, water cycles, and long-duration habitat design.",
        frontierPull:
          "It is compelling because every decision touches survival, ecology, logistics, and whether a human environment can become self-sustaining.",
        signals: ["Habitats", "Life support", "Climate systems", "Planetary infrastructure"],
      },
      relatedSubjects: ["physics", "aerospace", "rocket-science"],
    },
    {
      title: "Space Energy Systems Engineer",
      summary:
        "You work on harvesting, storing, and transmitting energy in orbit or on other worlds where every watt matters.",
      note: "Interesting because power generation becomes a mission-design problem, not just an electrical one.",
      depth: {
        coreWork:
          "This direction is about solar collection, storage, transmission, thermal constraints, and energy resilience under harsh orbital or planetary conditions.",
        frontierPull:
          "What makes it interesting is that power is never isolated; it shapes habitats, propulsion, communication, robotics, and mission survival all at once.",
        signals: ["Orbital power", "Storage", "Thermal systems", "Mission architecture"],
      },
      relatedSubjects: ["physics", "aerospace", "rocket-science"],
    },
    {
      title: "IoT Systems Builder",
      summary:
        "You connect sensors, devices, networks, and software so the physical world becomes measurable, reactive, and remotely controllable.",
      note: "Interesting because it pushes computation out of screens and into real environments.",
      depth: {
        coreWork:
          "It is really the craft of linking hardware, telemetry, networks, automation, and feedback loops so physical systems can sense and respond.",
        frontierPull:
          "The draw is that IoT stops software being abstract and turns it into something embedded in farms, homes, vehicles, factories, and remote infrastructure.",
        signals: ["Sensors", "Embedded systems", "Telemetry", "Automation loops"],
      },
      relatedSubjects: ["physics", "aerospace"],
    },
    {
      title: "Pilot",
      summary:
        "You operate complex machines in dynamic environments where judgement, calm, and systems thinking matter constantly.",
      note: "The role sits close to aerospace because performance, risk, and decision-making all stay live in the moment.",
      relatedSubjects: ["aerospace"],
    },
    {
      title: "Product Designer",
      summary:
        "You turn user needs into interfaces, systems, and experiences that people can actually understand and use.",
      note: "Interesting because it mixes structure, creativity, and systems thinking rather than living in only one of them.",
    },
  ],
  society: [
    {
      title: "Entrepreneur / Startup Founder",
      summary:
        "You build something from nothing, solve real problems, and shape the whole system.",
      note: "The role stays interesting because the job changes as fast as the system you are building.",
    },
    {
      title: "Forensic Psychologist",
      summary:
        "You study human behavior in complex legal and criminal contexts.",
      note: "Interesting because law, behaviour, evidence, and consequence all overlap.",
    },
    {
      title: "Documentary Journalist / War Correspondent",
      summary:
        "You work close to history as it happens, with all the risk and emotional weight that implies.",
      note: "One of the strongest links between curiosity, courage, and public meaning.",
      relatedSubjects: ["politics"],
    },
    {
      title: "Special Operations Medic / Rescue Specialist",
      summary:
        "A mix of medicine, endurance, decision-making, and operating in extreme conditions.",
      note: "Compelling because capability, service, and judgement all have to hold under pressure.",
    },
    {
      title: "Navy SEAL / Maritime Special Operations Operator",
      summary:
        "You operate in water, air, and land environments where endurance, adaptability, and mission execution all have to hold under extreme pressure.",
      note: "Interesting because it combines elite physical capability with systems thinking, stress tolerance, and real-world consequence.",
      depth: {
        coreWork:
          "The substance is not action-movie imagery but selection, team trust, mission planning, navigation, adaptability, and performing when fatigue and uncertainty are both high.",
        frontierPull:
          "What makes it compelling is the combination of discipline, brotherhood, risk, and the demand to stay precise when the environment is actively hostile.",
        signals: ["Selection", "Mission planning", "Maritime ops", "Stress tolerance"],
      },
      relatedSubjects: ["politics"],
    },
    {
      title: "Intelligence Analyst",
      summary:
        "You piece together incomplete information, look for patterns, and help decision-makers act under uncertainty.",
      note: "Interesting because interpretation, context, and consequence all matter more than raw data alone.",
      relatedSubjects: ["politics"],
    },
    {
      title: "CIA / Intelligence Officer",
      summary:
        "You work with incomplete information, clandestine context, and high-stakes judgement to understand threats, motives, and emerging patterns.",
      note: "Interesting because ambiguity, secrecy, geopolitics, and consequence all sit in the same room.",
      depth: {
        coreWork:
          "The substance is less movie mythology and more synthesis, tradecraft, geopolitics, risk judgement, and making sense of signals that are partial by definition.",
        frontierPull:
          "What gives it depth is that decisions happen under uncertainty, with real-world consequences and almost no clean feedback loops.",
        signals: ["Geopolitics", "Tradecraft", "Pattern analysis", "Decision support"],
      },
      relatedSubjects: ["politics"],
    },
    {
      title: "Omega / SAS Combat Operator",
      summary:
        "You operate in elite combat environments where small-team execution, resilience, and judgement matter more than brute force alone.",
      note: "Interesting because the role sits at the edge of strategy, violence, discipline, and national mission.",
      depth: {
        coreWork:
          "This direction is really about selection, fieldcraft, discipline, small-unit tactics, mission clarity, and staying effective when the margin for error disappears.",
        frontierPull:
          "Its depth comes from the way capability, loyalty, and consequence compress into decisions that have to be made fast and carried through cleanly.",
        signals: ["Fieldcraft", "Small-team ops", "Discipline", "Mission execution"],
      },
      relatedSubjects: ["politics"],
    },
    {
      title: "Diplomat",
      summary:
        "You work through negotiation, strategy, language, and statecraft in situations where relationships can matter as much as force.",
      note: "A role built around systems of power, persuasion, and long-horizon judgement.",
      relatedSubjects: ["politics"],
    },
  ],
}

const HONORABLE_MENTIONS: Record<SubjectGroup, string[]> = {
  sciences: ["Archaeologist"],
  engineering: [],
  society: [
    "Game designer",
    "Venture capitalist",
    "Creative director",
  ],
}

const CATEGORY_PERSPECTIVE: Record<SubjectGroup, string> = {
  sciences:
    "For people drawn to reality itself: discovery, evidence, extreme environments, and the structure of the world.",
  engineering:
    "For people drawn to building: systems, performance, control, design trade-offs, and making hard things work.",
  society:
    "For people drawn to people and power: institutions, behaviour, narrative, strategy, and high-consequence judgement.",
}

const PERSONAL_FIT_SPOTLIGHT = [
  "AI animal communication",
  "CIA / intelligence",
  "Navy SEAL / special operations",
  "Terraforming",
  "Space energy harvesting",
  "IoT systems",
  "AI researcher",
  "Robotics engineer",
  "Formula 1 engineer",
] as const

export default function PersonalAcademyHomePage() {
  const subjects = getSubjects()
  const grouped = subjects.reduce<Record<SubjectGroup, SubjectManifest[]>>(
    (acc, subject) => {
      if (!acc[subject.group]) acc[subject.group] = []
      acc[subject.group].push(subject)
      return acc
    },
    {} as Record<SubjectGroup, SubjectManifest[]>
  )

  const subjectStats = subjects.map((subject) => ({
    subject,
    stats: getSubjectStats(subject.slug),
  }))

  const totals = subjectStats.reduce(
    (acc, entry) => ({
      modules: acc.modules + entry.stats.modules,
      lessons: acc.lessons + entry.stats.lessons,
      frameworks: acc.frameworks + entry.stats.frameworks,
      projects: acc.projects + entry.stats.projects,
      tools: acc.tools + entry.stats.tools,
      dayInLife: acc.dayInLife + entry.stats.dayInLife,
    }),
    {
      modules: 0,
      lessons: 0,
      frameworks: 0,
      projects: 0,
      tools: 0,
      dayInLife: 0,
    }
  )

  const subjectStatsBySlug = new Map(
    subjectStats.map((entry) => [entry.subject.slug, entry.stats])
  )
  const subjectsBySlug = new Map(subjects.map((subject) => [subject.slug, subject]))

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr] mb-10">
        <div className="rounded-[28px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.8)] shadow-editorial-soft backdrop-blur-[18px] p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-editorial-blue text-white">
              <GraduationCap className="h-5 w-5" />
            </span>
            <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
              Unified multi-subject academy
            </p>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-editorial-ink mb-4">
            Personal Academy
          </h1>
          <p className="text-lg text-editorial-muted leading-relaxed max-w-2xl">
            Grow your mind through politics, commercial property management,
            physics, quantum, aerospace, robotics, and rocket science. One app,
            one shell, subject switching built in, with learning as the point.
          </p>

          <div className="flex flex-wrap gap-4 mt-6 text-sm text-editorial-muted">
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              {totals.modules} modules
            </span>
            <span className="flex items-center gap-1.5">
              <Library className="h-4 w-4" />
              {totals.frameworks} frameworks
            </span>
            <span className="flex items-center gap-1.5">
              <FolderKanban className="h-4 w-4" />
              {totals.projects} projects
            </span>
            <span className="flex items-center gap-1.5">
              <Wrench className="h-4 w-4" />
              {totals.tools} tools
            </span>
            <span className="flex items-center gap-1.5">
              <Clock3 className="h-4 w-4" />
              {totals.dayInLife} day-in-the-life stories
            </span>
          </div>

          {subjects[0] && (
            <div className="mt-6">
              <Link
                href={`/${subjects[0].slug}`}
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium bg-editorial-green text-white hover:bg-editorial-green/90 transition-colors"
              >
                Enter the academy
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>

        <div className="rounded-[28px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,252,247,0.82)] shadow-editorial-soft backdrop-blur-[18px] p-8">
          <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted mb-3">
            Doctrine
          </p>
          <h2 className="font-serif text-2xl font-semibold text-editorial-ink mb-3">
            Learning-first by design
          </h2>
          <div className="space-y-3 text-sm text-editorial-muted leading-relaxed">
            <p>Use this app for exploration, mastery, and sustained curiosity.</p>
            <p>Modules are the spine. Projects, tools, and frameworks deepen the subject when they exist.</p>
            <p>The wider ecosystem can inspire the journey without flattening every direction into one subject map.</p>
          </div>
        </div>
      </section>

      <section className="mb-10 rounded-[28px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.8)] shadow-editorial-soft backdrop-blur-[18px] p-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-editorial-amber text-white">
            <Sparkles className="h-5 w-5" />
          </span>
          <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
            Frontier directions mix
          </p>
        </div>

        <h2 className="font-serif text-3xl font-semibold text-editorial-ink mb-3">
          Frontier directions worth orbiting around
        </h2>
        <p className="text-editorial-muted leading-relaxed max-w-3xl mb-6">
          This is not just a jobs list. It is a map of deeper directions:
          operating environments, frontier problem spaces, and high-stakes directions
          that make the academy feel connected to the kinds of lives and systems
          you actually care about.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {PERSONAL_FIT_SPOTLIGHT.map((item) => (
            <span
              key={item}
              className="inline-block rounded-full px-3 py-1 text-xs font-medium bg-editorial-blue-soft text-editorial-blue"
            >
              Strong fit: {item}
            </span>
          ))}
        </div>

        {(Object.entries(grouped) as [SubjectGroup, SubjectManifest[]][]).map(
          ([group, groupSubjects]) => (
            <section key={group} className="mb-8 last:mb-0">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h3 className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
                  {SUBJECT_GROUP_LABELS[group]}
                </h3>
                <span className="text-xs text-editorial-muted">
                  {groupSubjects.length} subjects
                </span>
                <span className="text-xs text-editorial-muted">
                  {INTERESTING_PATHS[group].length} frontier directions
                </span>
              </div>
              <p className="text-sm text-editorial-muted leading-relaxed mb-5 max-w-3xl">
                {CATEGORY_PERSPECTIVE[group]}
              </p>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {groupSubjects.map((subject) => {
                  const stats = subjectStatsBySlug.get(subject.slug)
                  if (!stats) return null

                  return (
                    <Link
                      key={subject.slug}
                      href={`/${subject.slug}`}
                      className="rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.78)] shadow-editorial-soft backdrop-blur-[18px] p-6 hover:shadow-editorial-hover transition-shadow"
                    >
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <span className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                          Academy subject
                        </span>
                        <span className="text-xs text-editorial-muted">
                          {readinessLabel(stats)}
                        </span>
                      </div>

                      <span
                        className="inline-block h-2.5 w-12 rounded-full mb-4"
                        style={{ backgroundColor: subject.color }}
                      />

                      <h4 className="font-serif text-2xl font-semibold text-editorial-ink mb-2">
                        {subject.name}
                      </h4>
                      <p className="text-sm text-editorial-muted leading-relaxed mb-4">
                        {subject.tagline}
                      </p>

                      <div className="flex flex-wrap gap-2 text-xs text-editorial-muted">
                        <span>{stats.modules} modules</span>
                        <span>·</span>
                        <span>{stats.lessons} lessons</span>
                        <span>·</span>
                        <span>{stats.frameworks} frameworks</span>
                        <span>·</span>
                        <span>{stats.projects} projects</span>
                      </div>
                    </Link>
                  )
                })}

                {INTERESTING_PATHS[group].map((path) => (
                  <div
                    key={path.title}
                    className="rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,252,247,0.84)] p-6 shadow-editorial-soft"
                  >
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                        Frontier direction
                      </span>
                      {path.relatedSubjects?.length ? (
                        <span className="text-xs text-editorial-muted">
                          {path.relatedSubjects.length} related subjects
                        </span>
                      ) : null}
                    </div>

                    <h4 className="font-serif text-xl font-semibold text-editorial-ink mb-2">
                      {path.title}
                    </h4>
                    <p className="text-sm text-editorial-muted leading-relaxed mb-3">
                      {path.summary}
                    </p>
                    <p className="text-xs text-editorial-muted leading-relaxed mb-4">
                      {path.note}
                    </p>

                    {path.depth ? (
                      <div className="mt-4 space-y-3 border-t border-[rgba(44,49,59,0.08)] pt-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted mb-1.5">
                            Core work
                          </p>
                          <p className="text-xs text-editorial-muted leading-relaxed">
                            {path.depth.coreWork}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted mb-1.5">
                            Frontier pull
                          </p>
                          <p className="text-xs text-editorial-muted leading-relaxed">
                            {path.depth.frontierPull}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted mb-2">
                            Inside it
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {path.depth.signals.map((signal) => (
                              <span
                                key={`${path.title}-${signal}`}
                                className="inline-block rounded-full px-2.5 py-1 text-[11px] font-medium bg-[rgba(44,49,59,0.06)] text-editorial-muted"
                              >
                                {signal}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {path.relatedSubjects?.length ? (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {path.relatedSubjects.map((slug) => {
                          const subject = subjectsBySlug.get(slug)
                          if (!subject) return null

                          return (
                            <Link
                              key={`${path.title}-${slug}`}
                              href={`/${slug}`}
                              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium bg-editorial-blue-soft text-editorial-blue hover:bg-editorial-blue/10 transition-colors"
                            >
                              Explore {subject.name}
                            </Link>
                          )
                        })}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>

              {HONORABLE_MENTIONS[group].length > 0 && (
                <div className="mt-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted mb-3">
                    Honorable mentions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {HONORABLE_MENTIONS[group].map((item) => (
                      <span
                        key={item}
                        className="inline-block rounded-full px-3 py-1 text-xs font-medium bg-[rgba(44,49,59,0.06)] text-editorial-muted"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )
        )}
      </section>
    </div>
  )
}
