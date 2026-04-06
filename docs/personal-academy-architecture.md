# Nexus Architecture

## Intent

Nexus is the learning-first side of the academy ecosystem. It shares the multi-subject shell pattern with Founder OS, but not the operator doctrine. The current goal is not to prescribe a single path through the app; it is to create a browse-first encyclopedia shell that still supports guided learning when wanted.

## Design rules

- One app, one deploy, one progress store
- Subject switching happens inside the shared shell
- Content stays static and file-based
- Subjects register via `manifest.json`
- Missing sections stay honest with empty states
- Guidance stays deterministic and local-first, but secondary to open-world browsing
- Sources and signals stay curated rather than pretending to be live omniscience
- Human readability outranks content density
- Shared surfaces should explain the shape of a subject, topic, or role quickly before branching deeper
- Navigation must distinguish browse-level wayfinding from entity-context wayfinding
- Large-volume discovery should rely on macro buckets plus search-first quick jump, not giant undifferentiated lists
- Shared landing pages should be structured, repeatable, and visually scannable rather than prose-heavy
- Mobile optimisation is part of the architecture for shared surfaces, not a downstream QA step

## Documentation contract

For Nexus, architecture and doctrine updates must travel with implementation when the change affects product behavior or page structure.

Expected sync targets for meaningful changes:

- `CLAUDE.md` for app operating rules
- `README.md` for current product framing and working doctrine
- `docs/personal-academy-architecture.md` for route, UX, and system-level architecture
- `status/` files when the change materially affects operational truth

Agents should treat these documents as required reference points before and after major work, not as optional garnish.

## Current runtime

Current state:

- Subject, role, and topic routes are all live in the app router
- `/{subject}/...` remains the canonical curriculum spine
- `/roles/{slug}` and `/topics/{slug}` are now live route families layered on top of aliased subject content plus entity-native content packs
- Roles can now own first-class modules, lessons, frameworks, projects, tools, and day-in-the-life content directly inside `content/roles/{slug}/` when the role should not be reduced to borrowed subject slices alone
- `/setup` and `/my-path` remain live but are secondary surfaces rather than the homepage story
- `quantum-science` and `energy-systems` are the canonical expansions of the original science/content base
- `/{subject|role|topic}/sources` and `/{subject|role|topic}/signals` are live curated surfaces
- Guide rails now connect start pages, module pages, lesson pages, project pages, and tool pages back into the active path
- The homepage now teaches the hierarchy explicitly with a Three.js-based subject/topic/role explainer plus macro-bucket browse sections
- The header now includes a persistent local command palette across desktop and mobile
- Politics now lands on its richer systems surface directly and acts as the flagship subject-world reference implementation

## Entity-aware model

- Subject, role, and topic content should remain clearly separated in the content tree
- Subjects remain canonical depth owners
- Topics are cross-disciplinary lenses
- Roles are embodied synthesis tracks
- Roles may synthesize subjects, own their own role-native content, or do both when that produces a clearer world for the user
- Macro buckets are a discovery layer above those canonical structures, not a replacement for them
- The guidance layer sits across all three rather than replacing them
- The UI should lead with exploration surfaces first, not with a required path flow
- Roles should use a structured presentation contract that makes them readable and comparable
- Shared role pages should prioritise: what the role is, where it came from, what people do, how people enter, what strengths matter, what pressures show up, and how careers progress
- Module indexes should read as learning maps rather than flat content catalogs where possible

## UX doctrine for future work

- Use frameworks, mental models, and visual maps first; let detail branch underneath
- Break dense copy into shorter paragraphs and distinct section jobs
- Prefer reusable presentation systems over one-off hero or landing page implementations
- Borrow good visual patterns from Founder OS selectively, but do not import its product stance or route assumptions
- When updating shared surfaces, verify desktop and mobile behavior before considering the work complete
- Keep roles feeling like guided worlds rather than static info pages
- Keep the hierarchy language stable: subjects = disciplined depth, topics = provocative cross-domain lenses, roles = embodied intelligence

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
- `vdapp40-quantum-academy` → `quantum-science`

The original apps were archived on 2026-04-04 into `archive/2026-04-04-personal-academy-migration-sources/` after the unified app passed build, route, and browser verification.

## Subject maturity

- Politics: rich migration
- Physics: rich migration
- Rocket Science: rich migration
- Aerospace: deepened beyond the original source baseline
- Quantum Science: rebuilt into a full subject rather than staying thin
- Energy Systems: promoted from topic-level energy content into a canonical subject

See `personal-academy-migration-analysis.md` for the post-migration depth comparison and archive rationale.

## Route surface

- `/`
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
- `/setup`
- `/my-path`

The route surface above is the currently verified runtime shell.

## Browse architecture

The browse layer now has four distinct jobs:

1. `Top nav` for high-level route families: Home, Subjects, Roles, Topics, Signals.
2. `Command palette` for fast local search across subjects, topics, roles, flagship modules, and signals.
3. `Macro buckets` for large-volume discovery without forcing users through technical group names first.
4. `Context nav` for entity-specific movement once a user is inside a subject, role, or topic.

Those four jobs should remain visually and conceptually separate. Avoid collapsing them back into one overloaded navigation surface.
