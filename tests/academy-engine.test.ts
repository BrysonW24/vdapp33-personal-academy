import { describe, expect, it } from "vitest"
import {
  buildPathState,
  buildUserProfile,
  generateLearningBlueprint,
  getEntityPathReason,
} from "@/lib/academy-engine"
import type {
  AcademyCatalog,
  ArchetypeProfile,
  OnboardingQuestionBank,
  ReviewEntry,
} from "@/types/guidance"

const questionBank: OnboardingQuestionBank = {
  steps: [
    {
      slug: "purpose",
      title: "Purpose",
      description: "Why are you here?",
      questions: [
        {
          id: "q-purpose",
          prompt: "What kind of intelligence do you want to build?",
          type: "single-choice",
          required: true,
          options: [
            {
              id: "physics-first",
              label: "Scientific foundations",
              description: "Bias toward reality, first principles, and technical depth.",
              weights: {
                "reality-foundations": 4,
                "engineered-civilization": 1,
              },
              signals: {
                subjects: ["physics"],
                topics: ["energy"],
                roles: ["astronaut"],
                mode: "guided",
                intensity: "balanced",
                sessionStyle: "deep",
                structure: "structured",
                weeklyHours: 6,
              },
            },
            {
              id: "human-systems",
              label: "Human systems",
              description: "Bias toward institutions, power, and social judgment.",
              weights: {
                "human-systems": 4,
              },
              signals: {
                subjects: ["politics"],
                topics: ["consciousness"],
                roles: ["diplomat"],
                mode: "explorer",
                intensity: "gentle",
                sessionStyle: "micro",
                structure: "adaptive",
                weeklyHours: 3,
              },
            },
          ],
        },
        {
          id: "q-style",
          prompt: "How do you like to learn?",
          type: "single-choice",
          required: true,
          options: [
            {
              id: "structured-deep",
              label: "Structured depth",
              description: "One core subject, one support topic, clear rhythm.",
              weights: {
                "reality-foundations": 2,
                "role-synthesis": 1,
              },
              signals: {
                subjects: ["physics"],
                topics: ["energy"],
                roles: ["astronaut"],
                mode: "guided",
                intensity: "balanced",
                sessionStyle: "deep",
                structure: "structured",
                weeklyHours: 5,
              },
            },
          ],
        },
      ],
    },
  ],
}

const archetypes: ArchetypeProfile[] = [
  {
    slug: "reality-foundations",
    name: "Reality Foundations",
    summary: "Start with the physical and historical base layer.",
    thesis: "Matter, time, causality, and civilization first.",
    fitSignals: ["first principles", "world models"],
    defaults: {
      coreSubjects: ["physics", "politics"],
      supportingTopics: ["energy", "consciousness"],
      roles: ["astronaut", "diplomat"],
      mode: "guided",
      reviewRhythm: "Weekly review every Sunday.",
      milestoneTemplate:
        "Build a durable map of {coreSubject}, then connect it to {supportingTopic} through the {role} lens.",
      weeklyCadencePresets: {
        gentle: "Three short sessions each week.",
        balanced: "Five focused sessions each week.",
        ambitious: "Daily depth with one synthesis session.",
        obsessive: "Daily depth plus project work on weekends.",
      },
    },
  },
  {
    slug: "engineered-civilization",
    name: "Engineered Civilization",
    summary: "Understand how systems are built and operated.",
    thesis: "Use engineering and applied systems as the central lane.",
    fitSignals: ["systems", "operators"],
    defaults: {
      coreSubjects: ["physics"],
      supportingTopics: ["energy"],
      roles: ["astronaut"],
      mode: "guided",
      reviewRhythm: "Weekly review every Sunday.",
      milestoneTemplate: "Use {coreSubject} to understand how {supportingTopic} becomes real-world infrastructure.",
      weeklyCadencePresets: {
        gentle: "Three short sessions each week.",
        balanced: "Five focused sessions each week.",
        ambitious: "Daily depth with one synthesis session.",
        obsessive: "Daily depth plus project work on weekends.",
      },
    },
  },
  {
    slug: "human-systems",
    name: "Human Systems",
    summary: "Learn institutions, people, and power.",
    thesis: "Understand human coordination before optimization.",
    fitSignals: ["institutions", "power"],
    defaults: {
      coreSubjects: ["politics"],
      supportingTopics: ["consciousness"],
      roles: ["diplomat"],
      mode: "explorer",
      reviewRhythm: "Weekly review every Sunday.",
      milestoneTemplate: "Trace how {coreSubject} and {supportingTopic} shape collective decision-making.",
      weeklyCadencePresets: {
        gentle: "Three short sessions each week.",
        balanced: "Five focused sessions each week.",
        ambitious: "Daily depth with one synthesis session.",
        obsessive: "Daily depth plus project work on weekends.",
      },
    },
  },
  {
    slug: "meaning-and-depth",
    name: "Meaning and Depth",
    summary: "Keep the inner life integrated with the outer world.",
    thesis: "Reflection sharpens intelligence.",
    fitSignals: ["reflection", "wisdom"],
    defaults: {
      coreSubjects: ["politics"],
      supportingTopics: ["consciousness"],
      roles: ["diplomat"],
      mode: "explorer",
      reviewRhythm: "Weekly review every Sunday.",
      milestoneTemplate: "Use {coreSubject} and {supportingTopic} to deepen judgment and reflection.",
      weeklyCadencePresets: {
        gentle: "Three short sessions each week.",
        balanced: "Five focused sessions each week.",
        ambitious: "Daily depth with one synthesis session.",
        obsessive: "Daily depth plus project work on weekends.",
      },
    },
  },
  {
    slug: "role-synthesis",
    name: "Role Synthesis",
    summary: "Move through the academy via embodied roles.",
    thesis: "Roles force application and integration.",
    fitSignals: ["application", "role tracks"],
    defaults: {
      coreSubjects: ["physics"],
      supportingTopics: ["energy"],
      roles: ["astronaut"],
      mode: "operator",
      reviewRhythm: "Weekly review every Sunday.",
      milestoneTemplate: "Turn {coreSubject} into real-world judgment through {role}.",
      weeklyCadencePresets: {
        gentle: "Three short sessions each week.",
        balanced: "Five focused sessions each week.",
        ambitious: "Daily depth with one synthesis session.",
        obsessive: "Daily depth plus project work on weekends.",
      },
    },
  },
]

const catalog: AcademyCatalog = {
  subjects: [
    {
      slug: "physics",
      name: "Physics",
      kind: "subject",
      tagline: "The rules of matter, motion, and energy.",
      moduleCount: 2,
      projectCount: 1,
      toolCount: 1,
      firstModuleSlug: "motion",
      firstModuleTitle: "Motion",
      firstProjectSlug: "orbital-model",
      firstProjectTitle: "Build an orbital model",
      modules: [
        {
          slug: "motion",
          title: "Motion",
          lessons: ["lift-and-drag", "energy-transfer"],
        },
        {
          slug: "fields",
          title: "Fields",
          lessons: ["electromagnetism"],
        },
      ],
      sourceAvailable: true,
      signalAvailable: true,
    },
    {
      slug: "politics",
      name: "Politics",
      kind: "subject",
      tagline: "Institutions, incentives, and power.",
      moduleCount: 1,
      projectCount: 1,
      toolCount: 0,
      firstModuleSlug: "institutions",
      firstModuleTitle: "Institutions",
      firstProjectSlug: "policy-brief",
      firstProjectTitle: "Write a policy brief",
      modules: [
        {
          slug: "institutions",
          title: "Institutions",
          lessons: ["state-capacity"],
        },
      ],
      sourceAvailable: true,
      signalAvailable: false,
    },
  ],
  topics: [
    {
      slug: "energy",
      name: "Energy",
      kind: "topic",
      tagline: "Generation, storage, transmission, and transition.",
      moduleCount: 4,
      projectCount: 2,
      toolCount: 1,
      sourceAvailable: true,
      signalAvailable: true,
    },
    {
      slug: "consciousness",
      name: "Consciousness",
      kind: "topic",
      tagline: "Subjective experience and the hard problem.",
      moduleCount: 2,
      projectCount: 1,
      toolCount: 0,
      sourceAvailable: true,
      signalAvailable: false,
    },
  ],
  roles: [
    {
      slug: "astronaut",
      name: "Astronaut",
      kind: "role",
      tagline: "Operate complex systems in extreme environments.",
      moduleCount: 4,
      projectCount: 1,
      toolCount: 1,
      sourceAvailable: true,
      signalAvailable: true,
    },
    {
      slug: "diplomat",
      name: "Diplomat",
      kind: "role",
      tagline: "Negotiate in systems of power and trust.",
      moduleCount: 3,
      projectCount: 1,
      toolCount: 1,
      sourceAvailable: true,
      signalAvailable: false,
    },
  ],
}

describe("academy engine", () => {
  it("builds a user profile from onboarding answers", () => {
    const profile = buildUserProfile(
      questionBank,
      {
        "q-purpose": ["physics-first"],
        "q-style": ["structured-deep"],
      },
      {
        reflection: "I want first principles and real-world application.",
      }
    )

    expect(profile.leadingArchetype).toBe("reality-foundations")
    expect(profile.preferredSubjects[0]).toBe("physics")
    expect(profile.preferredTopics[0]).toBe("energy")
    expect(profile.preferredRoles[0]).toBe("astronaut")
    expect(profile.preferredMode).toBe("guided")
    expect(profile.weeklyHours).toBe(6)
  })

  it("generates three path options and defaults to the recommended path", () => {
    const blueprint = generateLearningBlueprint({
      questionBank,
      archetypes,
      answers: {
        "q-purpose": ["physics-first"],
        "q-style": ["structured-deep"],
      },
      reflections: {},
      catalog,
    })

    expect(blueprint.activePathId).toBe("recommended")
    expect(blueprint.options).toHaveLength(3)
    expect(blueprint.options[0].assignment.coreSubject).toBe("physics")
    expect(blueprint.options[0].assignment.supportingTopic).toBe("energy")
    expect(blueprint.options[0].assignment.roleLens).toBe("astronaut")
    expect(blueprint.options[0].assignment.currentProject?.projectSlug).toBe(
      "orbital-model"
    )
  })

  it("prioritizes deterministic next actions by mode", () => {
    const blueprint = generateLearningBlueprint({
      questionBank,
      archetypes,
      answers: {
        "q-purpose": ["physics-first"],
        "q-style": ["structured-deep"],
      },
      reflections: {},
      catalog,
    })

    const reviews: ReviewEntry[] = []
    const guidedState = buildPathState({
      blueprint,
      mode: "guided",
      catalog,
      progress: { subjects: {} },
      reviews,
    })

    expect(guidedState.reviewDue).toBe(true)
    expect(guidedState.todaySession?.category).toBe("core-subject")
    expect(guidedState.todaySession?.href).toBe("/physics/modules/motion/lift-and-drag")

    const operatorState = buildPathState({
      blueprint,
      mode: "operator",
      catalog,
      progress: { subjects: {} },
      reviews,
    })

    expect(operatorState.nextActions[0]?.category).toBe("current-project")
    expect(operatorState.nextActions[1]?.category).toBe("role-application")
  })

  it("explains why an entity is on the active path", () => {
    const blueprint = generateLearningBlueprint({
      questionBank,
      archetypes,
      answers: {
        "q-purpose": ["physics-first"],
        "q-style": ["structured-deep"],
      },
      reflections: {},
      catalog,
    })

    const activePath = blueprint.options[0]

    expect(
      getEntityPathReason(activePath, {
        kind: "subject",
        slug: "physics",
        name: "Physics",
      })
    ).toContain("current core subject")

    expect(
      getEntityPathReason(activePath, {
        kind: "topic",
        slug: "consciousness",
        name: "Consciousness",
      })
    ).toBeNull()
  })
})
