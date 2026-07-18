# Legal, Regulatory and Standards Research Matrix

**Status:** Not started  
**Important:** This is a learning and governance analysis, not legal advice. Use current official sources and record the access date.

## Research method

For every source:

1. identify whether it is law, regulatory guidance, industry guidance or a voluntary standard;
2. record which project activity it affects;
3. identify the data, consent, security, retention and disclosure implications;
4. distinguish mandatory requirements from recommended practice;
5. record unresolved questions for mentor or legal review.

## Australian legal and regulatory sources

| Source | Authority | Mandatory or guidance | Project relevance | Key requirements or questions | Evidence link | Accessed |
|---|---|---|---|---|---|---|
| Privacy Act 1988 | Australian Government / OAIC | Law | Personal information handling | | | |
| Australian Privacy Principles | OAIC | Principles-based law and guidance | Collection, notice, use, disclosure, security, access and correction | | | |
| Notifiable Data Breaches scheme | OAIC | Law and regulatory guidance | Breach assessment and notification | | | |
| Telecommunications Act 1997 — confidentiality protections | Australian Government | Law | Subscriber, service and communications information | | | |
| Telecommunications (Interception and Access) Act 1979 | Australian Government | Law | Interception, access and stored communications boundaries | | | |
| State or territory privacy requirements | Relevant authority | Varies | Depends on operator, customer and data location | | | |
| Telco developer-portal terms | Individual operator | Contractual | Permitted API use, data handling and testing | | | |
| Telco privacy notice | Individual operator | Regulatory and contractual context | Collection, consent, disclosure and retention | | | |

## Security, privacy and API standards

| Framework or standard | Publisher | Project use | Controls or concepts selected | Evidence link | Accessed |
|---|---|---|---|---|---|
| ASD Information Security Manual | Australian Signals Directorate | Security control baseline | | | |
| Essential Eight | Australian Signals Directorate | Foundational defensive controls | | | |
| OWASP API Security Top 10 | OWASP Foundation | API risk taxonomy | | | |
| OWASP ASVS | OWASP Foundation | Application security verification | | | |
| ISO/IEC 27001 | ISO/IEC | Information security management | | | |
| ISO/IEC 27002 | ISO/IEC | Security controls guidance | | | |
| ISO/IEC 27701 | ISO/IEC | Privacy information management | | | |
| ISO/IEC 29100 | ISO/IEC | Privacy framework and principles | | | |
| NIST Cybersecurity Framework | NIST | Govern, identify, protect, detect, respond and recover | | | |
| NIST Privacy Framework | NIST | Privacy risk management | | | |
| GSMA Open Gateway guidance | GSMA | Telco API onboarding, consent and technical patterns | | | |
| CAMARA API specifications | Linux Foundation / CAMARA | Common network API definitions and consent patterns | | | |

## Required analysis questions

- What data can the API expose directly or indirectly?
- Is the data personal information, sensitive information, communications content, metadata, location data or a derived identifier?
- What lawful purpose and user consent would be required?
- Does the portal permit student, research, sandbox or commercial use?
- Are production credentials available only after commercial or compliance approval?
- What restrictions apply to storage, onward disclosure and cross-border processing?
- What retention and secure-deletion rules apply?
- What logging is necessary, and what logging would itself create privacy risk?
- What breach, escalation and notification duties could apply?
- Which conclusions require qualified legal review rather than a learner assumption?

## Mentor review

| Question | Luca's conclusion | Evidence | Mentor comment | Status |
|---|---|---|---|---|
| Is the proposed MVP lawful and within portal terms? | | | | Pending |
| Is the data-minimisation boundary adequate? | | | | Pending |
| Are mandatory and voluntary requirements clearly separated? | | | | Pending |
