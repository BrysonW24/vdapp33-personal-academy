# vdapp33-personal-academy

Personal Academy is a unified multi-subject Next.js app for curiosity-driven learning. It keeps politics, commercial property management, physics, quantum, aerospace, robotics, and rocket science inside one shell, one deploy, and one local-first state model, while roles and topics add applied and cross-disciplinary ways into the same academy.

## What This App Is

- Learning-first, not operator-first
- Guided intellectual operating system for one learner first
- Subject-prefixed multi-subject architecture with first-class role and topic routes
- Static content app powered by JSON curriculum files, onboarding packs, source packs, signal digests, and Zod schemas
- One academy shell where subjects provide depth, topics widen the lens, and roles synthesize real-world application
- Local-first state for progress, onboarding, active path, learning mode, and weekly reviews

## Core Routes

- `/` — Personal Academy exploration dashboard
- `/setup` — Soft onboarding that generates a personal blueprint
- `/my-path` — Guided dashboard with next actions, weekly rhythm, and review prompts
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

- Sciences: `physics`, `quantum`
- Engineering: `aerospace`, `robotics`, `rocket-science`
- Society: `politics`, `commercial-property-management`

Overlay content lives alongside subjects:

- `content/roles/`
- `content/topics/`
- `content/onboarding/`
- `content/guidance/path-archetypes/`
- `content/sources/{subject|role|topic}/`
- `content/signals/{subjects|roles|topics}/`

## Guided OS Layer

Personal Academy now has a guidance system on top of the content shell:

- Soft onboarding at `/setup`
- Deterministic blueprint generation from curated questions and archetypes
- Three learning modes: `guided`, `explorer`, `operator`
- A persistent `My Path` dashboard with:
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
- `robotics` — full native subject inside Personal Academy with 20 modules, 10 lessons, 10 frameworks, 10 projects, 15 tools, and 4 day-in-the-life scenarios
- `rocket-science` — rich subject migrated from `vdapp38-rocket-science-academy`
- `quantum` — expanded beyond migration baseline with a full 20-module spine, lessons, frameworks, projects, tools, and day-in-the-life
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
