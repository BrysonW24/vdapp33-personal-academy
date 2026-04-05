# Personal Academy Smoke Checks

This app does not have a heavy automated test suite yet. Use this note as the lightweight verification path for docs, status, and content-model changes.

## Baseline commands

Run these before merging content or navigation updates:

```bash
npm run build
npm run type-check
npm run lint
```

## Manual smoke path

- Open `/` and confirm the exploration dashboard renders without console errors.
- Open a representative subject landing page such as `/{subject}`.
- Open a representative module, project, tool, and day-in-the-life page for at least one subject.
- Confirm empty states still look intentional on subjects with thinner content areas.

## Entity-aware content checks

- Confirm `content/roles/` and `content/topics/` entries still have `manifest.json` plus related-entity metadata.
- Confirm role/topic copy still matches the intended entity kind instead of drifting into subject-only language.
- If `/roles/{slug}` or `/topics/{slug}` becomes a verified route surface later, add it to this smoke path rather than building a full test suite first.

## When to use this note

- After content-only updates
- After status/doc drift fixes
- After navigation copy changes that may affect entity-aware labels
