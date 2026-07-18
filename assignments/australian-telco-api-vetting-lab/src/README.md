# MVP Implementation Specification

**Status:** Not started

## Required MVP

Build a command-line assessment tool that reads an API profile or OpenAPI document and produces a privacy and security vetting report.

## Minimum commands

```text
telco-vet assess <input-file>
telco-vet validate <input-file>
telco-vet explain <rule-id>
```

Equivalent commands are acceptable in Python or Node.js.

## Minimum input model

```json
{
  "provider": "Example Telco",
  "api_name": "Example Verification API",
  "environment": "sandbox",
  "authentication": "OAuth 2.0",
  "consent_required": true,
  "data_categories": ["derived-verification-result"],
  "location_precision": "none",
  "subscriber_identity_exposed": false,
  "rate_limit_documented": true,
  "retention_documented": true,
  "terms_reviewed": true,
  "privacy_notice_reviewed": true
}
```

Use synthetic provider names and mock values in committed fixtures.

## Required output

```text
Assessment: Example Verification API
Overall risk: Medium
Privacy classification: Personal-data capable; mock-data assessment only
Production readiness: Not assessed

Findings
- Consent flow is documented.
- Rate limiting is documented.
- Retention period requires verification.
- No production subscriber data was processed.

Required actions
1. Confirm retention and deletion terms.
2. Map authorisation controls to OWASP API1 and API5.
3. Obtain mentor approval before any sandbox integration.
```

## Required rules

At minimum, implement checks for:

- missing or weak authentication;
- undocumented authorisation;
- absent consent requirements;
- personal, location or subscriber-data exposure;
- missing rate limits;
- missing retention and deletion terms;
- absent sandbox support;
- missing terms or privacy review;
- unsafe logging expectations;
- incomplete API inventory or versioning;
- relevant OWASP API Security Top 10 risks.

## Explainability

Every score must include:

- rule identifier;
- evidence field;
- reason;
- severity;
- recommended action;
- whether the conclusion is confirmed, inferred or unresolved.

## Security controls

- Treat all files as untrusted input.
- Never execute input content.
- Reject unsupported protocols and excessive file sizes.
- Disable network access by default.
- Keep sandbox support behind an explicit configuration flag.
- Read tokens from environment variables only.
- Redact secrets and personal information from output.
- Add dependency and secret scanning where practical.

## Stretch objectives

Complete these only after the tested CLI works:

- Local browser interface
- Export to HTML
- OpenAPI endpoint classification
- Rule mappings to APPs, ISO, NIST and ASD ISM
- Comparison of two API profiles
- Machine-readable SARIF or JSON findings
