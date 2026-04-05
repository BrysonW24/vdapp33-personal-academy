import Link from "next/link"
import { notFound } from "next/navigation"
import { ProgressTracker } from "@/components/academy/progress/ProgressTracker"
import {
  getProject,
  getSubject,
  getSubjects,
  getTool,
  getTools,
} from "@/lib/content"

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

export async function generateStaticParams() {
  return getSubjects().flatMap((subject) =>
    getTools(subject.slug).map((tool) => ({
      subject: subject.slug,
      slug: tool.slug,
    }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subject: string; slug: string }>
}) {
  const { subject, slug } = await params
  const tool = getTool(subject, slug)
  if (!tool) return { title: "Not Found" }
  return { title: tool.name }
}

export default async function ToolDetailPage({
  params,
}: {
  params: Promise<{ subject: string; slug: string }>
}) {
  const { subject: subjectSlug, slug } = await params
  const subject = getSubject(subjectSlug)
  const tool = getTool(subjectSlug, slug)
  if (!subject || !tool) notFound()

  const supplementalSections = TOOL_SECTIONS.flatMap(([key, label]) => {
    const value = tool[key]
    return typeof value === "string" && value.trim()
      ? [{ key, label, value }]
      : []
  })

  const relatedProject =
    typeof tool.relatedProject === "string"
      ? getProject(subjectSlug, tool.relatedProject)
      : null

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <ProgressTracker slug={tool.slug} subjectSlug={subjectSlug} type="tool" />

      <nav className="text-sm text-editorial-muted mb-6">
        <Link href={`/${subjectSlug}`} className="hover:text-editorial-ink">
          {subject.name}
        </Link>
        {" / "}
        <Link href={`/${subjectSlug}/tools`} className="hover:text-editorial-ink">
          Tools
        </Link>
        {" / "}
        <span className="text-editorial-ink">{tool.name}</span>
      </nav>

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium bg-editorial-green-soft text-editorial-green">
          {tool.pricingTier}
        </span>
        <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium bg-editorial-blue-soft text-editorial-blue">
          {humanize(tool.category)}
        </span>
      </div>

      <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-editorial-ink mb-4">
        {tool.name}
      </h1>
      <p className="text-editorial-muted text-lg mb-6">{tool.description}</p>

      <div className="rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.78)] shadow-editorial-soft p-6 mb-6">
        <h2 className="font-serif text-lg font-semibold text-editorial-ink mb-2">
          Why use it
        </h2>
        <p className="text-editorial-muted">{tool.whyUseIt}</p>
      </div>

      {tool.url && (
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium bg-editorial-green text-white hover:bg-editorial-green/90 transition-colors mb-6"
        >
          Visit {tool.name}
        </a>
      )}

      {supplementalSections.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {supplementalSections.map((section) => (
            <div
              key={section.key}
              className="rounded-[18px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.78)] p-5"
            >
              <h2 className="font-serif text-lg font-semibold text-editorial-ink mb-2">
                {section.label}
              </h2>
              <p className="text-sm text-editorial-muted leading-relaxed">
                {section.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {tool.outputs && tool.outputs.length > 0 && (
        <div className="mb-8">
          <h2 className="font-serif text-lg font-semibold text-editorial-ink mb-3">
            Typical outputs
          </h2>
          <div className="flex flex-wrap gap-2">
            {tool.outputs.map((output) => (
              <span
                key={output}
                className="inline-block rounded-full px-3 py-1 text-xs font-medium bg-editorial-blue-soft text-editorial-blue"
              >
                {output}
              </span>
            ))}
          </div>
        </div>
      )}

      {tool.vocabulary && tool.vocabulary.length > 0 && (
        <div className="mb-8">
          <h2 className="font-serif text-lg font-semibold text-editorial-ink mb-3">
            Vocabulary
          </h2>
          <div className="space-y-3">
            {tool.vocabulary.map((item) => (
              <div
                key={item.term}
                className="rounded-[14px] border border-[rgba(44,49,59,0.08)] bg-white/70 p-4"
              >
                <p className="font-medium text-editorial-ink mb-1">{item.term}</p>
                <p className="text-sm text-editorial-muted">{item.definition}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tool.beginnerMistakes && tool.beginnerMistakes.length > 0 && (
        <div className="mb-8">
          <h2 className="font-serif text-lg font-semibold text-editorial-ink mb-3">
            Beginner mistakes
          </h2>
          <ul className="space-y-2 text-sm text-editorial-muted">
            {tool.beginnerMistakes.map((mistake) => (
              <li key={mistake} className="flex items-start gap-2">
                <span className="text-editorial-red mt-0.5">•</span>
                {mistake}
              </li>
            ))}
          </ul>
        </div>
      )}

      {tool.alternatives.length > 0 && (
        <div className="mb-8">
          <h2 className="font-serif text-lg font-semibold text-editorial-ink mb-3">
            Alternatives
          </h2>
          <div className="flex flex-wrap gap-2">
            {tool.alternatives.map((alternative) => (
              <span
                key={alternative}
                className="inline-block rounded-full px-3 py-1 text-xs font-medium bg-editorial-amber-soft text-editorial-amber"
              >
                {alternative}
              </span>
            ))}
          </div>
        </div>
      )}

      {relatedProject && (
        <div className="rounded-[18px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.78)] p-5">
          <h2 className="font-serif text-lg font-semibold text-editorial-ink mb-2">
            Related project
          </h2>
          <Link
            href={`/${subjectSlug}/projects/${relatedProject.slug}`}
            className="text-editorial-green hover:text-editorial-green/80"
          >
            {relatedProject.title}
          </Link>
        </div>
      )}
    </div>
  )
}
