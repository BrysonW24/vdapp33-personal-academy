import { notFound } from "next/navigation"
import { ToolCard } from "@/components/academy/cards/ToolCard"
import { getRole, getRoleTools } from "@/lib/entities"

export default async function RoleToolsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const role = getRole(slug)
  if (!role) notFound()

  const tools = getRoleTools(slug)

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
          {role.name} · tools
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-editorial-ink sm:text-4xl">
          Tools
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-editorial-muted">
          Tooling pulled from the related subjects so the role has a usable ecosystem,
          not just a description.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} basePath={`/roles/${slug}/tools`} />
        ))}
      </div>
    </div>
  )
}
