import { notFound } from "next/navigation"
import { SourcePackView } from "@/components/guidance/SourcePackView"
import { getSourcePack } from "@/lib/guidance-content"
import { getRole } from "@/lib/entities"

export default async function RoleSourcesPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const role = getRole(slug)
  if (!role) notFound()

  const pack = getSourcePack("role", slug)

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 max-w-3xl">
        <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
          Truth stack
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-editorial-ink">
          {role.name} Sources
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-editorial-muted">
          A role is only as good as the standards, institutions, and people it is
          built on. Use this surface to learn who shapes good judgment here.
        </p>
      </div>

      <SourcePackView
        pack={pack}
        emptyTitle={`${role.name} truth stack is still being curated`}
        emptyBody="The role is live, but its source hierarchy has not landed yet."
      />
    </div>
  )
}
