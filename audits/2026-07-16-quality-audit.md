# Quality Audit — 16 July 2026

## Scope

- Docusaurus production build
- Learner-first landing page and onboarding
- Responsive desktop, tablet and mobile layouts
- Keyboard and assistive-technology support
- Browser-local progress tracking
- Technical SEO and crawler discovery
- GitHub Pages deployment validation
- Lighthouse mobile and desktop budgets

## Automated gates

| Category | Mobile minimum | Desktop minimum |
|---|---:|---:|
| Performance | 85 | 90 |
| Accessibility | 95 | 95 |
| Best Practices | 95 | 95 |
| SEO | 95 | 95 |

Each Lighthouse profile runs three times. The pipeline also checks the canonical URL, document title, meta description and viewport.

## Remediations completed

- Removed render-blocking third-party fonts.
- Localised navigation branding assets.
- Added semantic progress bars, table labels and keyboard focus states.
- Added reduced-motion and print behavior.
- Added a responsive weekly timetable, portfolio controls and review workflow.
- Added source-level and generated-build privacy checks.
- Added structured `LearningResource` metadata, sitemap generation and `robots.txt`.
- Made validation and production build checks mandatory before GitHub Pages deployment.

## Privacy boundary

Learner progress is stored in browser local storage. Credentials, private keys and confidential records must not be entered into the tracker.
