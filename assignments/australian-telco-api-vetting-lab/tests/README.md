# Test Plan and Results

**Status:** Not started

## Test objectives

Demonstrate that the vetting tool is accurate, explainable, resilient to malformed input and unable to process prohibited real-person data by default.

## Minimum automated tests

| Test area | Required cases |
|---|---|
| Input validation | Valid profile, missing fields, wrong types, oversized input and malformed JSON/YAML |
| Secret handling | Token-like values are rejected or redacted from logs and reports |
| Personal-data boundary | Real-looking phone numbers, precise coordinates and subscriber identifiers trigger blocking or critical warnings |
| Authentication | Missing authentication and weak authentication are identified |
| Authorisation | Missing object and function-level authorisation evidence is flagged |
| Consent | Missing consent and purpose fields are flagged for sensitive APIs |
| Rate limiting | Missing or undocumented limits affect risk score |
| Retention | Missing storage, deletion or retention information is unresolved or high risk |
| Explainability | Every finding contains rule, reason, severity, evidence and action |
| Determinism | The same input produces the same score and findings |
| Safe parsing | No scripts, references or payloads from input files are executed |
| Offline mode | Core assessment works with network access disabled |

## Required mock fixtures

- Low-risk public metadata API
- Medium-risk verification API returning only a boolean result
- High-risk precise-location API profile
- High-risk subscriber-identity API profile
- Incomplete documentation profile
- Malformed OpenAPI document
- Input containing fake token patterns for redaction testing

## Manual security tests

- [ ] Attempt path traversal through an input filename.
- [ ] Attempt oversized and deeply nested input.
- [ ] Attempt script and command injection strings.
- [ ] Attempt unsafe external references in an OpenAPI document.
- [ ] Verify no network requests occur in offline mode.
- [ ] Verify reports do not include environment-variable values.
- [ ] Verify error messages do not disclose local paths or secrets.

## Results register

| Test | Expected | Actual | Evidence | Status |
|---|---|---|---|---|
| | | | | Not run |

## Exit criteria

- [ ] All critical tests pass.
- [ ] No secrets or personal information appear in output.
- [ ] High-impact data categories trigger a critical review gate.
- [ ] At least 80% of scoring and validation logic is covered by tests, or an equivalent justified measure is provided.
- [ ] Mentor can reproduce the test run from documented commands.
