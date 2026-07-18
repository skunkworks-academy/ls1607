# Data Classification and Consent Model

**Status:** Not started

## Classification levels

| Level | Description | Telco examples | Allowed in this project |
|---|---|---|---|
| Public | Published documentation and non-sensitive reference data | API names, public specifications, documented rate-limit descriptions | Yes |
| Internal | Non-public operational information with no personal data | Private sandbox configuration, internal design notes | Only when authorised; do not publish |
| Personal | Information about an identified or reasonably identifiable person | Phone number, account identifier, subscriber profile | No real data; mock values only |
| Sensitive/high-impact | Data that could enable tracking, identity abuse or significant harm | Precise location, SIM ownership, identity verification evidence, communications metadata | Prohibited in the learner MVP |
| Secret | Credentials or cryptographic material | API keys, tokens, client secrets, private keys | Never commit or record |

## API data-flow register

| Data element | Source | Purpose | Classification | Consent basis | Stored? | Retention | Shared with | Control decision |
|---|---|---|---|---|---|---|---|---|
| OpenAPI specification | Public portal or supplied sample | Assess API design metadata | Public | Not applicable | Yes | Project duration | Repository readers | Allowed |
| Mock phone number | Generated test fixture | Validate input handling | Synthetic | Not applicable | Test only | Immediate deletion | None | Allowed |
| Real phone number | User or external system | Not required | Personal | Not assessed | No | None | None | Prohibited |
| Precise location | Network API | Not required | Sensitive/high-impact | Not assessed | No | None | None | Prohibited |
| API token | Developer portal | Sandbox authentication | Secret | Account authorisation | Environment only | Shortest possible | None | Never log or commit |

## Consent analysis

For each candidate API, answer:

- Who is the data subject?
- Who requests the data?
- Who controls the purpose of processing?
- What consent or alternative legal authority is documented?
- Is consent explicit, informed, specific, current and revocable?
- Can the subject understand the purpose and consequences?
- Does the API return only the minimum result required?
- Is consent evidence retained without retaining unnecessary personal data?
- What happens when consent is refused, expires or is withdrawn?
- Does the operator require a standard consent flow such as GSMA Open Gateway or CAMARA patterns?

## Purpose-limitation test

An API use case may proceed to sandbox design only when all answers are **yes**:

- [ ] The purpose is documented and legitimate.
- [ ] The developer portal permits the use case.
- [ ] The minimum data required is identified.
- [ ] Mock or synthetic data cannot meet the learning objective instead.
- [ ] Required consent and authorisation are documented.
- [ ] Retention and deletion rules are defined.
- [ ] Logging excludes unnecessary personal information.
- [ ] A mentor has approved the test plan.

## Ethical-use statement

This project will not use telecommunications APIs to track people, discover ownership of numbers or SIMs, infer private relationships, profile individuals, bypass consent or create surveillance capabilities. The tool evaluates API governance and design; it does not operationalise access to real subscriber data.
