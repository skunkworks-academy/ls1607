# Web Application Incident Response Runbook

**Status:** Not started  
**Scope:** Authorised response to suspected web application incidents mapped to OWASP Top 10:2025 risk categories

## 1. Purpose and authority

Define who may activate this runbook, the systems in scope and the escalation authority.

## 2. Severity classification

| Severity | Example impact | Initial response target |
|---|---|---|
| Critical | Active compromise, major data exposure or service-wide impact | Immediate escalation |
| High | Confirmed exploitation with contained impact | Urgent response |
| Medium | Suspicious activity requiring investigation | Same business day |
| Low | Weak signal or control concern without evidence of compromise | Planned review |

## 3. Response lifecycle

### Preparation

- Asset ownership and contact register
- Logging and evidence readiness
- Backup and recovery validation
- Approved communication channels

### Identification

- Alert source
- Observed indicators
- Affected application, identity or data
- Facts, assumptions and unknowns
- Provisional OWASP risk mapping

### Containment

- Immediate safe containment action
- Access and session controls
- Change approval and rollback plan
- Evidence preservation

### Eradication

- Root cause
- Vulnerable component or control failure
- Remediation owner
- Validation method

### Recovery

- Service restoration criteria
- Monitoring period
- Business-owner approval
- Customer or regulatory communication decision

### Lessons learned

- Timeline
- Control gaps
- Corrective actions
- Owners and due dates
- Detection and runbook improvements

## 4. OWASP risk mapping

_Add a table mapping each OWASP Top 10:2025 category to likely indicators, evidence sources, containment considerations and preventive controls._

## 5. Evidence handling

- Record timestamps and evidence origin.
- Preserve integrity and chain-of-custody requirements where applicable.
- Do not place secrets, personal data or raw sensitive logs in the public repository.
- Use sanitised samples for portfolio evidence.

## 6. Communication templates

_Add concise internal escalation, stakeholder update and closure templates._

## 7. Review record

| Reviewer | Role | Outcome | Date |
|---|---|---|---|
| Luca Sprunt | Learner self-review | Pending | |
| Raydo | Mentor review | Pending | |
