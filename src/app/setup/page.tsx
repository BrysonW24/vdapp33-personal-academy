import { SetupFlow } from "@/components/guidance/SetupFlow"
import { getAcademyCatalog, getArchetypes, getOnboardingQuestionBank } from "@/lib/guidance-content"

export const metadata = {
  title: "Setup My Path",
}

export default function SetupPage() {
  const questionBank = getOnboardingQuestionBank()
  const archetypes = getArchetypes()
  const catalog = getAcademyCatalog()

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 max-w-3xl">
        <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
          Soft setup
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-editorial-ink sm:text-5xl">
          Turn the academy into a guided operating system
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-editorial-muted">
          This setup does not lock the academy down. It gives it a point of view:
          a core subject, a supporting topic, a role lens, a cadence, and a next
          move that actually makes sense.
        </p>
      </div>

      <SetupFlow questionBank={questionBank} archetypes={archetypes} catalog={catalog} />
    </div>
  )
}
