import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { TimelineView } from "@/components/academy/day/TimelineView"
import { Breadcrumbs } from "@/components/academy/layout/Breadcrumbs"
import { Badge } from "@/components/ui/badge"
import { getRole, getRoleDayInLifeScenario } from "@/lib/entities"

export default async function RoleDayInLifeDetailPage({
  params,
}: {
  params: Promise<{ slug: string; scenarioSlug: string }>
}) {
  const { slug, scenarioSlug } = await params
  const role = getRole(slug)
  const scenario = getRoleDayInLifeScenario(slug, scenarioSlug)
  if (!role || !scenario) notFound()

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10 space-y-8">
      <Breadcrumbs
        segments={[
          { label: "Roles", href: "/roles" },
          { label: role.name, href: `/roles/${slug}` },
          { label: "Day in the Life", href: `/roles/${slug}/day-in-the-life` },
          { label: scenario.title },
        ]}
      />

      <div>
        <Link
          href={`/roles/${slug}/day-in-the-life`}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-editorial-muted transition-colors hover:text-editorial-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All day-in-the-life stories
        </Link>

        <div className="mb-3 flex flex-wrap gap-2">
          <Badge variant="secondary">{scenario.salary}</Badge>
          <Badge variant="outline">{scenario.companySize}</Badge>
        </div>

        <h1 className="font-serif text-3xl font-semibold text-editorial-ink sm:text-4xl">
          {scenario.title}
        </h1>
        <p className="mt-3 text-lg text-editorial-muted">{scenario.description}</p>
      </div>

      <section className="rounded-[24px] border border-[rgba(44,49,59,0.08)] bg-white/82 p-6 shadow-editorial-soft">
        <h2 className="font-serif text-xl font-semibold text-editorial-ink">Sample day</h2>
        <div className="mt-4">
          <TimelineView scenario={scenario} />
        </div>
      </section>
    </div>
  )
}
