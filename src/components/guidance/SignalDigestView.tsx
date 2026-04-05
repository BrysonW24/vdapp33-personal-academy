import { Newspaper } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SignalDigest } from "@/types/guidance"

interface SignalDigestViewProps {
  digest: SignalDigest | null
  emptyTitle: string
  emptyBody: string
}

export function SignalDigestView({
  digest,
  emptyTitle,
  emptyBody,
}: SignalDigestViewProps) {
  if (!digest) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Newspaper className="h-4 w-4 text-editorial-muted" />
            <CardTitle>{emptyTitle}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-editorial-muted">{emptyBody}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Newspaper className="h-4 w-4 text-editorial-green" />
            <Badge variant="secondary">Curated</Badge>
          </div>
          <CardTitle>{digest.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-editorial-muted">{digest.summary}</p>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {digest.sections.map((section) => (
          <Card key={section.slug}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {section.items.map((item) => (
                <div
                  key={`${section.slug}-${item.name}`}
                  className="rounded-[16px] border border-[rgba(44,49,59,0.08)] bg-white/72 p-4"
                >
                  <p className="font-medium text-editorial-ink">{item.name}</p>
                  <p className="mt-2 text-sm leading-relaxed text-editorial-muted">
                    {item.summary}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-editorial-ink">
                    {item.whyItMatters}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
