# Nexus Architecture

## Intent

Nexus is the learning-first side of the academy ecosystem. It shares the multi-subject shell pattern with Founder OS, but not the operator doctrine. The current goal is no longer just “one shell for many subjects.” It is “one shell that can direct a learner through a broad, deep, and applied education.”

## Design rules

- One app, one deploy, one progress store
- Subject switching happens inside the shared shell
- Content stays static and file-based
- Subjects register via `manifest.json`
- Missing sections stay honest with empty states
- Guidance stays deterministic and local-first
- Sources and signals stay curated rather than pretending to be live omniscience

## Current runtime

Current state:

- Subject, role, and topic routes are all live in the app router
- `/{subject}/...` remains the canonical curriculum spine
- `/roles/{slug}` and `/topics/{slug}` are now live route families layered on top of aliased subject content plus entity-native content packs
- `/setup` generates a local-first learning blueprint
- `/my-path` uses deterministic ranking to generate a current session and next-best actions
- `/{subject|role|topic}/sources` and `/{subject|role|topic}/signals` are live curated surfaces
- Guide rails now connect start pages, module pages, lesson pages, project pages, and tool pages back into the active path

## Entity-aware model

- Subject, role, and topic content should remain clearly separated in the content tree
- Subjects remain canonical depth owners
- Topics are cross-disciplinary lenses
- Roles are embodied synthesis tracks
- The guidance layer sits across all three rather than replacing them

## Guidance OS layer

The app now includes a directed-learning layer on top of content discovery:

- `content/onboarding/question-bank.json` defines the setup flow
- `content/guidance/path-archetypes/*.json` define deterministic archetype defaults
- `src/lib/academy-engine.ts` converts answers into a `LearningBlueprint`
- `src/lib/academy-state.ts` stores the blueprint, active mode, and reviews locally
- `src/components/guidance/GuideRail.tsx` makes the app explain why a page matters, what to do next, and what sources or signals matter around it

This turns the app from a library into a local-first learning operating system without adding backend complexity.

## Migration posture

Current content has been copied into `content/curriculum/{subject}/` from:

- `vdapp35-politician-academy` → `politics`
- `vdapp36-physicist-academy` → `physics`
- `vdapp37-aero-engineer-academy` → `aerospace`
- `vdapp38-rocket-science-academy` → `rocket-science`
- `vdapp40-quantum-academy` → `quantum`

The original apps were archived on 2026-04-04 into `archive/2026-04-04-personal-academy-migration-sources/` after the unified app passed build, route, and browser verification.

## Subject maturity

- Politics: rich migration
- Physics: rich migration
- Rocket Science: rich migration
- Aerospace: deepened beyond the original source baseline
- Quantum: rebuilt into a full subject rather than staying thin

See `personal-academy-migration-analysis.md` for the post-migration depth comparison and archive rationale.

## Route surface

- `/`
- `/setup`
- `/my-path`
- `/subjects`
- `/roles`
- `/topics`
- `/signals`
- `/{subject}`
- `/{subject}/blueprint`
- `/{subject}/modules`
- `/{subject}/modules/{slug}`
- `/{subject}/modules/{slug}/{lessonSlug}`
- `/{subject}/projects`
- `/{subject}/projects/{slug}`
- `/{subject}/tools`
- `/{subject}/tools/{slug}`
- `/{subject}/toolkit`
- `/{subject}/day-in-the-life`
- `/{subject}/sources`
- `/{subject}/signals`
- `/roles/{slug}`
- `/roles/{slug}/blueprint`
- `/roles/{slug}/modules`
- `/roles/{slug}/projects`
- `/roles/{slug}/tools`
- `/roles/{slug}/toolkit`
- `/roles/{slug}/day-in-the-life`
- `/roles/{slug}/sources`
- `/roles/{slug}/signals`
- `/topics/{slug}`
- `/topics/{slug}/modules`
- `/topics/{slug}/projects`
- `/topics/{slug}/tools`
- `/topics/{slug}/toolkit`
- `/topics/{slug}/sources`
- `/topics/{slug}/signals`

The route surface above is the currently verified runtime shell.
