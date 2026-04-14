import { EntityCard } from "@/components/entities/EntityCard"
import {
  getBrowseBucketMeta,
  getRoleBrowseBucket,
  type BrowseBucket,
} from "@/components/browse/browse-catalog"
import { getRoles, getRoleStats } from "@/lib/entities"

export default function RolesIndexPage() {
  const roles = getRoles()

  const groupedRoles = roles.reduce<Record<string, typeof roles>>((acc, role) => {
    const bucket = (role.macroBucket ?? getRoleBrowseBucket(role.slug)) as BrowseBucket
    if (!acc[bucket]) acc[bucket] = []
    acc[bucket].push(role)
    return acc
  }, {})

  const orderedBuckets = Object.keys(groupedRoles) as BrowseBucket[]

  return (
    <div className="container mx-auto space-y-6 px-4 py-6 sm:space-y-8 sm:py-8">
      <section className="rounded-[24px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.82)] p-5 shadow-editorial-soft sm:rounded-[30px] sm:p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
          Guided worlds
        </p>
        <h1 className="mt-2 font-serif text-[2.3rem] font-semibold leading-tight text-editorial-ink sm:text-5xl">
          Roles
        </h1>
        <p className="mt-3 max-w-3xl text-[15px] leading-[1.6] text-editorial-muted sm:mt-4 sm:text-lg sm:leading-relaxed">
          Roles are where the map becomes embodied. They show what a capable person
          in a field actually does, what they notice, what pressure they absorb, and
          how subjects and topics combine inside real work.
        </p>
      </section>

      {orderedBuckets.map((bucket) => {
        const bucketMeta = getBrowseBucketMeta(bucket)

        return (
          <section key={bucket} className="space-y-3 sm:space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
                {bucketMeta.label}
              </p>
              <h2 className="mt-2 font-serif text-[2rem] font-semibold leading-tight text-editorial-ink sm:text-3xl">
                {bucketMeta.label} roles
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-editorial-muted sm:text-base">
                Roles in this bucket turn the knowledge map into lived perspective,
                recurring decisions, and grounded day-to-day pressure.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
              {groupedRoles[bucket].map((role) => {
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
        )
      })}
    </div>
  )
}
