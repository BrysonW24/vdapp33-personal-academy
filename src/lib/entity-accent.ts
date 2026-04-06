import type { MacroBucket, SubjectManifest } from "@/types/curriculum"
import type { EntityManifest } from "@/types/entity"

const SUBJECT_GROUP_ACCENTS: Record<string, string> = {
  sciences: "#2C6AA0",
  engineering: "#2F9E84",
  society: "#B76835",
  markets: "#2E9D59",
  life: "#1FA971",
  humanities: "#7A63D8",
  mind: "#D946A0",
}

const BUCKET_ACCENTS: Record<MacroBucket, string> = {
  reality: "#2C6AA0",
  "human-being": "#D946A0",
  civilization: "#B76835",
  "built-world": "#2F9E84",
  "markets-assets": "#2E9D59",
  "meaning-culture": "#7A63D8",
  frontier: "#F59E0B",
}

function clampChannel(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)))
}

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "")

  if (normalized.length !== 6) {
    return null
  }

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  }
}

export function withAlpha(hex: string, alpha: number) {
  const rgb = hexToRgb(hex)

  if (!rgb) {
    return hex
  }

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
}

export function mixWithWhite(hex: string, ratio: number) {
  const rgb = hexToRgb(hex)

  if (!rgb) {
    return hex
  }

  const next = {
    r: clampChannel(rgb.r + (255 - rgb.r) * ratio),
    g: clampChannel(rgb.g + (255 - rgb.g) * ratio),
    b: clampChannel(rgb.b + (255 - rgb.b) * ratio),
  }

  return `rgb(${next.r}, ${next.g}, ${next.b})`
}

export function getEntityAccent(entity: SubjectManifest | EntityManifest) {
  if (!("kind" in entity) || entity.kind === "subject" || entity.kind === undefined) {
    return SUBJECT_GROUP_ACCENTS[entity.group] ?? entity.color
  }

  if (entity.macroBucket) {
    return BUCKET_ACCENTS[entity.macroBucket]
  }

  return SUBJECT_GROUP_ACCENTS[entity.group] ?? entity.color
}
