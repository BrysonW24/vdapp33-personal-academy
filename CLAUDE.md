# CLAUDE.md — Nexus

## What this app is

A unified multi-subject academy app (`vdapp33-personal-academy`) for curiosity-driven learning across a much broader map of human reality: 65 subjects, 41 topics, and 22 flagship roles.

This is not a founder cockpit and not a standalone single-subject academy. It is one browse-first knowledge shell where subjects, topics, and roles are the main entry points, with static content, subject-prefixed routes, first-class role/topic routes, and a local-first guidance layer kept available for optional structure.

The current direction is open-world browsing first. My Path, truth stacks, signals, and guide rails remain available as secondary surfaces, but the product stance is encyclopedia-like exploration rather than a prescribed learning journey.

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
├── quantum-science/
├── energy-systems/
├── aerospace/
├── rocket-science/
├── politics/
└── ...
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

### Subject groups and browse buckets

| Group | Subjects |
| --- | --- |
| Sciences | Biology, Chemistry, Cosmology, Earth Science, Ecology & Environmental Systems, Materials Science, Mathematics, Physics, Quantum Science, Statistics & Probability |
| Engineering | Aerospace, Architecture & Urbanism, Civil Engineering, Cloud, Computer Science, Cybersecurity, Data Science, Electrical Engineering, Energy Systems, Infrastructure Resilience, Manufacturing & Industry, Maritime Systems, Mechanical Engineering, Mining & Resources, Robotics, Rocket Science, Software Engineering, Space Infrastructure, Systems Engineering |
| Society | Commercial Property Management, Defense & Warfare, Demography, Energy Geopolitics, Geopolitics, Institutional Power, Intelligence & Espionage, Law, Media Systems, Politics, Public Administration, Sociology |
| Markets | Economics, Finance & Accounting, Supply Chain & Logistics, Trade & Globalization |
| Life | Agriculture & Food Systems, Biotechnology, Medicine & Human Physiology |
| Humanities | Aesthetics, Conflict & Negotiation, Creativity, Design, Ethics, History of Civilization, Identity & Culture, Literature, Morality & Values, Mythology, Religion & Belief Systems, Rhetoric & Persuasion, Typography |
| Mind | Anthropology, Education & Learning Science, Linguistics, Psychology |

Browse buckets sit above those technical groups and should be treated as the user-facing discovery layer:

- `reality`
- `human-being`
- `civilization`
- `built-world`
- `markets-assets`
- `meaning-culture`
- `frontier`

### Key files

| File | Purpose |
| --- | --- |
| `src/types/curriculum.ts` | Shared curriculum types and constants |
| `src/lib/curriculum-schemas.ts` | Runtime Zod schemas for curriculum parsing |
| `src/lib/content.ts` | Subject-scoped JSON content loaders |
| `src/lib/entities.ts` | Role/topic content loaders and subject aliasing |
| `src/lib/guidance-content.ts` | Onboarding, archetype, source, and signal loaders |
| `src/lib/browse-data.ts` | Server-side browse index builder for the command palette and macro-bucket explorer |
| `src/lib/academy-engine.ts` | Blueprint generation and deterministic next-action engine |
| `src/lib/academy-state.ts` | Local-first guidance state store |
| `src/lib/progress.ts` | Subject-scoped local progress store |
| `src/components/academy/layout/Navigation.tsx` | Shared multi-subject shell nav |
| `src/components/browse/CommandPalette.tsx` | Search-first quick-jump surface across the catalog |
| `src/components/browse/KnowledgeHierarchyScene.tsx` | Three.js hierarchy explainer for subject/topic/role relationships |
| `src/components/browse/MacroBucketExplorer.tsx` | Homepage browse layer for large-volume catalog discovery |
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
- Keep the guidance layer deterministic and local-first, but secondary to browse-first exploration
- The homepage should explain the hierarchy clearly: subjects = disciplined depth, topics = cross-domain lenses, roles = embodied intelligence
- For large content volume, keep search and hierarchy aids, but never hide or thin out the visible catalog on core browse surfaces
- Keep role/topic/source/signal/onboarding packs aligned across docs, status, and manifests
- Preserve the warm editorial visual language

### Design and readability doctrine

- Design for human readability first, not for content density
- Break long copy into real paragraphs; avoid walls of text
- Make the shape of a page understandable in one scan before asking for deep reading
- Prefer memorable frameworks, mental models, and visual maps before optional depth
- Keep top-level browse navigation visually separate from entity-specific navigation
- Roles should explain what the role is, where it came from, what people do, what it requires, who thrives in it, what it exposes people to, and how careers improve
- Politics should be treated as the flagship subject-world reference, the same way Astronaut is the flagship role-world reference
- Reuse shared visual systems and role/subject presentation contracts instead of inventing ad hoc layouts
- Treat mobile optimisation as part of the feature, not a later polish task
- Verify key shared surfaces on mobile whenever landing pages, navigation, or hero systems change
- Keep browse cards compact and information-dense enough to scan comfortably on phones

### Documentation and doctrine discipline

- Reference docs and doctrine are critical for updates in this app
- If a change affects product meaning, UX doctrine, entity structure, navigation shape, or design system behavior, update the key docs in the same pass
- The minimum sync set is usually `CLAUDE.md`, `README.md`, and `docs/personal-academy-architecture.md`
- Status files should remain operational truth for material feature shifts, not decorative metadata
- Do not let implementation drift away from documented product stance without explicitly updating the docs

## What NOT to do

- Do not reintroduce Founder OS routes, schemas, or operator framing
- Do not hardcode subject lists in app logic
- Do not add database, auth, or backend requirements
- Do not fabricate content that is not grounded in the subject or its curriculum arc
- Do not break the `/{subject}/...` route shape
- Do not turn curated sources and signals into noisy live-news scraping
- Do not silently drift the guidance engine away from deterministic logic
- Do not ship dense, hard-to-read copy or cluttered surfaces just because the content is rich
- Do not treat responsiveness or mobile readability as optional follow-up work
- Do not change product direction or page structure without checking the app docs and doctrine first

## Current state

- Nexus shell is active and building
- Physics, Quantum Science, Energy Systems, Aerospace, Robotics, and Rocket Science now anchor the science and engineering side of the academy
- Politics and Commercial Property Management anchor the society group, while the broader taxonomy now spans markets, life, humanities, and mind as well
- Aerospace now includes modules, lessons, frameworks, projects, tools, and day-in-the-life content
- Quantum Science now includes a full academy spine plus lessons, frameworks, projects, tools, and day-in-the-life content
- Energy Systems is a canonical subject rather than a topic
- Robotics is a full native subject inside the unified shell with modules, lessons, frameworks, projects, tools, and day-in-the-life content
- Commercial Property Management was migrated from `vdapp46-jll-commercial-property-manager-academy` on 2026-04-04 with generic subject-level framing preserved in the shell
- Source academies were archived on 2026-04-04 after migration verification; archived copies live in `archive/2026-04-04-personal-academy-migration-sources/`
- Roles and topics are live entity-aware route families with their own sections, sources, and signals
- Homepage browse is now organized around macro buckets rather than only raw subject/topic/role grids
- The command palette is now part of the primary navigation contract and should stay maintained as the catalog expands
- Politics now lands directly on its richer systems explainer, rather than a generic subject shell
- Setup and My Path remain live but are secondary and frozen relative to the browse-first encyclopedia stance
- Guide rails now appear on start pages, module pages, lesson pages, project pages, and tool pages
- Curated source packs and signal digests are live for the flagship entities and should expand without changing the route model
