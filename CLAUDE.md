# CLAUDE.md — Personal Academy

## What this app is

A unified multi-subject academy app (`vdapp33-personal-academy`) for curiosity-driven learning across politics, commercial property management, physics, quantum, aerospace, robotics, and rocket science.

This is not a founder cockpit and not a standalone single-subject academy. It is one learning shell where subject switching happens inside the same app, with static content and subject-prefixed routes.

## Architecture

### Content structure

```text
content/curriculum/
├── physics/
│   ├── manifest.json
│   ├── modules/
│   ├── lessons/
│   ├── frameworks/
│   ├── projects/
│   ├── tools/
│   └── day-in-life/
├── quantum/
├── aerospace/
├── rocket-science/
└── politics/
```

Subjects are auto-discovered from `manifest.json`. Add a new subject by creating `content/curriculum/{slug}/manifest.json` plus the relevant JSON content folders.

### Route architecture

```text
/                                    → Personal Academy dashboard
/{subject}                           → Start Here
/{subject}/blueprint                 → Generated blueprint
/{subject}/modules                   → Module grid
/{subject}/modules/{slug}            → Module detail
/{subject}/modules/{slug}/{lessonSlug} → Lesson detail
/{subject}/projects                  → Project library
/{subject}/projects/{slug}           → Project detail
/{subject}/tools                     → Tool explorer
/{subject}/tools/{slug}              → Tool detail
/{subject}/toolkit                   → Framework library
/{subject}/day-in-the-life           → Role snapshots
```

Founder-only routes like `/{subject}/playbooks`, `/{subject}/systems`, and `/{subject}/learn` do not belong in this app.

### Subject groups

| Group | Subjects |
| --- | --- |
| Sciences | Physics, Quantum |
| Engineering | Aerospace, Robotics, Rocket Science |
| Society | Politics, Commercial Property Management |

### Key files

| File | Purpose |
| --- | --- |
| `src/types/curriculum.ts` | Shared curriculum types and constants |
| `src/lib/curriculum-schemas.ts` | Runtime Zod schemas for curriculum parsing |
| `src/lib/content.ts` | Subject-scoped JSON content loaders |
| `src/lib/progress.ts` | Subject-scoped local progress store |
| `src/components/academy/layout/Navigation.tsx` | Shared multi-subject shell nav |
| `src/components/personal/SubjectStartHere.tsx` | Subject landing page |
| `src/components/personal/DayInLifeExplorer.tsx` | Client-side day-in-the-life viewer |

## Working in this app

### Build commands

```bash
npm run dev
npm run type-check
npm run lint
npm run build
```

### Product doctrine

- Learning is the point here
- Keep Personal Academy distinct from Founder OS
- Prefer honest scope over fake completeness
- Keep content static and manifest-driven
- Preserve the warm editorial visual language

## What NOT to do

- Do not reintroduce Founder OS routes, schemas, or operator framing
- Do not hardcode subject lists in app logic
- Do not add database, auth, or backend requirements
- Do not fabricate content that is not grounded in the subject or its curriculum arc
- Do not break the `/{subject}/...` route shape

## Current state

- Personal Academy shell is active and building
- Physics, Quantum, Aerospace, Robotics, and Rocket Science now anchor the science and engineering side of the academy
- Politics and Commercial Property Management now anchor the society group
- Aerospace now includes modules, lessons, frameworks, projects, tools, and day-in-the-life content
- Quantum now includes a full 20-module academy spine plus lessons, frameworks, projects, tools, and day-in-the-life content
- Robotics is a full native subject inside the unified shell with modules, lessons, frameworks, projects, tools, and day-in-the-life content
- Commercial Property Management was migrated from `vdapp46-jll-commercial-property-manager-academy` on 2026-04-04 with generic subject-level framing preserved in the shell
- Source academies were archived on 2026-04-04 after migration verification; archived copies live in `archive/2026-04-04-personal-academy-migration-sources/`
