# vdapp33-personal-academy

Personal Academy is a unified multi-subject Next.js app for curiosity-driven learning. It keeps politics, commercial property management, physics, quantum, aerospace, robotics, and rocket science inside one shell, one progress store, and one deploy.

## What This App Is

- Learning-first, not operator-first
- Subject-prefixed multi-subject architecture
- Static content app powered by JSON curriculum files and Zod schemas
- One multi-subject academy shell with subject depth that can evolve independently

## Core Routes

- `/` — Personal Academy exploration dashboard
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

## Subject Model

All subject content lives under `content/curriculum/{subject}/` and is auto-discovered from `manifest.json`.

Current groups:

- Sciences: `physics`, `quantum`
- Engineering: `aerospace`, `robotics`, `rocket-science`
- Society: `politics`, `commercial-property-management`

## Current Migration State

- `politics` — rich subject migrated from `vdapp35-politician-academy`
- `physics` — rich subject migrated from `vdapp36-physicist-academy`
- `aerospace` — expanded beyond migration baseline with frameworks, projects, tools, and day-in-the-life
- `robotics` — full native subject inside Personal Academy with 20 modules, 10 lessons, 10 frameworks, 10 projects, 15 tools, and 4 day-in-the-life scenarios
- `rocket-science` — rich subject migrated from `vdapp38-rocket-science-academy`
- `quantum` — expanded beyond migration baseline with a full 20-module spine, lessons, frameworks, projects, tools, and day-in-the-life
- `commercial-property-management` — genericised subject migrated from `vdapp46-jll-commercial-property-manager-academy` with 20 modules, 5 lessons, 10 frameworks, 8 projects, 14 tools, and 4 day-in-the-life scenarios

The migrated standalone source apps were archived on 2026-04-04 into `archive/2026-04-04-personal-academy-migration-sources/` after route, build, and browser verification passed in the unified app. See `docs/personal-academy-migration-analysis.md` for the migration analysis.

## Tech Stack

- Next.js 15 App Router
- React 19
- Tailwind CSS
- Framer Motion
- Zustand
- Zod
- Static JSON content loaders in `src/lib/content.ts`

## Development

```bash
npm install
npm run dev
npm run type-check
npm run lint
npm run build
```

## Content Conventions

- Add new subjects by creating `content/curriculum/{slug}/manifest.json`
- Add subject content via JSON files in `modules/`, `lessons/`, `frameworks/`, `projects/`, `tools/`, and `day-in-life/`
- Keep all content routes under `/{subject}/...`
- Do not hardcode subjects into navigation or route logic
- Keep content grounded in the subject's real intellectual arc and practical ecosystem
