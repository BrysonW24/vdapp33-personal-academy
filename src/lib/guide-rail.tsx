import { GuideRail, type GuideRailProps } from "@/components/guidance/GuideRail"
import { getSubject } from "@/lib/content"
import {
  getEntityRelated,
  getRole,
  getRoles,
  getTopic,
  getTopics,
} from "@/lib/entities"
import { getSignalDigest, getSourcePack } from "@/lib/guidance-content"
import type { EntityKind } from "@/types/curriculum"

type AdjacentLink = NonNullable<GuideRailProps["adjacent"]>[number]

interface BuildGuideRailInput {
  entity: GuideRailProps["entity"]
  whyThisMatters: string
  nextAction?: GuideRailProps["nextAction"]
  applyPrompt: string
  debatePrompt: string
  truthPrompt: string
  adjacent?: AdjacentLink[]
}

function getEntityHref(kind: EntityKind, slug: string) {
  switch (kind) {
    case "subject":
      return `/${slug}`
    case "role":
      return `/roles/${slug}`
    case "topic":
      return `/topics/${slug}`
  }
}

function dedupeAdjacentLinks(items: AdjacentLink[]) {
  const seen = new Set<string>()

  return items.filter((item) => {
    if (seen.has(item.href)) return false
    seen.add(item.href)
    return true
  })
}

function buildSubjectAdjacentLinks(subjectSlug: string): AdjacentLink[] {
  const roleLinks = getRoles()
    .filter((role) =>
      getEntityRelated("role", role.slug).relatedSubjects.includes(subjectSlug)
    )
    .slice(0, 2)
    .map((role) => ({
      href: `/roles/${role.slug}`,
      label: role.name,
      description: role.tagline,
    }))

  const topicLinks = getTopics()
    .filter((topic) =>
      getEntityRelated("topic", topic.slug).relatedSubjects.includes(subjectSlug)
    )
    .slice(0, 2)
    .map((topic) => ({
      href: `/topics/${topic.slug}`,
      label: topic.name,
      description: topic.tagline,
    }))

  return dedupeAdjacentLinks([...roleLinks, ...topicLinks]).slice(0, 3)
}

function buildOverlayAdjacentLinks(kind: "role" | "topic", slug: string): AdjacentLink[] {
  const related = getEntityRelated(kind, slug)

  const subjectLinks = related.relatedSubjects
    .map((subjectSlug) => getSubject(subjectSlug))
    .filter((subject): subject is NonNullable<ReturnType<typeof getSubject>> => Boolean(subject))
    .map((subject) => ({
      href: `/${subject.slug}`,
      label: subject.name,
      description: subject.tagline,
    }))

  const roleLinks = related.relatedRoles
    .filter((relatedSlug) => relatedSlug !== slug)
    .map((relatedSlug) => getRole(relatedSlug))
    .filter((role): role is NonNullable<ReturnType<typeof getRole>> => Boolean(role))
    .map((role) => ({
      href: `/roles/${role.slug}`,
      label: role.name,
      description: role.tagline,
    }))

  const topicLinks = related.relatedTopics
    .filter((relatedSlug) => relatedSlug !== slug)
    .map((relatedSlug) => getTopic(relatedSlug))
    .filter((topic): topic is NonNullable<ReturnType<typeof getTopic>> => Boolean(topic))
    .map((topic) => ({
      href: `/topics/${topic.slug}`,
      label: topic.name,
      description: topic.tagline,
    }))

  return dedupeAdjacentLinks([...subjectLinks, ...roleLinks, ...topicLinks]).slice(0, 3)
}

function buildDefaultAdjacentLinks(kind: EntityKind, slug: string) {
  if (kind === "subject") return buildSubjectAdjacentLinks(slug)
  return buildOverlayAdjacentLinks(kind, slug)
}

export function buildGuideRail({
  entity,
  whyThisMatters,
  nextAction,
  applyPrompt,
  debatePrompt,
  truthPrompt,
  adjacent = [],
}: BuildGuideRailInput) {
  const sourcePack = getSourcePack(entity.kind, entity.slug)
  const signalDigest = getSignalDigest(entity.kind, entity.slug)
  const combinedAdjacent = dedupeAdjacentLinks([
    ...adjacent,
    ...buildDefaultAdjacentLinks(entity.kind, entity.slug),
  ]).slice(0, 3)

  return (
    <GuideRail
      entity={entity}
      whyThisMatters={whyThisMatters}
      nextAction={nextAction}
      applyPrompt={applyPrompt}
      debatePrompt={debatePrompt}
      truthPrompt={truthPrompt}
      adjacent={combinedAdjacent}
      sourcePack={sourcePack}
      signalDigest={signalDigest}
    />
  )
}

export function buildEntityLink(kind: EntityKind, slug: string, label: string, description?: string) {
  return {
    href: getEntityHref(kind, slug),
    label,
    description,
  }
}
