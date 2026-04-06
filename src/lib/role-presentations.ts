import type {
  HeroSceneConnection,
  HeroSceneNode,
} from "@/components/academy/hero/hero-utils"
import type {
  EntityDependencyConnection,
  EntityDependencyNode,
  EntityReadinessStage,
  EntitySignalMetric,
} from "@/components/entities/EntitySignalDashboard"
import type { CareerLadderStage } from "@/components/visualizations/CareerLadder"
import type {
  ExposureAxis,
  ExposureProfile,
} from "@/components/visualizations/ExposureMap"
import { firstParagraph } from "@/lib/prose"
import type { EntityManifest, RoleOverview } from "@/types/entity"
import {
  Brain,
  Clock3,
  Compass,
  Cpu,
  Eye,
  FileText,
  Gauge,
  Globe,
  Handshake,
  Languages,
  Lightbulb,
  Plane,
  Radar,
  Rocket,
  Scale,
  Search,
  Shield,
  Sparkles,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react"

export interface RoleIntroCard {
  eyebrow: string
  title: string
  body: string
  icon?: LucideIcon
}

export interface RolePresentation {
  heroVariant?: "orbital" | "gradient" | "minimal"
  heroNodes?: HeroSceneNode[]
  heroConnections?: HeroSceneConnection[]
  quickCards: RoleIntroCard[]
  dashboard: {
    eyebrow?: string
    title: string
    summary: string
    complexityScore: number
    demandMetrics: EntitySignalMetric[]
    operationalSignals: EntitySignalMetric[]
    readinessStages: EntityReadinessStage[]
    dependencyNodes: EntityDependencyNode[]
    dependencyConnections: EntityDependencyConnection[]
  }
  exposure: {
    title: string
    summary: string
    axes: ExposureAxis[]
    profiles: ExposureProfile[]
  }
  career: {
    title: string
    summary: string
    stages: CareerLadderStage[]
  }
}

const DEFAULT_EXPOSURE_AXES: ExposureAxis[] = [
  { key: "technical", label: "Technical depth" },
  { key: "pressure", label: "Pressure" },
  { key: "coordination", label: "Coordination" },
  { key: "bureaucracy", label: "Institutional complexity" },
  { key: "public", label: "Public visibility" },
  { key: "risk", label: "Consequence of error" },
]

function makeSignalMetrics(values: string[], color: string) {
  return values.slice(0, 4).map((label, index) => ({
    label,
    value: Math.max(55, 88 - index * 7),
    color,
  }))
}

function defaultQuickCards(overview: RoleOverview): RoleIntroCard[] {
  return [
    {
      eyebrow: "What it is",
      title: "The shape of the role",
      body: firstParagraph(overview.summary) || overview.title,
      icon: Compass,
    },
    {
      eyebrow: "Why it exists",
      title: "What it is there to handle",
      body:
        firstParagraph(overview.frontierPull) ||
        "This role exists because some environments need higher judgment, stronger systems awareness, and steadier execution than casual interest can provide.",
      icon: Clock3,
    },
    {
      eyebrow: "What people do",
      title: "Work in practice",
      body:
        overview.whatPeopleDo[0] ||
        firstParagraph(overview.coreWork) ||
        "The day-to-day work blends technical judgment, communication, and repeated execution under real constraints.",
      icon: Wrench,
    },
    {
      eyebrow: "What it rewards",
      title: "What people need to be strong in",
      body:
        overview.strengths[0] ||
        overview.careerLevers[0] ||
        "The role rewards discipline, judgment, and the ability to stay useful when conditions get harder.",
      icon: Sparkles,
    },
  ]
}

function buildDefaultPresentation(
  role: EntityManifest,
  overview: RoleOverview
): RolePresentation {
  return {
    heroVariant: "gradient",
    quickCards: defaultQuickCards(overview),
    dashboard: {
      eyebrow: "Role shape",
      title: `${role.name} at a glance`,
      summary:
        "Use this as a fast operating picture: what the role rewards, where the pressure sits, and how the work compounds over time.",
      complexityScore: Math.min(97, 74 + overview.signals.length * 2),
      demandMetrics: makeSignalMetrics(
        overview.strengths.length > 0 ? overview.strengths : overview.signals,
        role.color
      ),
      operationalSignals: [
        {
          label: "Decision speed",
          value: 78,
          color: role.color,
        },
        {
          label: "Cross-functional work",
          value: 84,
          color: role.color,
        },
        {
          label: "Institutional exposure",
          value: overview.exposures.length > 0 ? 86 : 68,
          color: role.color,
        },
        {
          label: "Career leverage",
          value: overview.careerLevers.length > 0 ? 80 : 70,
          color: role.color,
        },
      ],
      readinessStages: [
        {
          label: "Orientation",
          detail: "Understand what the role is actually for and what the environment demands.",
          active: true,
        },
        {
          label: "Capability build",
          detail:
            overview.howPeopleGetThere ||
            "Build the technical base, operating habits, and institutional literacy the role depends on.",
        },
        {
          label: "Pressure handling",
          detail:
            overview.whoThrivesHere ||
            "Learn to stay clear and useful when coordination, ambiguity, and consequence rise.",
        },
        {
          label: "Role leverage",
          detail:
            overview.careerLevers[0] ||
            "Progress comes from better judgment, stronger communication, and more trust with harder responsibilities.",
        },
      ],
      dependencyNodes: [
        { id: "discipline", label: "Core discipline", shortLabel: "Discipline", color: role.color },
        { id: "judgment", label: "Judgment", shortLabel: "Judgment", color: "#2C6AA0" },
        { id: "coordination", label: "Coordination", shortLabel: "Coordination", color: "#5B8F7D" },
        { id: "institutions", label: "Institutions", shortLabel: "Institutions", color: "#D38A5C" },
        { id: "pressure", label: "Pressure", shortLabel: "Pressure", color: "#8A63D2" },
      ],
      dependencyConnections: [
        { from: "discipline", to: "judgment" },
        { from: "discipline", to: "coordination" },
        { from: "judgment", to: "pressure" },
        { from: "coordination", to: "institutions" },
        { from: "institutions", to: "pressure" },
      ],
    },
    exposure: {
      title: "What the role exposes you to",
      summary:
        "These are the pressure surfaces people in the field keep running into. They help explain why the role feels the way it does.",
      axes: DEFAULT_EXPOSURE_AXES,
      profiles: [
        {
          label: "Typical operating profile",
          description: "A broad estimate of what the role usually exposes you to.",
          values: {
            technical: 4,
            pressure: 4,
            coordination: 4,
            bureaucracy: 3,
            public: 2,
            risk: 4,
          },
        },
      ],
    },
    career: {
      title: "How careers usually compound",
      summary:
        "Most roles reward compounding judgment. People move forward by handling more ambiguity, stronger tradeoffs, and harder coordination without losing clarity.",
      stages:
        overview.careerPath.length > 0
          ? overview.careerPath.map((stage, index) => ({
              title: stage,
              summary:
                index === 0
                  ? "Build the base the field expects before the role becomes realistic."
                  : index === overview.careerPath.length - 1
                    ? "Later progression comes from broader judgment, stronger trust, and harder responsibilities."
                    : "Each step usually reflects more trust, better pattern recognition, and exposure to tougher problems.",
            }))
          : [
              {
                title: "Foundational base",
                summary: "Build the technical or institutional foundation the field expects.",
              },
              {
                title: "Trusted operator",
                summary: "Show that you can do the work reliably, not just talk about it.",
              },
              {
                title: "High-leverage contributor",
                summary: "Take on harder decisions, cross-functional work, or more exposed problems.",
              },
              {
                title: "Senior judgment role",
                summary: "Progress by becoming unusually clear, dependable, and useful in demanding situations.",
              },
            ],
    },
  }
}

function makeOrbitalRolePresentation(config: {
  heroNodes: HeroSceneNode[]
  quickCards: RoleIntroCard[]
  dashboard: RolePresentation["dashboard"]
  exposure: RolePresentation["exposure"]
  career: RolePresentation["career"]
}): RolePresentation {
  return {
    heroVariant: "orbital",
    heroNodes: config.heroNodes,
    quickCards: config.quickCards,
    dashboard: config.dashboard,
    exposure: config.exposure,
    career: config.career,
  }
}

const ROLE_PRESENTATIONS: Partial<Record<string, RolePresentation>> = {
  astronaut: {
    heroVariant: "orbital",
    heroNodes: [
      {
        label: "Flight systems",
        description: "Vehicle, power, thermal, comms",
        color: "#4A90E2",
        angle: 300,
      },
      {
        label: "Science payloads",
        description: "Microgravity experiments and data collection",
        color: "#5B8F7D",
        angle: 355,
      },
      {
        label: "EVA operations",
        description: "Spacewalk procedures and tool discipline",
        color: "#D38A5C",
        angle: 55,
      },
      {
        label: "Crew discipline",
        description: "Calmness, teamwork, communication",
        color: "#8A63D2",
        angle: 120,
      },
      {
        label: "Robotics",
        description: "Canadarm and external handling",
        color: "#2C6AA0",
        angle: 190,
      },
      {
        label: "Mission control",
        description: "Ground coordination and procedures",
        color: "#F18B4C",
        angle: 245,
      },
    ],
    heroConnections: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
      { from: 5, to: 0 },
      { from: 0, to: 3 },
      { from: 1, to: 4 },
      { from: 2, to: 5 },
    ],
    quickCards: [
      {
        eyebrow: "What it is",
        title: "A frontier systems role",
        body:
          "Astronaut is less about spectacle than about becoming a deeply reliable operator inside the most unforgiving environment humans work in.",
      },
      {
        eyebrow: "Where it came from",
        title: "Cold War roots, international mission",
        body:
          "The role began with military test-pilot culture during the early space race, then expanded into a far more international engineer-scientist-operator profile through shuttle and ISS eras.",
      },
      {
        eyebrow: "Why it matters",
        title: "Human presence beyond Earth",
        body:
          "Astronauts sit where engineering, science, physiology, and mission discipline meet. They are the human layer that keeps complex space systems usable, safe, and extendable.",
      },
    ],
    dashboard: {
      eyebrow: "Role signal map",
      title: "Read the role in one screen",
      summary:
        "Astronaut is a systems-heavy, high-trust role. It rewards technical range, calm under pressure, disciplined teamwork, and the ability to stay useful in a hostile environment for long stretches.",
      complexityScore: 96,
      demandMetrics: [
        { label: "Systems literacy", value: 96, color: "#4A90E2" },
        { label: "Pressure handling", value: 94, color: "#D38A5C" },
        { label: "Crew coordination", value: 91, color: "#8A63D2" },
        { label: "Physical readiness", value: 86, color: "#5B8F7D" },
      ],
      operationalSignals: [
        { label: "Consequence of error", value: 98, color: "#F18B4C" },
        { label: "Procedure density", value: 93, color: "#2C6AA0" },
        { label: "Cross-disciplinary work", value: 90, color: "#5B8F7D" },
        { label: "Public visibility", value: 74, color: "#8A63D2" },
      ],
      readinessStages: [
        {
          label: "Operational base",
          detail: "Build a serious technical or flight discipline with evidence of real responsibility.",
        },
        {
          label: "Astronaut candidate",
          detail: "Pass selection, then train intensively across spacecraft systems, EVA, survival, and mission operations.",
          active: true,
        },
        {
          label: "Mission specialist",
          detail: "Gain trust inside simulations, support roles, and crew integration before assignment.",
        },
        {
          label: "Flight leadership",
          detail: "Progress through harder mission responsibilities and broader crew or systems accountability.",
        },
      ],
      dependencyNodes: [
        { id: "orbital", label: "Orbital mechanics", shortLabel: "Orbital", color: "#4A90E2" },
        { id: "systems", label: "Spacecraft systems", shortLabel: "Systems", color: "#2C6AA0" },
        { id: "science", label: "Science payloads", shortLabel: "Science", color: "#5B8F7D" },
        { id: "eva", label: "EVA discipline", shortLabel: "EVA", color: "#D38A5C" },
        { id: "crew", label: "Crew judgment", shortLabel: "Crew", color: "#8A63D2" },
      ],
      dependencyConnections: [
        { from: "orbital", to: "systems" },
        { from: "systems", to: "science" },
        { from: "systems", to: "eva" },
        { from: "science", to: "crew" },
        { from: "eva", to: "crew" },
        { from: "orbital", to: "crew" },
      ],
    },
    exposure: {
      title: "Where the role gets demanding",
      summary:
        "Astronaut is unusual because the pressure profile changes across training and flight. The work is bureaucratic and procedural on the ground, then physically and operationally intense in orbit.",
      axes: [
        { key: "technical", label: "Technical load" },
        { key: "physical", label: "Physical strain" },
        { key: "isolation", label: "Isolation / confinement" },
        { key: "coordination", label: "Crew coordination" },
        { key: "procedure", label: "Procedure density" },
        { key: "media", label: "Public / media" },
      ],
      profiles: [
        {
          label: "Training phase",
          description: "Most of the career is ground-based preparation, simulation, and systems study.",
          values: {
            technical: 5,
            physical: 4,
            isolation: 2,
            coordination: 4,
            procedure: 5,
            media: 2,
          },
        },
        {
          label: "Mission phase",
          description: "Actual flight compresses technical, physical, and interpersonal demands into one environment.",
          values: {
            technical: 5,
            physical: 5,
            isolation: 5,
            coordination: 5,
            procedure: 5,
            media: 3,
          },
        },
      ],
    },
    career: {
      title: "How astronaut careers usually compound",
      summary:
        "Astronaut careers compound through operational credibility. People move forward by proving they can absorb complexity, stay calm, and become trustworthy in harder mission contexts.",
      stages: [
        {
          title: "Technical or operational base",
          summary: "Engineering, science, medicine, or military aviation backgrounds create the initial credibility.",
          detail: "Advanced STEM education and real operational responsibility matter more than romantic interest in space.",
        },
        {
          title: "Astronaut candidate training",
          summary: "Selection is followed by intensive training across systems, Russian, EVA, robotics, and emergency response.",
        },
        {
          title: "Mission integration",
          summary: "You earn flight roles by becoming dependable in simulations, support assignments, and crew settings.",
        },
        {
          title: "Senior crew trust",
          summary: "Later progression comes from broader mission leadership, harder operations, and stronger cross-agency judgment.",
        },
      ],
    },
  },

  "ai-researcher": makeOrbitalRolePresentation({
    heroNodes: [
      {
        label: "Math",
        description: "Linear algebra, probability, optimisation",
        color: "#8B5CF6",
        angle: 300,
      },
      {
        label: "Code",
        description: "Research code and experiment plumbing",
        color: "#6366F1",
        angle: 355,
      },
      {
        label: "Compute",
        description: "GPUs, clusters, and training runs",
        color: "#0EA5E9",
        angle: 50,
      },
      {
        label: "Experiments",
        description: "Hypotheses, ablations, and benchmarks",
        color: "#059669",
        angle: 110,
      },
      {
        label: "Papers",
        description: "Read, write, and review findings",
        color: "#F59E0B",
        angle: 180,
      },
      {
        label: "Deployment",
        description: "Turn results into useful systems",
        color: "#DC2626",
        angle: 245,
      },
    ],
    quickCards: [
      {
        eyebrow: "What it is",
        title: "A research role for machine intelligence",
        body: "You turn mathematical ideas into experiments, systems, and evidence.",
        icon: Brain,
      },
      {
        eyebrow: "Where it came from",
        title: "From statistics to deep learning",
        body: "The role grew out of mathematics, computer science, and neural-network research, then accelerated with large-scale compute.",
        icon: Clock3,
      },
      {
        eyebrow: "What people do",
        title: "Run experiments that survive scrutiny",
        body: "Read papers, write code, train models, debug failures, and explain what the results actually mean.",
        icon: FileText,
      },
      {
        eyebrow: "What it rewards",
        title: "Rigour, patience, and scepticism",
        body: "The best people are strong in math, coding, clear thinking, and the willingness to test ideas properly.",
        icon: Sparkles,
      },
    ],
    dashboard: {
      eyebrow: "Research signal map",
      title: "Read the role in one screen",
      summary:
        "AI research rewards mathematical rigour, experimental patience, and the habit of turning uncertainty into reproducible evidence.",
      complexityScore: 95,
      demandMetrics: [
        { label: "Math rigour", value: 96, color: "#8B5CF6" },
        { label: "Experiment design", value: 94, color: "#6366F1" },
        { label: "Coding fluency", value: 91, color: "#0EA5E9" },
        { label: "Reading stamina", value: 88, color: "#059669" },
      ],
      operationalSignals: [
        { label: "Compute intensity", value: 95, color: "#8B5CF6" },
        { label: "Frontier churn", value: 93, color: "#F59E0B" },
        { label: "Peer review pressure", value: 89, color: "#DC2626" },
        { label: "Reproducibility", value: 87, color: "#6366F1" },
      ],
      readinessStages: [
        {
          label: "Foundations",
          detail: "Build the math, statistics, and coding base that lets you read and implement research.",
        },
        {
          label: "Experiment loop",
          detail: "Learn to turn hypotheses into clean experiments, ablations, and benchmarks.",
          active: true,
        },
        {
          label: "Research leverage",
          detail: "Contribute ideas that survive comparison, scrutiny, and reproduction.",
        },
        {
          label: "Frontier judgement",
          detail: "Progress by making better calls about what matters, what works, and what to ignore.",
        },
      ],
      dependencyNodes: [
        { id: "math", label: "Math", shortLabel: "Math", color: "#8B5CF6" },
        { id: "code", label: "Code", shortLabel: "Code", color: "#6366F1" },
        { id: "compute", label: "Compute", shortLabel: "Compute", color: "#0EA5E9" },
        { id: "experiments", label: "Experiments", shortLabel: "Tests", color: "#059669" },
        { id: "papers", label: "Papers", shortLabel: "Papers", color: "#F59E0B" },
        { id: "deployment", label: "Deployment", shortLabel: "Deploy", color: "#DC2626" },
      ],
      dependencyConnections: [
        { from: "math", to: "code" },
        { from: "code", to: "compute" },
        { from: "compute", to: "experiments" },
        { from: "experiments", to: "papers" },
        { from: "papers", to: "deployment" },
        { from: "deployment", to: "math" },
      ],
    },
    exposure: {
      title: "Where the role gets demanding",
      summary:
        "AI research lives inside a fast-moving frontier. The work is technical, expensive, and heavily shaped by compute, scrutiny, and changing benchmarks.",
      axes: [
        { key: "technical", label: "Technical depth" },
        { key: "compute", label: "Compute pressure" },
        { key: "uncertainty", label: "Research uncertainty" },
        { key: "pace", label: "Frontier pace" },
        { key: "review", label: "Peer review" },
        { key: "public", label: "Public impact" },
      ],
      profiles: [
        {
          label: "Typical research loop",
          description: "Most of the role is iteration: read, implement, test, compare, refine.",
          values: {
            technical: 5,
            compute: 5,
            uncertainty: 5,
            pace: 5,
            review: 4,
            public: 3,
          },
        },
      ],
    },
    career: {
      title: "How AI research careers usually compound",
      summary:
        "People progress by showing they can produce credible results, not just interesting ideas.",
      stages: [
        {
          title: "Foundations builder",
          summary: "Learn math, coding, and experiment discipline deeply.",
        },
        {
          title: "Research assistant / engineer",
          summary: "Reproduce work, run experiments, and support active research streams.",
        },
        {
          title: "Junior researcher",
          summary: "Own hypotheses, experiments, and writeups with growing independence.",
        },
        {
          title: "Frontier specialist",
          summary: "Drive research directions and create work others rely on.",
        },
      ],
    },
  }),

  diplomat: makeOrbitalRolePresentation({
    heroNodes: [
      {
        label: "Protocol",
        description: "Formal rules, timing, and statecraft",
        color: "#DC2626",
        angle: 300,
      },
      {
        label: "Languages",
        description: "Listening, nuance, and translation",
        color: "#F59E0B",
        angle: 350,
      },
      {
        label: "Negotiation",
        description: "Find the narrow band of agreement",
        color: "#2563EB",
        angle: 40,
      },
      {
        label: "Institutions",
        description: "Ministries, embassies, and multilateral bodies",
        color: "#8B5CF6",
        angle: 120,
      },
      {
        label: "Crisis",
        description: "Consular support and escalation",
        color: "#059669",
        angle: 200,
      },
      {
        label: "Statecraft",
        description: "Long-term strategic relationship building",
        color: "#0EA5E9",
        angle: 250,
      },
    ],
    quickCards: [
      {
        eyebrow: "What it is",
        title: "A negotiation role in the state system",
        body: "You represent a country, protect interests, and keep difficult relationships workable.",
        icon: Globe,
      },
      {
        eyebrow: "Where it came from",
        title: "Ancient envoys to modern foreign service",
        body: "The work grew from court emissaries and wartime envoys into a professional foreign policy service.",
        icon: Languages,
      },
      {
        eyebrow: "What people do",
        title: "Write, negotiate, brief, and de-escalate",
        body: "Most of the work is cables, talking points, relationship building, and careful negotiations.",
        icon: Handshake,
      },
      {
        eyebrow: "What it rewards",
        title: "Patience, precision, and trust",
        body: "The role rewards language skill, judgement, memory for people, and the ability to stay steady in ambiguity.",
        icon: Scale,
      },
    ],
    dashboard: {
      eyebrow: "Statecraft signal map",
      title: "Read the role in one screen",
      summary:
        "Diplomacy is slow, relationship-heavy, and high-stakes. Good diplomats pair precision with patience and know how to keep talks alive.",
      complexityScore: 88,
      demandMetrics: [
        { label: "Language skill", value: 94, color: "#DC2626" },
        { label: "Negotiation", value: 96, color: "#2563EB" },
        { label: "Protocol", value: 90, color: "#F59E0B" },
        { label: "Relationship memory", value: 92, color: "#8B5CF6" },
      ],
      operationalSignals: [
        { label: "Crisis response", value: 87, color: "#059669" },
        { label: "Travel and posting", value: 83, color: "#0EA5E9" },
        { label: "Inter-agency coordination", value: 86, color: "#8B5CF6" },
        { label: "Public scrutiny", value: 78, color: "#DC2626" },
      ],
      readinessStages: [
        {
          label: "Policy base",
          detail: "Learn government process, international affairs, and precise writing.",
        },
        {
          label: "Posting and protocol",
          detail: "Build credibility in embassies, delegations, and official settings.",
          active: true,
        },
        {
          label: "Negotiation work",
          detail: "Carry harder conversations and translate political goals into workable agreements.",
        },
        {
          label: "Senior representation",
          detail: "Progress by being trusted with sensitive relationships and strategic judgement.",
        },
      ],
      dependencyNodes: [
        { id: "protocol", label: "Protocol", shortLabel: "Protocol", color: "#DC2626" },
        { id: "languages", label: "Languages", shortLabel: "Lang", color: "#F59E0B" },
        { id: "negotiation", label: "Negotiation", shortLabel: "Deal", color: "#2563EB" },
        { id: "institutions", label: "Institutions", shortLabel: "Inst", color: "#8B5CF6" },
        { id: "crisis", label: "Crisis", shortLabel: "Crisis", color: "#059669" },
        { id: "statecraft", label: "Statecraft", shortLabel: "State", color: "#0EA5E9" },
      ],
      dependencyConnections: [
        { from: "protocol", to: "languages" },
        { from: "languages", to: "negotiation" },
        { from: "negotiation", to: "institutions" },
        { from: "institutions", to: "crisis" },
        { from: "crisis", to: "statecraft" },
        { from: "statecraft", to: "protocol" },
      ],
    },
    exposure: {
      title: "Where the role gets demanding",
      summary:
        "Diplomacy exposes you to negotiations, protocol, consular pressure, and long-term reputational stakes.",
      axes: [
        { key: "language", label: "Language" },
        { key: "negotiation", label: "Negotiation" },
        { key: "protocol", label: "Protocol" },
        { key: "travel", label: "Travel / postings" },
        { key: "scrutiny", label: "Public scrutiny" },
        { key: "risk", label: "High consequence" },
      ],
      profiles: [
        {
          label: "Typical posting",
          description: "A mix of reporting, representation, crisis handling, and relationship building.",
          values: {
            language: 4,
            negotiation: 5,
            protocol: 4,
            travel: 4,
            scrutiny: 3,
            risk: 4,
          },
        },
      ],
    },
    career: {
      title: "How diplomacy careers usually compound",
      summary:
        "Progress comes from better writing, better judgement, and stronger trust across institutions.",
      stages: [
        {
          title: "Policy and language base",
          summary: "Build the written and analytical discipline behind the role.",
        },
        {
          title: "Desk officer / junior posting",
          summary: "Learn protocol, reporting, and how institutions actually speak to one another.",
        },
        {
          title: "Negotiator / counsellor",
          summary: "Take on harder relationships, briefs, and negotiation surfaces.",
        },
        {
          title: "Ambassador / senior representative",
          summary: "Earn trust with harder geopolitical problems and more delicate public responsibilities.",
        },
      ],
    },
  }),

  "entrepreneur-startup-founder": makeOrbitalRolePresentation({
    heroNodes: [
      {
        label: "Customer",
        description: "Interviews, pain points, and demand",
        color: "#F59E0B",
        angle: 300,
      },
      {
        label: "Product",
        description: "Build something people will use",
        color: "#059669",
        angle: 350,
      },
      {
        label: "Sales",
        description: "Distribution and revenue",
        color: "#DC2626",
        angle: 45,
      },
      {
        label: "Capital",
        description: "Runway, pricing, and fundraising",
        color: "#8B5CF6",
        angle: 120,
      },
      {
        label: "Team",
        description: "Hiring, culture, and alignment",
        color: "#2563EB",
        angle: 200,
      },
      {
        label: "Systems",
        description: "Operations that let the company scale",
        color: "#0EA5E9",
        angle: 255,
      },
    ],
    quickCards: [
      {
        eyebrow: "What it is",
        title: "A role for building from zero",
        body: "You create something people want, then build the company that can keep delivering it.",
        icon: Lightbulb,
      },
      {
        eyebrow: "Where it came from",
        title: "From merchants to startups",
        body: "The modern founder role comes from commerce, software, and the venture-backed company era.",
        icon: Clock3,
      },
      {
        eyebrow: "What people do",
        title: "Sell, build, hire, and decide",
        body: "Founders spend most of their time on customers, cash, product, recruiting, and strategy.",
        icon: Users,
      },
      {
        eyebrow: "What it rewards",
        title: "Speed, taste, and persistence",
        body: "The role rewards strong judgment, distribution instincts, resilience, and the ability to keep moving.",
        icon: Rocket,
      },
    ],
    dashboard: {
      eyebrow: "Founding signal map",
      title: "Read the role in one screen",
      summary:
        "Founders turn uncertainty into an operating system. Distribution, cash, hiring, and judgement are the real game.",
      complexityScore: 94,
      demandMetrics: [
        { label: "Customer insight", value: 96, color: "#F59E0B" },
        { label: "Distribution", value: 95, color: "#DC2626" },
        { label: "Capital discipline", value: 91, color: "#8B5CF6" },
        { label: "Team building", value: 90, color: "#2563EB" },
      ],
      operationalSignals: [
        { label: "Cash pressure", value: 96, color: "#F59E0B" },
        { label: "Hiring load", value: 89, color: "#059669" },
        { label: "Market uncertainty", value: 94, color: "#0EA5E9" },
        { label: "Public visibility", value: 82, color: "#DC2626" },
      ],
      readinessStages: [
        {
          label: "Problem discovery",
          detail: "Learn to hear pain clearly and define a real market problem.",
        },
        {
          label: "Early product / sales",
          detail: "Build, sell, and iterate before the company has much structure.",
          active: true,
        },
        {
          label: "Team and capital",
          detail: "Hire, fundraise, and set up the operating system around the product.",
        },
        {
          label: "Scale and stewardship",
          detail: "Grow the company without losing clarity, speed, or customer focus.",
        },
      ],
      dependencyNodes: [
        { id: "customer", label: "Customer", shortLabel: "Cust", color: "#F59E0B" },
        { id: "product", label: "Product", shortLabel: "Prod", color: "#059669" },
        { id: "sales", label: "Sales", shortLabel: "Sell", color: "#DC2626" },
        { id: "capital", label: "Capital", shortLabel: "Cash", color: "#8B5CF6" },
        { id: "team", label: "Team", shortLabel: "Team", color: "#2563EB" },
        { id: "systems", label: "Systems", shortLabel: "Ops", color: "#0EA5E9" },
      ],
      dependencyConnections: [
        { from: "customer", to: "product" },
        { from: "product", to: "sales" },
        { from: "sales", to: "capital" },
        { from: "capital", to: "team" },
        { from: "team", to: "systems" },
        { from: "systems", to: "customer" },
      ],
    },
    exposure: {
      title: "Where the role gets demanding",
      summary:
        "Founding exposes you to cash pressure, customer uncertainty, hiring problems, legal complexity, and public failure.",
      axes: [
        { key: "cash", label: "Cash pressure" },
        { key: "customers", label: "Customer uncertainty" },
        { key: "hiring", label: "Hiring load" },
        { key: "legal", label: "Legal complexity" },
        { key: "public", label: "Public visibility" },
        { key: "speed", label: "Speed / change" },
      ],
      profiles: [
        {
          label: "Typical founder",
          description: "A mix of product, sales, operations, and leadership pressure.",
          values: {
            cash: 5,
            customers: 5,
            hiring: 4,
            legal: 3,
            public: 4,
            speed: 5,
          },
        },
      ],
    },
    career: {
      title: "How founding careers usually compound",
      summary:
        "People progress by finding distribution, making good decisions with little information, and building trust with customers and teams.",
      stages: [
        {
          title: "Builder / operator",
          summary: "Learn how products, customers, and systems behave in real conditions.",
        },
        {
          title: "Founding employee / co-founder",
          summary: "Take on multiple jobs and help turn an idea into a business.",
        },
        {
          title: "Founder",
          summary: "Own product direction, cash, people, and market positioning.",
        },
        {
          title: "Platform builder",
          summary: "Turn one company into a repeatable operating and category-shaping system.",
        },
      ],
    },
  }),

  "intelligence-analyst": makeOrbitalRolePresentation({
    heroNodes: [
      {
        label: "Collection",
        description: "Sources, feeds, and raw inputs",
        color: "#6366F1",
        angle: 300,
      },
      {
        label: "Sources",
        description: "Credibility and reliability",
        color: "#0EA5E9",
        angle: 350,
      },
      {
        label: "Analysis",
        description: "Pattern detection and judgement",
        color: "#8B5CF6",
        angle: 45,
      },
      {
        label: "Briefing",
        description: "Convert insight into decision support",
        color: "#F59E0B",
        angle: 120,
      },
      {
        label: "Deception",
        description: "Adversarial information environments",
        color: "#DC2626",
        angle: 200,
      },
      {
        label: "Decisions",
        description: "Help leaders act under uncertainty",
        color: "#059669",
        angle: 255,
      },
    ],
    quickCards: [
      {
        eyebrow: "What it is",
        title: "A role for structured judgement",
        body: "You turn incomplete and sometimes deceptive information into useful assessments.",
        icon: Eye,
      },
      {
        eyebrow: "Where it came from",
        title: "From wartime bureaus to modern analysis",
        body: "The field grew out of military intelligence and now spans multi-source, data-heavy analysis.",
        icon: Radar,
      },
      {
        eyebrow: "What people do",
        title: "Read, cross-reference, and brief",
        body: "Analysts collect evidence, test assumptions, and write short products that decision-makers can use.",
        icon: Search,
      },
      {
        eyebrow: "What it rewards",
        title: "Bias control and clarity",
        body: "The role rewards skepticism, structure, discretion, and the ability to say what is known versus assessed.",
        icon: Shield,
      },
    ],
    dashboard: {
      eyebrow: "Analytic signal map",
      title: "Read the role in one screen",
      summary:
        "Analysts turn incomplete information into usable judgement under deliberate deception and real pressure.",
      complexityScore: 90,
      demandMetrics: [
        { label: "Bias control", value: 95, color: "#6366F1" },
        { label: "Source evaluation", value: 93, color: "#0EA5E9" },
        { label: "Brief writing", value: 92, color: "#8B5CF6" },
        { label: "Pattern recognition", value: 91, color: "#059669" },
      ],
      operationalSignals: [
        { label: "Secrecy", value: 96, color: "#DC2626" },
        { label: "Uncertainty", value: 94, color: "#8B5CF6" },
        { label: "Adversarial data", value: 92, color: "#0EA5E9" },
        { label: "Decision pressure", value: 90, color: "#F59E0B" },
      ],
      readinessStages: [
        {
          label: "Evidence discipline",
          detail: "Learn to separate fact, inference, and judgement cleanly.",
        },
        {
          label: "Collection and synthesis",
          detail: "Work with multiple sources and build a reliable picture from fragments.",
          active: true,
        },
        {
          label: "Briefing and decision support",
          detail: "Turn analysis into concise products that guide action.",
        },
        {
          label: "Strategic estimation",
          detail: "Progress by handling more sensitive, harder, and higher-stakes problems.",
        },
      ],
      dependencyNodes: [
        { id: "collection", label: "Collection", shortLabel: "Coll", color: "#6366F1" },
        { id: "sources", label: "Sources", shortLabel: "Src", color: "#0EA5E9" },
        { id: "analysis", label: "Analysis", shortLabel: "Anal", color: "#8B5CF6" },
        { id: "briefing", label: "Briefing", shortLabel: "Brief", color: "#F59E0B" },
        { id: "deception", label: "Deception", shortLabel: "Decep", color: "#DC2626" },
        { id: "decisions", label: "Decisions", shortLabel: "Decide", color: "#059669" },
      ],
      dependencyConnections: [
        { from: "collection", to: "sources" },
        { from: "sources", to: "analysis" },
        { from: "analysis", to: "briefing" },
        { from: "briefing", to: "decisions" },
        { from: "decisions", to: "deception" },
        { from: "deception", to: "collection" },
      ],
    },
    exposure: {
      title: "Where the role gets demanding",
      summary:
        "The field is shaped by secrecy, deadlines, adversarial information, and the need to be precise about confidence.",
      axes: [
        { key: "secrecy", label: "Secrecy" },
        { key: "uncertainty", label: "Uncertainty" },
        { key: "deadline", label: "Deadline pressure" },
        { key: "adversarial", label: "Adversarial data" },
        { key: "coordination", label: "Coordination" },
        { key: "public", label: "Public visibility" },
      ],
      profiles: [
        {
          label: "Typical analyst",
          description: "Most of the job is working with fragments and turning them into a defensible judgement.",
          values: {
            secrecy: 5,
            uncertainty: 5,
            deadline: 4,
            adversarial: 5,
            coordination: 4,
            public: 1,
          },
        },
      ],
    },
    career: {
      title: "How intelligence careers usually compound",
      summary:
        "Progress comes from sharper judgement, better evidence handling, and trust with higher-stakes audiences.",
      stages: [
        {
          title: "Analytic foundation",
          summary: "Learn the tradecraft of evidence, confidence, and structured judgement.",
        },
        {
          title: "Junior analyst",
          summary: "Produce short briefs, maintain portfolios, and build pattern recognition.",
        },
        {
          title: "Senior analyst",
          summary: "Own more difficult portfolios and make higher-confidence assessments.",
        },
        {
          title: "Strategic estimator",
          summary: "Shape decisions by handling the hardest uncertainty with clarity.",
        },
      ],
    },
  }),

  pilot: makeOrbitalRolePresentation({
    heroNodes: [
      {
        label: "Weather",
        description: "Forecasts, alternates, and go/no-go calls",
        color: "#0EA5E9",
        angle: 300,
      },
      {
        label: "Aircraft systems",
        description: "Engines, electrics, hydraulics, and automation",
        color: "#2563EB",
        angle: 350,
      },
      {
        label: "Checklist",
        description: "Procedures and standard operating rhythm",
        color: "#059669",
        angle: 50,
      },
      {
        label: "Crew",
        description: "Shared judgement and workload management",
        color: "#F59E0B",
        angle: 120,
      },
      {
        label: "ATC",
        description: "Clear communication and coordination",
        color: "#8B5CF6",
        angle: 200,
      },
      {
        label: "Safety",
        description: "Margin, discipline, and contingency thinking",
        color: "#DC2626",
        angle: 255,
      },
    ],
    quickCards: [
      {
        eyebrow: "What it is",
        title: "A machine operation role under pressure",
        body: "You fly complex aircraft safely by combining preparation, judgement, and crew coordination.",
        icon: Plane,
      },
      {
        eyebrow: "Where it came from",
        title: "From early aviation to airline systems",
        body: "The role grew out of flight testing, wartime flying, and the rise of commercial air travel.",
        icon: Clock3,
      },
      {
        eyebrow: "What people do",
        title: "Plan, monitor, communicate, and decide",
        body: "Pilots spend most of their time on weather, systems, SOPs, checks, and crew coordination.",
        icon: Gauge,
      },
      {
        eyebrow: "What it rewards",
        title: "Judgement and calm procedure",
        body: "The best pilots are disciplined, safety-minded, and unusually good at staying composed when plans break.",
        icon: Sparkles,
      },
    ],
    dashboard: {
      eyebrow: "Flight signal map",
      title: "Read the role in one screen",
      summary:
        "Pilots live inside procedures, weather, and crew judgement. The visible flying is built on discipline.",
      complexityScore: 91,
      demandMetrics: [
        { label: "Judgement", value: 96, color: "#0EA5E9" },
        { label: "Procedures", value: 94, color: "#2563EB" },
        { label: "Crew resource mgmt", value: 92, color: "#059669" },
        { label: "Situational awareness", value: 93, color: "#F59E0B" },
      ],
      operationalSignals: [
        { label: "Weather", value: 96, color: "#0EA5E9" },
        { label: "Fatigue", value: 88, color: "#8B5CF6" },
        { label: "Procedure density", value: 95, color: "#2563EB" },
        { label: "Public scrutiny", value: 82, color: "#DC2626" },
      ],
      readinessStages: [
        {
          label: "Licence base",
          detail: "Build the theory, flying hours, and instrument discipline required to fly legally and safely.",
        },
        {
          label: "Multi-crew operation",
          detail: "Learn CRM, airline SOPs, and the rhythm of operating in a team.",
          active: true,
        },
        {
          label: "Line flying",
          detail: "Work with real passengers, real weather, and real operational constraints.",
        },
        {
          label: "Captaincy",
          detail: "Earn trust by making better calls when the flight stops being routine.",
        },
      ],
      dependencyNodes: [
        { id: "weather", label: "Weather", shortLabel: "Wx", color: "#0EA5E9" },
        { id: "systems", label: "Systems", shortLabel: "Sys", color: "#2563EB" },
        { id: "checklist", label: "Checklist", shortLabel: "SOP", color: "#059669" },
        { id: "crew", label: "Crew", shortLabel: "Crew", color: "#F59E0B" },
        { id: "atc", label: "ATC", shortLabel: "ATC", color: "#8B5CF6" },
        { id: "safety", label: "Safety", shortLabel: "Safe", color: "#DC2626" },
      ],
      dependencyConnections: [
        { from: "weather", to: "systems" },
        { from: "systems", to: "checklist" },
        { from: "checklist", to: "crew" },
        { from: "crew", to: "atc" },
        { from: "atc", to: "safety" },
        { from: "safety", to: "weather" },
      ],
    },
    exposure: {
      title: "Where the role gets demanding",
      summary:
        "Pilots are exposed to weather, fatigue, procedure density, and the consequences of very small mistakes.",
      axes: [
        { key: "weather", label: "Weather" },
        { key: "fatigue", label: "Fatigue" },
        { key: "procedure", label: "Procedure density" },
        { key: "coordination", label: "Crew coordination" },
        { key: "public", label: "Public scrutiny" },
        { key: "risk", label: "Consequence of error" },
      ],
      profiles: [
        {
          label: "Typical line flight",
          description: "The job looks calm because the preparation is intense and the procedures are tight.",
          values: {
            weather: 4,
            fatigue: 4,
            procedure: 5,
            coordination: 5,
            public: 3,
            risk: 5,
          },
        },
      ],
    },
    career: {
      title: "How pilot careers usually compound",
      summary:
        "Progress comes from hours, judgement, and trust in increasingly complex operating environments.",
      stages: [
        {
          title: "Licence and hours",
          summary: "Build the basic aeronautical knowledge and flying hours required to start.",
        },
        {
          title: "Regional or instructor work",
          summary: "Learn to make safe calls in busy, varied, and often under-resourced conditions.",
        },
        {
          title: "Airline first officer",
          summary: "Operate multi-crew aircraft with strong procedural discipline and CRM.",
        },
        {
          title: "Captain / training captain",
          summary: "Earn authority by making better decisions in harder conditions and teaching others well.",
        },
      ],
    },
  }),

  "robotics-engineer": makeOrbitalRolePresentation({
    heroNodes: [
      {
        label: "Mechanics",
        description: "Frames, actuators, and motion",
        color: "#059669",
        angle: 300,
      },
      {
        label: "Electronics",
        description: "Sensors, power, and embedded control",
        color: "#0EA5E9",
        angle: 350,
      },
      {
        label: "Perception",
        description: "Cameras, LiDAR, and sensing",
        color: "#2563EB",
        angle: 45,
      },
      {
        label: "Control",
        description: "Planning and feedback loops",
        color: "#F59E0B",
        angle: 120,
      },
      {
        label: "Simulation",
        description: "Models that approximate the real world",
        color: "#8B5CF6",
        angle: 200,
      },
      {
        label: "Field tests",
        description: "Real-world validation and iteration",
        color: "#DC2626",
        angle: 255,
      },
    ],
    quickCards: [
      {
        eyebrow: "What it is",
        title: "A role for making machines act in the real world",
        body: "You combine software, hardware, and control to make machines do useful things reliably.",
        icon: Cpu,
      },
      {
        eyebrow: "Where it came from",
        title: "Industrial automation to embodied AI",
        body: "The field grew from robotics labs and factories into a broad discipline spanning autonomy and physical systems.",
        icon: Clock3,
      },
      {
        eyebrow: "What people do",
        title: "Build, integrate, test, and debug",
        body: "Robotics engineers work across perception, control, mechanics, electronics, and field validation.",
        icon: Wrench,
      },
      {
        eyebrow: "What it rewards",
        title: "Systems thinking with hardware instincts",
        body: "The role rewards patience, simulation discipline, and a willingness to debug the physical world.",
        icon: Sparkles,
      },
    ],
    dashboard: {
      eyebrow: "Robotics signal map",
      title: "Read the role in one screen",
      summary:
        "Robotics combines software, hardware, control, and physical testing. The field rewards people who can close the sim-to-real gap.",
      complexityScore: 92,
      demandMetrics: [
        { label: "Systems thinking", value: 95, color: "#059669" },
        { label: "Integration", value: 94, color: "#0EA5E9" },
        { label: "Control design", value: 92, color: "#2563EB" },
        { label: "Field testing", value: 91, color: "#F59E0B" },
      ],
      operationalSignals: [
        { label: "Hardware failures", value: 95, color: "#DC2626" },
        { label: "Sim-to-real gap", value: 94, color: "#8B5CF6" },
        { label: "Safety constraints", value: 92, color: "#059669" },
        { label: "Iteration speed", value: 89, color: "#0EA5E9" },
      ],
      readinessStages: [
        {
          label: "Foundations",
          detail: "Learn mechatronics, coding, control, and the hardware you are working with.",
        },
        {
          label: "Integration work",
          detail: "Make perception, motion, and control systems work together reliably.",
          active: true,
        },
        {
          label: "Field validation",
          detail: "Test in the real world, close the gap, and improve failure handling.",
        },
        {
          label: "Robotics system lead",
          detail: "Progress by owning harder machines and more complicated operational environments.",
        },
      ],
      dependencyNodes: [
        { id: "mechanics", label: "Mechanics", shortLabel: "Mech", color: "#059669" },
        { id: "electronics", label: "Electronics", shortLabel: "Elec", color: "#0EA5E9" },
        { id: "perception", label: "Perception", shortLabel: "Sense", color: "#2563EB" },
        { id: "control", label: "Control", shortLabel: "Ctrl", color: "#F59E0B" },
        { id: "simulation", label: "Simulation", shortLabel: "Sim", color: "#8B5CF6" },
        { id: "field", label: "Field tests", shortLabel: "Field", color: "#DC2626" },
      ],
      dependencyConnections: [
        { from: "mechanics", to: "electronics" },
        { from: "electronics", to: "perception" },
        { from: "perception", to: "control" },
        { from: "control", to: "simulation" },
        { from: "simulation", to: "field" },
        { from: "field", to: "mechanics" },
      ],
    },
    exposure: {
      title: "Where the role gets demanding",
      summary:
        "Robotics exposes you to integration problems, hardware failure, field testing, and the reality that software has physical consequences.",
      axes: [
        { key: "integration", label: "Integration" },
        { key: "hardware", label: "Hardware failure" },
        { key: "field", label: "Field testing" },
        { key: "safety", label: "Safety" },
        { key: "simulation", label: "Sim-to-real gap" },
        { key: "physical", label: "Physical environment" },
      ],
      profiles: [
        {
          label: "Typical robotics cycle",
          description: "A constant loop of building, testing, and fixing physical systems.",
          values: {
            integration: 5,
            hardware: 5,
            field: 4,
            safety: 5,
            simulation: 5,
            physical: 5,
          },
        },
      ],
    },
    career: {
      title: "How robotics careers usually compound",
      summary:
        "Progress comes from building systems that survive contact with the real world.",
      stages: [
        {
          title: "Foundations",
          summary: "Learn the control, hardware, and software base that robotics needs.",
        },
        {
          title: "Integration engineer",
          summary: "Make subsystems work together and debug the unexpected.",
        },
        {
          title: "Robotics engineer",
          summary: "Own robots, test plans, and the move from simulation to reality.",
        },
        {
          title: "Systems lead",
          summary: "Lead harder deployments, safer machines, and larger operational scopes.",
        },
      ],
    },
  }),
}

export function getRolePresentation(
  role: EntityManifest,
  overview: RoleOverview
): RolePresentation {
  const custom = ROLE_PRESENTATIONS[role.slug]
  if (!custom) return buildDefaultPresentation(role, overview)

  const fallback = buildDefaultPresentation(role, overview)

  return {
    ...fallback,
    ...custom,
    dashboard: {
      ...fallback.dashboard,
      ...custom.dashboard,
    },
    exposure: {
      ...fallback.exposure,
      ...custom.exposure,
    },
    career: {
      ...fallback.career,
      ...custom.career,
    },
  }
}
