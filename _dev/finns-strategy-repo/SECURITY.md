# Security Policy

## Reporting a Vulnerability

Please email **lakin.finn@gmail.com** privately. Do not open a public issue for security-related disclosures. Expected response time: 5 business days.

## Scope

This framework is **paper-trading only**. It is hard-wired to refuse any non-paper Alpaca endpoint. The most material security concerns are therefore:

1. **API-key leakage** — keys read only from environment, never logged
2. **Prompt injection** through news feeds — sanitised before reaching Claude
3. **Dependency supply chain** — pinned versions in `requirements.txt`, dependabot enabled
4. **Configuration tampering** — environment loaded once at start; no live reload

## What is NOT in scope

- Performance discussions (no risk to anyone but the user's paper account)
- Backtesting methodology disputes — open an issue
