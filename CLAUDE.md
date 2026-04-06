# CLAUDE.md — Nexus

## What this app is

A unified multi-subject academy app (`vdapp33-personal-academy`) for curiosity-driven learning across politics, commercial property management, physics, quantum, aerospace, robotics, and rocket science.

This is not a founder cockpit and not a standalone single-subject academy. It is one learning shell where subject switching happens inside the same app, with static content, subject-prefixed routes, first-class role/topic routes, and a local-first guidance layer.

The current direction is broader than browsing alone: onboarding, My Path, truth stacks, signals, and guide rails turn the academy into a directed learning operating system.

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

Entity-aware content now lives alongside subjects:

```text
content/
├── roles/
├── topics/
├── onboarding/
├── guidance/
├── sources/
└── signals/
```

Each role or topic uses a small manifest plus related-entity metadata. Onboarding, archetypes, sources, and signals are all curated content packs too.

### Route architecture

```text
/                                    → Nexus dashboard
/setup                               → Soft onboarding
/my-path                             → Guided dashboard
/subjects                            → Subject directory
/roles                               → Role directory
/topics                              → Topic directory
/signals                             → Cross-entity signal hub
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
/{subject}/sources                   → Subject truth stack
/{subject}/signals                   → Subject signal digest
/roles/{slug}                        → Role landing
/roles/{slug}/sources                → Role truth stack
/roles/{slug}/signals                → Role signal digest
/topics/{slug}                       → Topic landing
/topics/{slug}/sources               → Topic truth stack
/topics/{slug}/signals               → Topic signal digest
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
| `src/lib/entities.ts` | Role/topic content loaders and subject aliasing |
| `src/lib/guidance-content.ts` | Onboarding, archetype, source, and signal loaders |
| `src/lib/academy-engine.ts` | Blueprint generation and deterministic next-action engine |
| `src/lib/academy-state.ts` | Local-first guidance state store |
| `src/lib/progress.ts` | Subject-scoped local progress store |
| `src/components/academy/layout/Navigation.tsx` | Shared multi-subject shell nav |
| `src/components/personal/SubjectStartHere.tsx` | Subject landing page |
| `src/components/guidance/SetupFlow.tsx` | Onboarding flow |
| `src/components/guidance/MyPathDashboard.tsx` | Guided dashboard |
| `src/components/guidance/GuideRail.tsx` | In-page guidance surface |
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
- Keep Nexus distinct from Founder OS
- Prefer honest scope over fake completeness
- Keep content static and manifest-driven
- Keep the guidance layer deterministic and local-first
- Keep role/topic/source/signal/onboarding packs aligned across docs, status, and manifests
- Preserve the warm editorial visual language

## What NOT to do

- Do not reintroduce Founder OS routes, schemas, or operator framing
- Do not hardcode subject lists in app logic
- Do not add database, auth, or backend requirements
- Do not fabricate content that is not grounded in the subject or its curriculum arc
- Do not break the `/{subject}/...` route shape
- Do not turn curated sources and signals into noisy live-news scraping
- Do not silently drift the guidance engine away from deterministic logic

## Current state

- Nexus shell is active and building
- Physics, Quantum, Aerospace, Robotics, and Rocket Science now anchor the science and engineering side of the academy
- Politics and Commercial Property Management now anchor the society group
- Aerospace now includes modules, lessons, frameworks, projects, tools, and day-in-the-life content
- Quantum now includes a full 20-module academy spine plus lessons, frameworks, projects, tools, and day-in-the-life content
- Robotics is a full native subject inside the unified shell with modules, lessons, frameworks, projects, tools, and day-in-the-life content
- Commercial Property Management was migrated from `vdapp46-jll-commercial-property-manager-academy` on 2026-04-04 with generic subject-level framing preserved in the shell
- Source academies were archived on 2026-04-04 after migration verification; archived copies live in `archive/2026-04-04-personal-academy-migration-sources/`
- Roles and topics are live entity-aware route families with their own sections, sources, and signals
- Setup and My Path are live, with onboarding questions, archetype scoring, and deterministic next-action guidance
- Guide rails now appear on start pages, module pages, lesson pages, project pages, and tool pages
- Curated source packs and signal digests are live for the flagship entities and should expand without changing the route model
