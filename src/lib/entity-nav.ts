import type { EntityKind } from "@/types/entity"

export interface NavContext {
  kind: EntityKind
  slug: string
  basePath: string
  name?: string
}

export interface NavSectionItem {
  segment: string
  label: string
  iconName: string
  isPrimary: boolean
}

const SUBJECT_SECTIONS: NavSectionItem[] = [
  { segment: "", label: "Start Here", iconName: "Compass", isPrimary: true },
  { segment: "/blueprint", label: "Blueprint", iconName: "Map", isPrimary: true },
  { segment: "/modules", label: "Modules", iconName: "BookOpen", isPrimary: true },
  { segment: "/projects", label: "Projects", iconName: "FolderKanban", isPrimary: true },
  { segment: "/tools", label: "Tools", iconName: "Wrench", isPrimary: true },
  { segment: "/toolkit", label: "Toolkit", iconName: "Library", isPrimary: false },
  { segment: "/day-in-the-life", label: "Day in the Life", iconName: "Clock3", isPrimary: false },
]

const ROLE_SECTIONS: NavSectionItem[] = [
  { segment: "", label: "Overview", iconName: "Compass", isPrimary: true },
  { segment: "/blueprint", label: "Blueprint", iconName: "Map", isPrimary: true },
  { segment: "/modules", label: "Training", iconName: "BookOpen", isPrimary: true },
  { segment: "/projects", label: "Projects", iconName: "FolderKanban", isPrimary: true },
  { segment: "/tools", label: "Tools", iconName: "Wrench", isPrimary: true },
  { segment: "/toolkit", label: "Toolkit", iconName: "Library", isPrimary: false },
  { segment: "/day-in-the-life", label: "Day in the Life", iconName: "Clock3", isPrimary: false },
]

const TOPIC_SECTIONS: NavSectionItem[] = [
  { segment: "", label: "Overview", iconName: "Compass", isPrimary: true },
  { segment: "/modules", label: "Concepts", iconName: "BookOpen", isPrimary: true },
  { segment: "/projects", label: "Applications", iconName: "FolderKanban", isPrimary: true },
  { segment: "/tools", label: "Tools", iconName: "Wrench", isPrimary: true },
  { segment: "/toolkit", label: "Perspectives", iconName: "Library", isPrimary: false },
]

const SECTION_MAP: Record<EntityKind, NavSectionItem[]> = {
  subject: SUBJECT_SECTIONS,
  role: ROLE_SECTIONS,
  topic: TOPIC_SECTIONS,
}

export function getNavSections(kind: EntityKind): NavSectionItem[] {
  return SECTION_MAP[kind]
}

export function getEntityBasePath(kind: EntityKind, slug: string): string {
  switch (kind) {
    case "subject":
      return `/${slug}`
    case "role":
      return `/roles/${slug}`
    case "topic":
      return `/topics/${slug}`
  }
}

/**
 * Resolves entity context from the current pathname.
 * Checks /roles/{slug} and /topics/{slug} first (static segments),
 * then falls back to matching known subject slugs.
 */
export function resolveNavContext(
  pathname: string,
  subjectSlugs: string[]
): NavContext | null {
  const segments = pathname.split("/").filter(Boolean)

  if (segments[0] === "roles" && segments[1]) {
    return {
      kind: "role",
      slug: segments[1],
      basePath: `/roles/${segments[1]}`,
    }
  }

  if (segments[0] === "topics" && segments[1]) {
    return {
      kind: "topic",
      slug: segments[1],
      basePath: `/topics/${segments[1]}`,
    }
  }

  if (segments[0] && subjectSlugs.includes(segments[0])) {
    return {
      kind: "subject",
      slug: segments[0],
      basePath: `/${segments[0]}`,
    }
  }

  return null
}
