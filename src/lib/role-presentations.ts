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

export interface RoleIntroCard {
  eyebrow: string
  title: string
  body: string
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
    },
    {
      eyebrow: "Why it exists",
      title: "What it is there to handle",
      body:
        firstParagraph(overview.frontierPull) ||
        "This role exists because some environments need higher judgment, stronger systems awareness, and steadier execution than casual interest can provide.",
    },
    {
      eyebrow: "What people do",
      title: "Work in practice",
      body:
        overview.whatPeopleDo[0] ||
        firstParagraph(overview.coreWork) ||
        "The day-to-day work blends technical judgment, communication, and repeated execution under real constraints.",
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
