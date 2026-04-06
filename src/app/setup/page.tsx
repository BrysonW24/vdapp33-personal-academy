import { SetupFlow } from "@/components/guidance/SetupFlow"
import { getAcademyCatalog, getArchetypes, getOnboardingQuestionBank } from "@/lib/guidance-content"

export const metadata = {
  title: "Optional Setup",
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
          Add a little structure when you want it
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-editorial-muted">
          This setup is optional. It gives Nexus a point of view when you want
          one: a core subject, a supporting topic, a role lens, a cadence, and
          a next move that actually makes sense.
        </p>
      </div>

      <SetupFlow questionBank={questionBank} archetypes={archetypes} catalog={catalog} />
    </div>
  )
}
