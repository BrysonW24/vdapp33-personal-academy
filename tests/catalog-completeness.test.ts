import { describe, expect, it } from "vitest"
import { getSubjects } from "@/lib/content"
import { getRoles, getTopics } from "@/lib/entities"

const REQUIRED_SUBJECTS = [
  "physics",
  "quantum-science",
  "chemistry",
  "materials-science",
  "biology",
  "aerospace",
  "robotics",
  "rocket-science",
  "cybersecurity",
  "data-science",
  "space-infrastructure",
  "energy-systems",
  "systems-engineering",
  "software-engineering",
  "civil-engineering",
  "electrical-engineering",
  "mechanical-engineering",
  "politics",
  "law",
  "sociology",
  "geopolitics",
  "public-administration",
  "demography",
  "commercial-property-management",
  "finance-accounting",
  "supply-chain-logistics",
  "agriculture-food-systems",
  "biotechnology",
  "design",
  "typography",
  "religion-belief-systems",
  "psychology",
  "mathematics",
  "statistics-probability",
  "computer-science",
  "economics",
  "history-of-civilization",
  "anthropology",
  "linguistics",
  "medicine-human-physiology",
  "ecology-environmental-systems",
  "earth-science",
  "cosmology",
  "architecture-urbanism",
  "manufacturing-industry",
  "mining-resources",
  "maritime-systems",
  "defense-warfare",
  "intelligence-espionage",
  "media-systems",
  "institutional-power",
  "trade-globalization",
  "energy-geopolitics",
  "infrastructure-resilience",
  "education-learning-science",
  "ethics",
  "aesthetics",
  "literature",
  "mythology",
  "creativity",
  "rhetoric-persuasion",
  "conflict-negotiation",
  "identity-culture",
  "morality-values",
] as const

const REQUIRED_TOPICS = [
  "artificial-intelligence",
  "consciousness",
  "emotions",
  "evolution-and-animals",
  "investing",
  "love",
  "meditation",
  "music-and-instruments",
  "philosophy",
  "world-history",
  "ancient-history",
  "modern-history",
  "relationships",
  "money",
  "economics",
  "health",
  "communication",
  "self-knowledge",
  "civilization-i-ii-iii",
  "civilizational-scale",
  "rise-and-fall-of-civilizations",
  "deep-time",
  "human-condition",
  "power",
  "truth",
  "progress",
  "order-and-chaos",
  "scarcity-and-abundance",
  "collapse-and-renewal",
  "future-of-humanity",
  "existential-risk",
  "intelligence",
  "technology-and-meaning",
  "war-and-peace",
  "myth-and-modernity",
  "knowledge-itself",
  "meaning",
  "human-nature",
  "mortality",
  "time",
  "great-filters-and-fermi-paradox",
] as const

const REQUIRED_ROLES = [
  "astronaut",
  "ai-researcher",
  "diplomat",
  "entrepreneur-startup-founder",
  "intelligence-analyst",
  "pilot",
  "robotics-engineer",
] as const

describe("nexus catalog completeness", () => {
  it("includes the full required subject set", () => {
    const subjects = new Set(getSubjects().map((subject) => subject.slug))

    for (const slug of REQUIRED_SUBJECTS) {
      expect(subjects.has(slug)).toBe(true)
    }
  })

  it("includes the full required topic set", () => {
    const topics = new Set(getTopics().map((topic) => topic.slug))

    for (const slug of REQUIRED_TOPICS) {
      expect(topics.has(slug)).toBe(true)
    }
  })

  it("keeps the flagship role set live", () => {
    const roles = new Set(getRoles().map((role) => role.slug))

    for (const slug of REQUIRED_ROLES) {
      expect(roles.has(slug)).toBe(true)
    }
  })

  it("keeps economics available as both a subject and a topic", () => {
    const subjects = new Set(getSubjects().map((subject) => subject.slug))
    const topics = new Set(getTopics().map((topic) => topic.slug))

    expect(subjects.has("economics")).toBe(true)
    expect(topics.has("economics")).toBe(true)
  })

  it("registers biology and cosmology in sciences-facing canon", () => {
    const subjects = getSubjects()
    const biology = subjects.find((subject) => subject.slug === "biology")
    const cosmology = subjects.find((subject) => subject.slug === "cosmology")

    expect(biology?.group).toBe("sciences")
    expect(cosmology?.group).toBe("sciences")
  })
})
