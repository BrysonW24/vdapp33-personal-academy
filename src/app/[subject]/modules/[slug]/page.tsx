import Link from "next/link"
import { notFound } from "next/navigation"
import { ProgressTracker } from "@/components/academy/progress/ProgressTracker"
import {
  getLesson,
  getLessons,
  getModule,
  getModules,
  getSubject,
  getSubjects,
} from "@/lib/content"

function humanize(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export async function generateStaticParams() {
  return getSubjects().flatMap((subject) =>
    getModules(subject.slug).map((module) => ({
      subject: subject.slug,
      slug: module.slug,
    }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subject: string; slug: string }>
}) {
  const { subject, slug } = await params
  const curriculumModule = getModule(subject, slug)
  if (!curriculumModule) return { title: "Not Found" }
  return { title: curriculumModule.title }
}

export default async function ModuleDetailPage({
  params,
}: {
  params: Promise<{ subject: string; slug: string }>
}) {
  const { subject: subjectSlug, slug } = await params
  const subject = getSubject(subjectSlug)
  const curriculumModule = getModule(subjectSlug, slug)
  if (!subject || !curriculumModule) notFound()

  const lessons = getLessons(subjectSlug, curriculumModule.slug)
  const relatedModules = curriculumModule.relatedModules
    .map((relatedSlug) => getModule(subjectSlug, relatedSlug))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <ProgressTracker
        slug={curriculumModule.slug}
        subjectSlug={subjectSlug}
        type="module"
      />

      <nav className="text-sm text-editorial-muted mb-6">
        <Link href={`/${subjectSlug}`} className="hover:text-editorial-ink">
          {subject.name}
        </Link>
        {" / "}
        <Link href={`/${subjectSlug}/modules`} className="hover:text-editorial-ink">
          Modules
        </Link>
        {" / "}
        <span className="text-editorial-ink">{curriculumModule.title}</span>
      </nav>

      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium bg-editorial-green-soft text-editorial-green">
          {curriculumModule.level}
        </span>
        {curriculumModule.category && (
          <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium bg-editorial-blue-soft text-editorial-blue">
            {curriculumModule.category.replace(/-/g, " ")}
          </span>
        )}
        {curriculumModule.status === "coming-soon" && (
          <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium bg-editorial-amber-soft text-editorial-amber">
            Coming soon
          </span>
        )}
      </div>

      <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-editorial-ink mb-4">
        {curriculumModule.title}
      </h1>
      <p className="text-editorial-muted text-lg mb-8">
        {curriculumModule.shortSummary}
      </p>

      <div className="rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.78)] shadow-editorial-soft p-6 mb-8">
        <h2 className="font-serif text-xl font-semibold text-editorial-ink mb-2">
          Why it matters
        </h2>
        <p className="text-editorial-muted">{curriculumModule.whyItMatters}</p>
      </div>

      <div className="mb-8">
        <h2 className="font-serif text-xl font-semibold text-editorial-ink mb-4">
          Core concepts
        </h2>
        <ul className="space-y-2">
          {curriculumModule.coreConcepts.map((concept) => (
            <li key={concept} className="flex items-start gap-2 text-editorial-muted">
              <span className="text-editorial-green mt-0.5">•</span>
              {concept}
            </li>
          ))}
        </ul>
      </div>

      {lessons.length > 0 ? (
        <div className="mb-8">
          <h2 className="font-serif text-xl font-semibold text-editorial-ink mb-4">
            Lessons
          </h2>
          <div className="space-y-3">
            {lessons.map((lesson, index) => (
              <Link
                key={lesson.slug}
                href={`/${subjectSlug}/modules/${curriculumModule.slug}/${lesson.slug}`}
                className="flex items-center gap-3 rounded-[16px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.78)] p-4 hover:shadow-editorial-soft transition-shadow"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-editorial-green-soft text-editorial-green text-xs font-semibold">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium text-editorial-ink">{lesson.title}</p>
                  <p className="text-sm text-editorial-muted line-clamp-1">
                    {lesson.objective}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.78)] p-6 mb-8">
          <p className="text-editorial-muted">
            This module has landed before its lesson pages. Use the blueprint to
            keep moving while the lessons fill in.
          </p>
        </div>
      )}

      {curriculumModule.frameworks.length > 0 && (
        <div className="mb-8">
          <h2 className="font-serif text-xl font-semibold text-editorial-ink mb-3">
            Related frameworks
          </h2>
          <div className="flex flex-wrap gap-2">
            {curriculumModule.frameworks.map((framework) => (
              <Link key={framework} href={`/${subjectSlug}/toolkit`}>
                <span className="inline-block rounded-full px-3 py-1 text-xs font-medium bg-editorial-blue-soft text-editorial-blue">
                  {humanize(framework)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {relatedModules.length > 0 && (
        <div>
          <h2 className="font-serif text-xl font-semibold text-editorial-ink mb-3">
            Related modules
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {relatedModules.map((related) => (
              <Link
                key={related.slug}
                href={`/${subjectSlug}/modules/${related.slug}`}
                className="rounded-[18px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.78)] p-4 hover:shadow-editorial-soft transition-shadow"
              >
                <p className="font-medium text-editorial-ink mb-1">{related.title}</p>
                <p className="text-sm text-editorial-muted line-clamp-2">
                  {related.shortSummary}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
