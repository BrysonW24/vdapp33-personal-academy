export function splitIntoParagraphs(text?: string | null) {
  if (!text) return []

  return text
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}

export function firstParagraph(text?: string | null) {
  return splitIntoParagraphs(text)[0] ?? ""
}
