<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/skunkworks-academy/.github/refs/heads/main/images/favicon-white.png">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/skunkworks-academy/.github/refs/heads/main/images/favicon-black.png">
  <img alt="Skunkworks Academy" src="https://raw.githubusercontent.com/skunkworks-academy/.github/refs/heads/main/images/favicon-black.png" width="82">
</picture>

# Luca Sprunt IDR — Docusaurus Site

### Cybersecurity Foundations · Systems Operations · Secure AI Automation

[![Docusaurus](https://img.shields.io/badge/Docusaurus-3.10-3ecc5f?style=for-the-badge&logo=docusaurus&logoColor=white)](https://docusaurus.io/)
[![Deploy](https://img.shields.io/github/actions/workflow/status/skunkworks-academy/ls1607/pages.yml?branch=main&style=for-the-badge&label=GitHub%20Pages)](https://github.com/skunkworks-academy/ls1607/actions/workflows/pages.yml)
[![Roadmap](https://img.shields.io/badge/Roadmap-July%202026%E2%80%93June%202027-0f62fe?style=for-the-badge)](https://skunkworks-academy.github.io/ls1607/)

**Interactive Individual Development Roadmap prepared by Skunkworks Academy.**

[Open the live roadmap](https://skunkworks-academy.github.io/ls1607/) · [Download the editable IDR](https://github.com/skunkworks-academy/ls1607/raw/main/docs/Luca_Sprunt_Individual_Development_Roadmap.docx)

</div>

---

## What this site contains

- Responsive Docusaurus landing dashboard
- Complete multi-page Individual Development Roadmap
- Mermaid career, learning, security-control and RACI diagrams
- 30/60/90-day and 12-month Gantt timelines
- Interactive browser-local milestone tracker
- Capability baseline and visual progress indicators
- Portfolio-project specifications and acceptance criteria
- Secure OpenClaw agent control baseline
- Mentoring, evidence, KPI and review templates
- Light and dark Skunkworks Academy branding
- GitHub Pages deployment through GitHub Actions

## Development

```bash
npm install
npm start
```

The local development site opens at `http://localhost:3000/ls1607/`.

## Production build

```bash
npm run build
npm run serve
```

The static production output is generated in `build/`.

## Deployment

Pushes to `main` trigger `.github/workflows/pages.yml`, which:

1. Installs Node.js dependencies.
2. Builds the Docusaurus site.
3. Uploads the `build/` directory as a GitHub Pages artifact.
4. Deploys the artifact to GitHub Pages.

Repository administrators must configure **Settings → Pages → Source → GitHub Actions**.

## Content structure

```text
.
├── docs/
│   ├── intro.md
│   ├── profile.md
│   ├── pathway.md
│   ├── execution-roadmap.md
│   ├── portfolio.md
│   ├── secure-agent.md
│   ├── mentoring.md
│   ├── evidence.md
│   ├── governance.md
│   └── references.md
├── src/
│   ├── components/ProgressTracker/
│   ├── css/custom.css
│   └── pages/
├── static/
│   └── img/
├── docusaurus.config.js
├── sidebars.js
└── package.json
```

## Privacy

This repository contains development-planning information. Personal phone numbers, private email addresses and identity documents must not be committed. Review screenshots, logs, configurations and lab evidence before publication.

## Ownership

**Skunkworks Academy — Training and Career Development**  
[training@skunkworksacademy.com](mailto:training@skunkworksacademy.com)
