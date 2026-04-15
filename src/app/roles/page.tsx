import { FilterableEntityDirectory } from "@/components/browse/FilterableEntityDirectory"
import { getRoleBrowseBucket } from "@/components/browse/browse-catalog"
import { getRoles, getRoleStats } from "@/lib/entities"

export default function RolesIndexPage() {
  const roles = getRoles()

  const entries = roles.map((role) => {
    const stats = getRoleStats(role.slug)

    return {
      entity: role,
      href: `/roles/${role.slug}`,
      bucket: getRoleBrowseBucket(role.slug),
      statLine: `${stats.modules} modules · ${stats.projects} projects · ${stats.dayInLife} stories`,
    }
  })

  return (
    <FilterableEntityDirectory
      eyebrow="Guided worlds"
      title="Roles"
      description="Roles are where the map becomes embodied. They show what a capable person in a field actually does, what they notice, what pressure they absorb, and how subjects and topics combine inside real work."
      entries={entries}
    />
  )
}
