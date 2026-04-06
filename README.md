# Nexus

Repo lineage: `vdapp33-personal-academy`

Nexus is a unified multi-subject Next.js app for curiosity-driven learning. It keeps politics, commercial property management, physics, quantum-science, energy-systems, aerospace, robotics, and rocket science inside one shell, one deploy, and one local-first state model, while roles and topics add applied and cross-disciplinary ways into the same academy.

## What This App Is

- Learning-first, not operator-first
- Browse-first encyclopedia interface with subjects, topics, and roles as the main entry points
- Subject-prefixed multi-subject architecture with first-class role and topic routes
- Static content app powered by JSON curriculum files, onboarding packs, source packs, signal digests, and Zod schemas
- One academy shell where subjects provide depth, topics widen the lens, and roles synthesize real-world application
- Local-first state for progress, onboarding, and optional secondary surfaces such as My Path

## Working Doctrine

- Human readability is a core product requirement, not a polish layer
- Pages should explain the shape of a field or role quickly before asking the user to read deeply
- Use paragraph spacing, section rhythm, and visual summaries to reduce cognitive load
- Roles should follow a repeatable, structured setup rather than feeling like loose editorial pages
- Mobile optimisation is mandatory for shared surfaces such as nav, heroes, landing pages, and module indexes
- Founder OS can be used as visual inspiration, but Nexus must keep its own browse-first encyclopedia stance
- When meaningful design, architecture, or product-direction changes land, update the reference docs in the same pass

## Core Routes

- `/` — Nexus exploration dashboard
- `/setup` — Optional soft onboarding surface
- `/my-path` — Secondary guided dashboard kept for users who want a structured session
- `/subjects` — Subject directory
- `/roles` — Role directory
- `/topics` — Topic directory
- `/signals` — Curated signal hub tied to the active path
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

Current groups:

- Sciences: `physics`, `quantum-science`, `chemistry`, `materials-science`
- Engineering: `aerospace`, `robotics`, `rocket-science`, `cybersecurity`, `data-science`, `space-infrastructure`, `energy-systems`, `systems-engineering`, `software-engineering`, `civil-engineering`, `electrical-engineering`, `mechanical-engineering`
- Society: `politics`, `law`, `sociology`, `geopolitics`, `public-administration`, `demography`, `commercial-property-management`
- Markets: `finance-accounting`, `supply-chain-logistics`
- Life: `biology`, `biotechnology`, `agriculture-food-systems`, `health`
- Humanities: `design`, `typography`, `religion-belief-systems`, `world-history`, `ancient-history`, `modern-history`, `communication`, `music-and-instruments`
- Mind: `psychology`, `relationships`, `self-knowledge`, `emotions`, `meditation`, `consciousness`, `love`

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
- A deterministic next-best-action engine that ranks:
  - unfinished core subject work
  - supporting topic reinforcement
  - role-based application
  - current project work
  - weekly review
  - truth-stack review
  - curated signals
- Guide rails on start pages, module pages, lesson pages, project pages, and tool pages

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

The current post-migration work is about direction rather than just more content: guiding the learner, not just expanding the library.

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
- Add topics under `content/topics/{slug}/`
- Add onboarding packs under `content/onboarding/`
- Add curated truth stacks under `content/sources/`
- Add curated signal digests under `content/signals/`
- Do not hardcode subjects into navigation or route logic
- Keep content grounded in the subject's real intellectual arc and practical ecosystem
- Keep role content structured and readable: what it is, where it came from, what people do, how people get there, strengths, exposures, and career levers
- Keep copy scannable; use real paragraphs and sectioned explanations instead of dense single blocks
