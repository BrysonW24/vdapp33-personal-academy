import Link from "next/link"
import { notFound } from "next/navigation"
import { Breadcrumbs } from "@/components/academy/layout/Breadcrumbs"
import { ProgressTracker } from "@/components/academy/progress/ProgressTracker"
import { getRole, getRoleTool } from "@/lib/entities"
import { getSubject } from "@/lib/content"
import { buildGuideRail, buildEntityLink } from "@/lib/guide-rail"

function humanize(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

const TOOL_SECTIONS = [
  ["fieldPosition", "Where it fits"],
  ["funnelPosition", "Where it fits"],
  ["marketerWorkflow", "Workflow"],
  ["physicistWorkflow", "Workflow"],
  ["engineerWorkflow", "Workflow"],
  ["founderWorkflow", "Workflow"],
  ["managerExpects", "What leaders expect"],
  ["supervisorExpects", "What mentors expect"],
  ["computationalImpact", "Why it changes the work"],
  ["aiWorkflowImpact", "AI workflow impact"],
  ["demoDescription", "Try this first"],
] as const

export default async function RoleToolDetailPage({
  params,
}: {
  params: Promise<{ slug: string; toolSlug: string }>
}) {
  const { slug, toolSlug } = await params
  const role = getRole(slug)
  const tool = getRoleTool(slug, toolSlug)
  if (!role || !tool) notFound()

  const supplementalSections = TOOL_SECTIONS.flatMap(([key, label]) => {
    const value = tool[key]
    return typeof value === "string" && value.trim()
      ? [{ key, label, value }]
      : []
  })

  const sourceSubject = tool.sourceMeta?.sourceSlug
    ? getSubject(tool.sourceMeta.sourceSlug)
    : null
  const guideRail = buildGuideRail({
    entity: { kind: "role", slug, name: role.name },
    whyThisMatters: `${tool.name} matters here because roles are partly shaped by the tools they trust, the workflows they inherit, and the outputs they are expected to produce.`,
    nextAction: {
      href: sourceSubject ? `/${sourceSubject.slug}/tools` : `/roles/${slug}/projects`,
      label: sourceSubject ? `See the ${sourceSubject.name} ecosystem` : "Open role projects",
      description: sourceSubject
        ? "Follow the tool back into the deeper subject ecosystem that explains how and why it is used."
        : "If the source subject is unclear, use a role project to understand the tool in action.",
    },
    applyPrompt: `Ask what this tool helps a ${role.name} notice, coordinate, calculate, or ship that would otherwise stay fuzzy.`,
    debatePrompt: `Where does this tool create leverage, and where might it create overconfidence, bureaucracy, or shallow work?`,
    truthPrompt: `Separate product marketing from serious operator use by checking institutions, practitioners, and the source subject behind the tool.`,
    adjacent: sourceSubject
      ? [buildEntityLink("subject", sourceSubject.slug, sourceSubject.name, "Open the canonical subject behind this role tool.")]
      : [],
  })

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <ProgressTracker
        slug={tool.slug}
        subjectSlug={tool.sourceMeta?.sourceSlug}
        type="tool"
      />

      <Breadcrumbs
        segments={[
          { label: "Roles", href: "/roles" },
          { label: role.name, href: `/roles/${slug}` },
          { label: "Tools", href: `/roles/${slug}/tools` },
          { label: tool.name },
        ]}
      />

      <div className="mt-6 flex flex-wrap gap-2">
        <span className="inline-block rounded-full bg-editorial-green-soft px-2.5 py-0.5 text-xs font-medium text-editorial-green">
          {tool.pricingTier}
        </span>
        <span className="inline-block rounded-full bg-editorial-blue-soft px-2.5 py-0.5 text-xs font-medium text-editorial-blue">
          {humanize(tool.category)}
        </span>
        {sourceSubject ? (
          <Link
            href={`/${sourceSubject.slug}`}
            className="inline-block rounded-full bg-editorial-amber-soft px-2.5 py-0.5 text-xs font-medium text-editorial-amber"
          >
            From {sourceSubject.name}
          </Link>
        ) : null}
      </div>

      <h1 className="mt-4 font-serif text-3xl font-semibold text-editorial-ink sm:text-4xl">
        {tool.name}
      </h1>
      <p className="mt-4 text-lg text-editorial-muted">{tool.description}</p>

      <div className="mt-8 rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-white/80 p-6 shadow-editorial-soft">
        <h2 className="font-serif text-lg font-semibold text-editorial-ink">Why use it</h2>
        <p className="mt-3 text-editorial-muted">{tool.whyUseIt}</p>
      </div>

      {supplementalSections.length > 0 ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {supplementalSections.map((section) => (
            <div
              key={section.key}
              className="rounded-[18px] border border-[rgba(44,49,59,0.08)] bg-white/78 p-5"
            >
              <h2 className="font-serif text-lg font-semibold text-editorial-ink">
                {section.label}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-editorial-muted">
                {section.value}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-8">{guideRail}</div>
    </div>
  )
}
