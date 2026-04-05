# Personal Academy Architecture

## Intent

Personal Academy is the learning-first side of the academy ecosystem. It shares the multi-subject shell pattern with Founder OS, but not the operator doctrine.

## Design rules

- One app, one deploy, one progress store
- Subject switching happens inside the shared shell
- Content stays static and file-based
- Subjects register via `manifest.json`
- Missing sections stay honest with empty states

## Entity-aware direction

Current state:

- The verified runtime shell is still subject-prefixed
- Roles and topics now exist as content kinds alongside subjects
- Related-entity metadata is being used to make the navigation layer entity-aware without turning every content kind into the same route shape

Target state:

- Subject, role, and topic content should remain clearly separated in the content tree
- Docs and status should describe which entity kinds are live content versus which are only target-state route surfaces
- Route rollout for `/roles/{slug}` and `/topics/{slug}` should be treated as a separate verification step from content authoring

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

The route surface above is the current verified subject shell. Entity-aware role/topic routes belong in target-state notes until they are explicitly added and checked.
