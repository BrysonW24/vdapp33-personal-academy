import { SignalsHub } from "@/components/guidance/SignalsHub"
import { getAllSignalDigests } from "@/lib/guidance-content"

export const metadata = {
  title: "Signals",
}

export default function SignalsPage() {
  const digests = getAllSignalDigests()

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 max-w-3xl">
        <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
          Curated signals
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-editorial-ink sm:text-5xl">
          Signals
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-editorial-muted">
          This is not a live news feed. It is a curated layer that helps you see
          the institutions, companies, developments, and debates worth paying
          attention to in the fields you care about.
        </p>
      </div>

      <SignalsHub digests={digests} />
    </div>
  )
}
