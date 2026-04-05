import { MyPathDashboard } from "@/components/guidance/MyPathDashboard"
import {
  getAcademyCatalog,
  getAllSignalDigests,
  getAllSourcePacks,
} from "@/lib/guidance-content"

export const metadata = {
  title: "My Path",
}

export default function MyPathPage() {
  const catalog = getAcademyCatalog()
  const sourcePacks = getAllSourcePacks()
  const signalDigests = getAllSignalDigests()

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 max-w-3xl">
        <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
          Personal guidance
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-editorial-ink sm:text-5xl">
          My Path
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-editorial-muted">
          Use one core subject, one supporting topic, and one role lens at a time.
          The point is not to remove curiosity. The point is to stop it from
          dissolving into drift.
        </p>
      </div>

      <MyPathDashboard
        catalog={catalog}
        sourcePacks={sourcePacks}
        signalDigests={signalDigests}
      />
    </div>
  )
}
