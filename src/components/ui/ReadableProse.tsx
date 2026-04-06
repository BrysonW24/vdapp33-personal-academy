"use client"

import { cn } from "@/lib/utils"
import { splitIntoParagraphs } from "@/lib/prose"

interface ReadableProseProps {
  text?: string | null
  className?: string
  paragraphClassName?: string
}

export function ReadableProse({
  text,
  className,
  paragraphClassName,
}: ReadableProseProps) {
  const paragraphs = splitIntoParagraphs(text)

  if (paragraphs.length === 0) return null

  return (
    <div className={cn("space-y-4", className)}>
      {paragraphs.map((paragraph, index) => (
        <p
          key={`${paragraph.slice(0, 24)}-${index}`}
          className={cn(
            "text-sm leading-7 text-editorial-muted sm:text-[15px]",
            paragraphClassName
          )}
        >
          {paragraph}
        </p>
      ))}
    </div>
  )
}
