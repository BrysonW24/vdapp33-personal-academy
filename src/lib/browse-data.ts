import {
  buildModuleBrowseItems,
  buildRoleBrowseItem,
  buildRoleSectionItems,
  buildSignalBrowseItems,
  buildSubjectBrowseItem,
  buildSubjectSectionItems,
  buildTopicBrowseItem,
  buildTopicSectionItems,
  groupBrowseItemsByBucket,
  sortBrowseItems,
  type BrowseBucketGroup,
  type BrowseItem,
  type BrowseModuleSeed,
} from "@/components/browse/browse-catalog"
import { getModules, getSubjectStats, getSubjects } from "@/lib/content"
import { getRoles, getRoleStats, getTopics, getTopicStats } from "@/lib/entities"

function mixBucketItems(items: BrowseItem[]) {
  const subjects = items.filter((item) => item.kind === "subject").slice(0, 3)
  const topics = items.filter((item) => item.kind === "topic").slice(0, 2)
  const roles = items.filter((item) => item.kind === "role").slice(0, 2)

  return sortBrowseItems([...subjects, ...topics, ...roles]).slice(0, 7)
}

export interface BrowseCatalogData {
  items: BrowseItem[]
  entityItems: BrowseItem[]
  subjectItems: BrowseItem[]
  roleItems: BrowseItem[]
  topicItems: BrowseItem[]
  bucketGroups: BrowseBucketGroup[]
}

export function getBrowseCatalogData(): BrowseCatalogData {
  const subjects = getSubjects()
  const roles = getRoles()
  const topics = getTopics()

  const subjectStats = new Map(
    subjects.map((subject) => [
      subject.slug,
      { ...getSubjectStats(subject.slug), sections: 0 },
    ])
  )
  const roleStats = new Map(roles.map((role) => [role.slug, getRoleStats(role.slug)]))
  const topicStats = new Map(topics.map((topic) => [topic.slug, getTopicStats(topic.slug)]))

  const subjectItems = subjects.map((subject) =>
    buildSubjectBrowseItem(subject, subjectStats.get(subject.slug)!)
  )
  const roleItems = roles.map((role) =>
    buildRoleBrowseItem(role, roleStats.get(role.slug)!)
  )
  const topicItems = topics.map((topic) =>
    buildTopicBrowseItem(topic, topicStats.get(topic.slug)!)
  )

  const subjectSectionItems = subjects.flatMap((subject) =>
    buildSubjectSectionItems(subject, subjectStats.get(subject.slug)!)
  )
  const roleSectionItems = roles.flatMap((role) =>
    buildRoleSectionItems(role, roleStats.get(role.slug)!)
  )
  const topicSectionItems = topics.flatMap((topic) =>
    buildTopicSectionItems(topic, topicStats.get(topic.slug)!)
  )

  const moduleSeeds: BrowseModuleSeed[] = subjects.flatMap((subject) => {
    const subjectItem = subjectItems.find((item) => item.id === `subject:${subject.slug}`)
    if (!subjectItem) return []

    return getModules(subject.slug).slice(0, 4).map((module) => ({
      subjectSlug: subject.slug,
      subjectName: subject.name,
      subjectIcon: subject.icon,
      subjectColor: subject.color,
      subjectBucket: subjectItem.bucket,
      subjectTier: subjectItem.tier,
      moduleSlug: module.slug,
      moduleTitle: module.title,
      moduleSummary: module.shortSummary,
      moduleLevel: module.level,
    }))
  })

  const moduleItems = buildModuleBrowseItems(moduleSeeds)
  const signalItems = buildSignalBrowseItems(subjects, roles, topics)

  const entityItems = sortBrowseItems([...subjectItems, ...roleItems, ...topicItems])
  const items = sortBrowseItems([
    ...entityItems,
    ...subjectSectionItems,
    ...roleSectionItems,
    ...topicSectionItems,
    ...moduleItems,
    ...signalItems,
  ])

  const bucketGroups = groupBrowseItemsByBucket(entityItems)
    .map((group) => ({
      ...group,
      items: mixBucketItems(group.items),
    }))
    .filter((group) => group.items.length > 0)

  return {
    items,
    entityItems,
    subjectItems,
    roleItems,
    topicItems,
    bucketGroups,
  }
}
