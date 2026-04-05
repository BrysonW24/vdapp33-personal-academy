# Personal Academy Migration Analysis

## Summary

Personal Academy is now the canonical learning surface for politics, commercial property management, physics, quantum, aerospace, robotics, and rocket science. The five original personal-source apps plus the commercial property manager source app were archived on 2026-04-04 after the unified app passed build verification, representative route verification, and browser QA.

This analysis covers the subject-academy migration only. The newer roles/topics entity-aware direction is a separate follow-on layer and should not be confused with the subject migration completed here.

Archived source apps now live in:

- `archive/2026-04-04-personal-academy-migration-sources/vdapp35-politician-academy`
- `archive/2026-04-04-personal-academy-migration-sources/vdapp36-physicist-academy`
- `archive/2026-04-04-personal-academy-migration-sources/vdapp37-aero-engineer-academy`
- `archive/2026-04-04-personal-academy-migration-sources/vdapp38-rocket-science-academy`
- `archive/2026-04-04-personal-academy-migration-sources/vdapp40-quantum-academy`
- `archive/2026-04-04-personal-academy-migration-sources/vdapp46-jll-commercial-property-manager-academy`

## Shape changes

The migration changed the product shape in four important ways:

1. Standalone subject apps became one subject-switched academy with one shell, one deploy target, and one progress model.
2. Every subject now follows the same route family: `/{subject}`, `/{subject}/blueprint`, `/{subject}/modules`, `/{subject}/projects`, `/{subject}/tools`, `/{subject}/toolkit`, and `/{subject}/day-in-the-life`.
3. Shared shell patterns replaced duplicated standalone page trees and inconsistent per-app navigation.
4. Structured curriculum content was preserved, but stale standalone shell artifacts and non-canonical deep-dive pages were intentionally left behind.

## Depth comparison

These counts compare the archived source apps to the active Personal Academy subject directories:

| Subject | Source app counts | Personal Academy counts | Result |
| --- | --- | --- | --- |
| Politics | 20 modules, 8 lessons, 11 frameworks, 10 projects, 20 tools, 4 day-in-the-life | 20 modules, 8 lessons, 11 frameworks, 10 projects, 20 tools, 4 day-in-the-life | Full parity migration |
| Physics | 20 modules, 5 lessons, 12 frameworks, 11 projects, 20 tools, 4 day-in-the-life | 20 modules, 5 lessons, 12 frameworks, 11 projects, 20 tools, 4 day-in-the-life | Full parity migration |
| Aerospace | 20 modules, 5 lessons, 0 frameworks, 0 projects, 0 tools, 0 day-in-the-life | 20 modules, 5 lessons, 21 frameworks, 8 projects, 11 tools, 4 day-in-the-life | Deepened far beyond the source app |
| Rocket Science | 20 modules, 5 lessons, 11 frameworks, 10 projects, 20 tools, 4 day-in-the-life | 20 modules, 5 lessons, 11 frameworks, 10 projects, 20 tools, 4 day-in-the-life | Full parity migration |
| Quantum | 4 modules, 0 lessons, 0 frameworks, 0 projects, 0 tools, 0 day-in-the-life | 20 modules, 5 lessons, 13 frameworks, 8 projects, 10 tools, 4 day-in-the-life | Rebuilt into a real academy subject |
| Commercial Property Management | 20 modules, 5 lessons, 10 frameworks, 8 projects, 14 tools, 4 day-in-the-life | 20 modules, 5 lessons, 10 frameworks, 8 projects, 14 tools, 4 day-in-the-life | Full parity migration with generic subject framing |

## What was preserved

- Subject identities and subject slugs
- Static JSON curriculum as the source of truth
- Subject grouping doctrine:
  - `sciences`: physics, quantum
  - `engineering`: aerospace, robotics, rocket-science
  - `society`: politics, commercial-property-management
- The strongest source material in the six migrated subjects with no content-count regressions

## What improved

- One consistent navigation and learning shell across seven active subjects
- Manifest-driven discovery instead of standalone app duplication
- One subject-scoped progress system inside the unified app
- Cleaner separation from Founder OS operator framing
- Honest partial-state handling during the migration phase
- Major depth gains in Aerospace and Quantum
- A generic Commercial Property Management subject that keeps factual vendor references in-content without turning the shell into a client-branded app

## Archive rationale

The standalone source apps were archived because the unified app now satisfies the practical archive gates:

- The active route families render correctly for all seven subjects
- `npm run build`, `npm run lint`, and `npm run type-check` pass in the unified app
- Representative lesson, project, and tool routes pass route checks
- Desktop and mobile browser QA passed after the runtime repair
- The unified app meets or exceeds the source content depth for every migrated subject

## Working rule going forward

`vdapp33-personal-academy` is now the only active development target for the six migrated subjects, with Robotics continuing as a native subject inside the same shell. The archived standalone apps are retained only as recovery/reference copies.

Entity-aware role/topic work should be tracked as an additive evolution on top of this shell, not as a rewrite of the migration history documented above.
