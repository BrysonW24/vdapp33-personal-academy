import { ExternalLink, FileSearch } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SourcePack } from "@/types/guidance"

interface SourcePackViewProps {
  pack: SourcePack | null
  emptyTitle: string
  emptyBody: string
}

export function SourcePackView({
  pack,
  emptyTitle,
  emptyBody,
}: SourcePackViewProps) {
  if (!pack) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileSearch className="h-4 w-4 text-editorial-muted" />
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
            <FileSearch className="h-4 w-4 text-editorial-blue" />
            <Badge variant="secondary">Curated</Badge>
          </div>
          <CardTitle>{pack.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed text-editorial-muted">{pack.summary}</p>
          <div className="flex flex-wrap gap-2">
            {pack.starterPack.map((item) => (
              <Badge key={item} variant="outline">
                {item}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {pack.tiers.map((tier) => (
          <Card key={tier.slug}>
            <CardHeader>
              <CardTitle>{tier.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm leading-relaxed text-editorial-muted">
                {tier.description}
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                {tier.items.map((item) => (
                  <div
                    key={`${tier.slug}-${item.name}`}
                    className="rounded-[16px] border border-[rgba(44,49,59,0.08)] bg-white/72 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-editorial-ink">{item.name}</p>
                        <p className="mt-2 text-sm leading-relaxed text-editorial-muted">
                          {item.description}
                        </p>
                      </div>
                      {item.link ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 text-editorial-green"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
