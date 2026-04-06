# Nexus

Repo lineage: `vdapp33-personal-academy`

Nexus is a unified multi-subject Next.js app for curiosity-driven learning. It now spans 64 subjects, 41 topics, and 22 flagship roles inside one shell, one deploy, and one local-first state model, with subjects for disciplined depth, topics for cross-domain lenses, and roles for embodied intelligence.

## What This App Is

- Learning-first, not operator-first
- Browse-first encyclopedia interface with subjects, topics, and roles as the main entry points
- Macro-bucket discovery layer above the raw catalog: Reality, Human Being, Civilization, Built World, Markets & Assets, Meaning & Culture, Frontier
- Subject-prefixed multi-subject architecture with first-class role and topic routes
- Static content app powered by JSON curriculum files, onboarding packs, source packs, signal digests, and Zod schemas
- One academy shell where subjects provide depth, topics widen the lens, and roles synthesize real-world application
- Local-first state for progress, onboarding, and optional secondary surfaces such as My Path
- Search-first navigation with a local `Jump to anything` command palette and a hierarchy explainer that teaches how subjects, topics, and roles relate

## Working Doctrine

- Human readability is a core product requirement, not a polish layer
- Pages should explain the shape of a field or role quickly before asking the user to read deeply
- Use paragraph spacing, section rhythm, and visual summaries to reduce cognitive load
- Roles should follow a repeatable, structured setup rather than feeling like loose editorial pages
- Roles should feel like guided worlds: what the person does, what they see that others miss, how people get there, what they need to be strong in, what pressures they absorb, and how careers compound
- Role landing pages should surface a visible training ladder from beginner to expert application, plus embedded quest work, rather than forcing people to infer the structure from deep routes
- Mobile optimisation is mandatory for shared surfaces such as nav, heroes, landing pages, and module indexes
- Founder OS can be used as visual inspiration, but Nexus must keep its own browse-first encyclopedia stance
- Imported role academies are valid in Nexus when they are re-framed through the shared role-world contract rather than copied in as isolated mini-products
- When meaningful design, architecture, or product-direction changes land, update the reference docs in the same pass

## Core Routes

- `/` — Nexus exploration dashboard
- `/setup` — Optional soft onboarding surface
- `/my-path` — Secondary guided dashboard kept for users who want a structured session
- `/subjects` — Subject directory
- `/roles` — Role directory
- `/topics` — Topic directory
- `/signals` — Curated signal hub tied to the active path
- Header command palette — Local static quick-jump across subjects, topics, roles, flagship modules, and signals
- `/{subject}` — Start Here landing page
- `/{subject}/blueprint` — Generated subject map from module order
- `/{subject}/modules` — Module grid
- `/{subject}/modules/{slug}` — Module detail
- `/{subject}/modules/{slug}/{lessonSlug}` — Lesson detail
- `/{subject}/projects` — Subject projects
- `/{subject}/projects/{slug}` — Project detail
- `/{subject}/tools` — Subject tools
- `/{subject}/tools/{slug}` — Tool detail
- `/{subject}/toolkit` — Frameworks and mental models
- `/{subject}/day-in-the-life` — Real-world role snapshots
- `/{subject}/sources` — Curated truth stack for the subject
- `/{subject}/signals` — Curated signals for the subject
- `/roles/{slug}` — Role landing page
- `/roles/{slug}/sources` — Role truth stack
- `/roles/{slug}/signals` — Role signals
- `/topics/{slug}` — Topic landing page
- `/topics/{slug}/sources` — Topic truth stack
- `/topics/{slug}/signals` — Topic signals

Roles and topics are not decorative content anymore. They are live route families with their own landing pages, section pages, and guidance surfaces.

## Subject Model

All subject content lives under `content/curriculum/{subject}/` and is auto-discovered from `manifest.json`.

Current technical groups:

- Sciences: `biology`, `chemistry`, `cosmology`, `earth-science`, `ecology-environmental-systems`, `materials-science`, `mathematics`, `physics`, `quantum-science`, `statistics-probability`
- Engineering: `aerospace`, `architecture-urbanism`, `civil-engineering`, `computer-science`, `cybersecurity`, `data-science`, `electrical-engineering`, `energy-systems`, `infrastructure-resilience`, `manufacturing-industry`, `maritime-systems`, `mechanical-engineering`, `mining-resources`, `robotics`, `rocket-science`, `software-engineering`, `space-infrastructure`, `systems-engineering`
- Society: `commercial-property-management`, `defense-warfare`, `demography`, `energy-geopolitics`, `geopolitics`, `institutional-power`, `intelligence-espionage`, `law`, `media-systems`, `politics`, `public-administration`, `sociology`
- Markets: `economics`, `finance-accounting`, `supply-chain-logistics`, `trade-globalization`
- Life: `agriculture-food-systems`, `biotechnology`, `medicine-human-physiology`
- Humanities: `aesthetics`, `conflict-negotiation`, `creativity`, `design`, `ethics`, `history-of-civilization`, `identity-culture`, `literature`, `morality-values`, `mythology`, `religion-belief-systems`, `rhetoric-persuasion`, `typography`
- Mind: `anthropology`, `education-learning-science`, `linguistics`, `psychology`

Browse-only macro buckets:

- `reality`
- `human-being`
- `civilization`
- `built-world`
- `markets-assets`
- `meaning-culture`
- `frontier`

Overlay content lives alongside subjects:

- `content/roles/`
- `content/topics/`
- `content/onboarding/`
- `content/guidance/path-archetypes/`
- `content/sources/{subject|role|topic}/`
- `content/signals/{subjects|roles|topics}/`

## Guidance Layer

Nexus still has a guidance system on top of the content shell, but it is no longer the homepage story:

- Soft onboarding at `/setup`
- Deterministic blueprint generation from curated questions and archetypes
- Three learning modes: `guided`, `explorer`, `operator`
- A persistent `My Path` dashboard kept as a secondary guided surface with:
  - one core subject
  - one supporting topic
  - one role lens
  - one current project
  - one weekly cadence
  - one weekly review loop
- A deterministic next-best-action engine that ranks unfinished core subject work, reinforcement, role application, project work, review, truth-stack review, and curated signals
- Guide rails on start pages, module pages, lesson pages, project pages, and tool pages

The guidance OS remains available, but the browse shell, hierarchy explainer, macro-bucket explorer, and command palette are now the primary orientation layer.

## Current Migration State

- `politics` — rich subject migrated from `vdapp35-politician-academy`
- `physics` — rich subject migrated from `vdapp36-physicist-academy`
- `aerospace` — expanded beyond migration baseline with frameworks, projects, tools, and day-in-the-life
- `robotics` — full native subject inside Nexus with 20 modules, 10 lessons, 10 frameworks, 10 projects, 15 tools, and 4 day-in-the-life scenarios
- `rocket-science` — rich subject migrated from `vdapp38-rocket-science-academy`
- `quantum-science` — migrated from `vdapp40-quantum-academy` and expanded beyond the original thin baseline
- `energy-systems` — promoted from topic-level energy content into a canonical subject surface
- `commercial-property-management` — genericised subject migrated from `vdapp46-jll-commercial-property-manager-academy` with 20 modules, 5 lessons, 10 frameworks, 8 projects, 14 tools, and 4 day-in-the-life scenarios

The migrated standalone source apps were archived on 2026-04-04 into `archive/2026-04-04-personal-academy-migration-sources/` after route, build, and browser verification passed in the unified app. See `docs/personal-academy-migration-analysis.md` for the migration analysis.

The current post-migration work is about direction rather than just more content: making the catalog navigable, readable, and memorable at scale rather than just expanding the library.

## Tech Stack

- Next.js 15 App Router
- React 19
- Tailwind CSS
- Framer Motion
- Zustand
- Zod
- Vitest
- Static JSON content loaders in `src/lib/content.ts`, `src/lib/entities.ts`, and `src/lib/guidance-content.ts`

## Development

```bash
npm install
npm run dev
npm test
npm run type-check
npm run lint
npm run build
```

For lightweight verification guidance, see `docs/testing-smoke.md`.

## Content Conventions

- Add new subjects by creating `content/curriculum/{slug}/manifest.json`
- Add subject content via JSON files in `modules/`, `lessons/`, `frameworks/`, `projects/`, `tools/`, and `day-in-life/`
- Add roles under `content/roles/{slug}/`
- Roles can now own their own `modules/`, `lessons/`, `frameworks/`, `projects/`, `tools/`, and `day-in-life/` content in addition to linking out to related subjects
- Add topics under `content/topics/{slug}/`
- Add onboarding packs under `content/onboarding/`
- Add curated truth stacks under `content/sources/`
- Add curated signal digests under `content/signals/`
- Do not hardcode subjects into navigation or route logic
- Keep content grounded in the subject's real intellectual arc and practical ecosystem
- Keep role content structured and readable: what it is, where it came from, what people do, how people get there, strengths, exposures, and career levers
- Keep copy scannable; use real paragraphs and sectioned explanations instead of dense single blocks
