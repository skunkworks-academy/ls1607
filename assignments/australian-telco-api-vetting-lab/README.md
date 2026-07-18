# Portfolio Project — Australian Telco API Privacy & Security Vetting Lab

> **Assignee:** [@Luca-Sprunt](https://github.com/Luca-Sprunt)  
> **Status:** Assigned  
> **Tracking issue:** [#18](https://github.com/skunkworks-academy/ls1607/issues/18)  
> **Mentor:** Raydo  
> **Duration:** 6 weeks  
> **Estimated effort:** 30–42 hours  
> **Deadline:** To be confirmed with mentor

## Project objective

Research Australian telecommunications developer portals, privacy obligations, security standards, consent models and ethical-use requirements, then build a **privacy-aware Telco API Vetting Tool**.

The MVP will assess API documentation, OpenAPI specifications and manually entered metadata. It will produce a structured risk and readiness report without processing real subscriber, location, ownership or identity data.

## Non-negotiable boundary

This is a defensive research and governance project.

- Use public documentation, approved sandboxes and mock data only.
- Do not query production subscriber records.
- Do not attempt to locate people or establish ownership of phone numbers or SIMs.
- Do not bypass consent, authentication, rate limits or portal controls.
- Do not test any operator system without explicit written authorisation.
- Do not commit API keys, tokens, personal data or confidential documentation.

## Required deliverables

| Deliverable | Working file | Status |
|---|---|---|
| Legal and standards research matrix | [`research/legal-and-standards-matrix.md`](research/legal-and-standards-matrix.md) | Not started |
| Developer-portal and API inventory | [`research/telco-api-inventory.csv`](research/telco-api-inventory.csv) | Not started |
| Data classification and consent model | [`privacy/data-classification-and-consent.md`](privacy/data-classification-and-consent.md) | Not started |
| Privacy impact assessment | [`privacy/privacy-impact-assessment.md`](privacy/privacy-impact-assessment.md) | Not started |
| Threat model and abuse cases | [`security/threat-model.md`](security/threat-model.md) | Not started |
| Secure architecture | [`security/architecture.md`](security/architecture.md) | Not started |
| MVP implementation | [`src/README.md`](src/README.md) | Not started |
| Test plan and results | [`tests/README.md`](tests/README.md) | Not started |
| Final vetting report | [`reports/final-vetting-report.md`](reports/final-vetting-report.md) | Not started |
| Evidence and mentor review | [`evidence/README.md`](evidence/README.md) | Not started |

## Product concept

The Telco API Vetting Tool should accept either:

1. an OpenAPI specification;
2. a manually completed API profile; or
3. mock API metadata supplied with the project.

It should evaluate:

- authentication and authorisation controls;
- consent and purpose limitation;
- data sensitivity and privacy impact;
- subscriber, identity and location-data exposure;
- rate limiting and anti-abuse controls;
- logging, retention and deletion expectations;
- sandbox and test-data availability;
- API inventory and versioning quality;
- OWASP API Security Top 10 indicators;
- documentation and governance gaps.

The output should include:

- overall risk rating;
- privacy classification;
- control gaps;
- recommended actions;
- evidence references;
- a clear **do not use in production** warning where requirements are unmet.

## Six-week plan

| Week | Focus | Required output |
|---|---|---|
| 1 | Legal, privacy and ethical research | Completed legal matrix and ethics statement |
| 2 | Telco portal discovery and API inventory | Portal register, API categories and terms review |
| 3 | Privacy engineering and threat modelling | PIA, data classification, consent matrix and threat model |
| 4 | Secure design and MVP build | Architecture, scoring model and working prototype |
| 5 | Testing and control validation | Unit tests, misuse cases and mock-data validation |
| 6 | Reporting, demonstration and mentor review | Final report, evidence register, demo and pull request |

## Scoring rubric

| Criterion | Weight |
|---|---:|
| Legal and regulatory research | 20 |
| Privacy, ethics and consent design | 15 |
| API inventory and data classification | 15 |
| Threat model and secure architecture | 20 |
| Functional MVP | 15 |
| Testing and evidence quality | 10 |
| Documentation and presentation | 5 |
| **Total** | **100** |

**Pass:** 70 or higher  
**Distinction:** 85 or higher

A project cannot pass if it includes unauthorised access, real-person tracking, secret exposure, privacy violations or deliberate breach of a developer portal's terms.

## Submission workflow

1. Read issue [#18](https://github.com/skunkworks-academy/ls1607/issues/18) and the learner-facing project page.
2. Create `assignment/australian-telco-api-vetting-lab`.
3. Complete research and design before implementing API calls.
4. Use mock data and sandbox endpoints only.
5. Commit each meaningful unit of work.
6. Update the evidence register.
7. Open a pull request to `main` with `Closes #18` only when the full project is complete.
8. Resolve mentor review before merge.

## Recommended implementation options

A simple Python or Node.js command-line tool is sufficient. A lightweight web interface may be added only after the command-line assessment engine and tests work reliably.

The project should prioritise safe design, explainability and evidence over feature volume.
