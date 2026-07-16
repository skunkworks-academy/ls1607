---
id: portfolio
title: Portfolio Projects
sidebar_label: Portfolio Projects
description: Luca's four practical portfolio projects, deliverables and acceptance criteria.
---

# Portfolio Projects

## Portfolio target

By the annual review Luca should have:

- At least **two complete public repositories** with clear scope and evidence
- One private repository for sensitive lab or agent configuration
- A consistent learning-log history
- At least one technical write-up
- Evidence of iterative work through issues, commits and reviews
- A concise demonstration for each completed project

## Project 1 — Secure Personal Agent Baseline

**Purpose:** Convert the existing OpenClaw assistant into a documented, bounded and reviewable system.

### Deliverables

- Architecture diagram
- Asset and data-flow inventory
- Threat model
- Secrets and credential handling procedure
- Remote-access controls
- Permission boundary
- Logging and audit plan
- Backup and recovery procedure
- Safe-use and prohibited-use statement
- README with setup, assumptions and known risks

### Acceptance criteria

- No secrets committed to GitHub
- Remote access uses authenticated and encrypted channels
- Agent permissions are limited to documented needs
- Sensitive vault content is excluded or explicitly protected
- Logs support investigation without exposing unnecessary personal data
- A mentor reviews the threat model and operating boundary

## Project 2 — Home SOC Mini-Lab

**Purpose:** Build entry-level security-operations evidence.

### Suggested scope

- One Linux endpoint
- One Windows or additional Linux endpoint, where available
- Central log collection or a lightweight SIEM
- Authentication and system-event monitoring
- A small set of controlled test events
- Alert triage worksheet

### Deliverables

- Lab topology
- Installation and configuration notes
- Data-source register
- Three detection or investigation scenarios
- Two incident-style reports
- Screenshots or sanitised log extracts
- Lessons learned

### Acceptance criteria

- The lab is isolated from production and personal data
- Test activity is authorised and controlled
- Detection logic and evidence are reproducible
- Reports distinguish facts, assumptions and recommendations

## Project 3 — Network Security Baseline

**Purpose:** Demonstrate networking understanding and defensive thinking.

### Deliverables

- Current-state network diagram
- Device and service inventory
- Addressing and segmentation summary
- Router, firewall and wireless hardening checklist
- DNS and DHCP notes
- Risk register
- Validation results

### Acceptance criteria

- The diagram matches the tested environment
- Recommendations are prioritised by likelihood and impact
- Any changes have rollback steps
- Private addressing, credentials and identifying data are sanitised before publication

## Project 4 — Python Security Utility

**Purpose:** Combine Luca’s basic Python capability with a defensive use case.

### Suitable options

- File-integrity checker
- Log summariser
- Password-policy validator that never captures real passwords
- Configuration audit helper
- Hash comparison utility
- IOC-format validator using safe test data

### Deliverables

- Source code
- Tests
- Sample data
- README and usage examples
- Security assumptions
- Error handling
- Known limitations

### Acceptance criteria

- The utility has a clearly defensive and authorised purpose
- Safe defaults are used
- Inputs are validated
- Errors are handled without exposing sensitive data
- At least one peer or mentor review is recorded

## Recommended repository structure

```text
luca-cyber-portfolio/
├── README.md
├── SECURITY.md
├── LICENSE
├── docs/
│   ├── architecture.md
│   ├── threat-model.md
│   ├── decisions.md
│   └── evidence-register.md
├── src/
├── tests/
├── samples/
├── reports/
└── .github/
    ├── ISSUE_TEMPLATE/
    └── workflows/
```

## Repository quality checklist

- [ ] Clear problem statement and authorised scope
- [ ] Setup and usage instructions
- [ ] Architecture or workflow diagram
- [ ] Security and privacy considerations
- [ ] Evidence or screenshots with sensitive details removed
- [ ] Tests or reproducible validation steps
- [ ] Issues used to track work
- [ ] Meaningful commit history
- [ ] Lessons learned and future improvements
- [ ] Mentor or peer review recorded
