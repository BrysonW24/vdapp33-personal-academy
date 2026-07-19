# AGENTS.md — vdapp33-personal-academy

## Role

vdapp33-personal-academy is What this app is

## Scope

This app covers core functionality for its domain. Specific features and integrations are documented in CLAUDE.md and README.md.

## Upstream Dependencies

- vd-engine (for shared UI components and packages)
- vd-os-kernel (for platform orchestration)
- vd-business (for brand and positioning guidance)

## Downstream Consumers

- End users accessing the application
- Potential integrations with other Vivacity.ai systems

## File-Touch Rules

**Safe to edit:**
- Application code and components
- User-facing content and pages
- Styling and design
- Configuration that doesn't break APIs

**Requires coordination:**
- API contract changes
- Database schema changes
- Authentication and security changes
- Major architecture changes

## Known Risks

- Backend/database integration status unknown
- External API dependencies not documented
- Authentication strategy not yet documented
- Production deployment requirements unclear

## Close-Out Steps

After any session that modifies this app:

1. Run available linters and type-checkers
2. Test core user flows manually if possible
3. Verify builds complete without errors
4. Update CLAUDE.md if tech stack or architecture changes
5. Document any new dependencies or third-party integrations
