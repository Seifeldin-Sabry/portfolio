---
order: 1
title: "Software Engineer"
company: "Qfacts"
period: "July 2025 - Present"
technologies:
  - "TypeScript"
  - "NestJS"
  - "Next.js"
  - "GCP"
  - "Pulumi"
  - "Stripe"
  - "Turborepo"
logo: "/assets/logos/qfacts_logo.jpeg"
---
# Software Engineer — Qfacts

Qfacts builds a GAMP 5 validated eQMS for pharma and biotech SMEs. Seif owns the platform end to end: the monorepo, CI/CD, GCP infrastructure as code, observability, Stripe billing and the release process — and started several of the biggest initiatives himself.

## Achievements

- Proposed and led the monorepo migration (pnpm + Turborepo): merged API and app histories, replaced hand-written clients with a generated OpenAPI SDK, so API/app contract breaks now fail at build time instead of in production
- Built Stripe billing from scratch: self-serve signup, 7-day trial, hosted checkout, volume-tiered seat pricing, dunning and reactivation, hardened with idempotency keys, org-scoped locks and webhook catch-up
- Shipped "Ollie", the in-product AI agent: retrieval-grounded document Q&A, similarity checks across quality events, human-reviewed PDF revision drafts and domain-restricted web research, backed by durable jobs, tracing and evaluation experiments
- Moved the marketing site off Wix, on his own initiative, to Next.js on Cloud Run with a self-hosted Strapi CMS, technical SEO and multi-language pages, so marketing publishes without engineers
- Built the mobile companion: phone layouts for the shell, dashboard, documents, checklists and admin, so floor workers act on records from a phone; unified list headers, filters and exports across the app
- Owned GCP infrastructure as Pulumi code (Cloud Run, Cloud SQL, Pub/Sub, Eventarc, Secret Manager, IAM) with reproducible, gated deploys and a production point-in-time recovery playbook used in a real incident
- Initiated and built the super-admin console: org and client management, data migrations, version history and recovery, with a signed, append-only audit trail enforced by a DB trigger
- Enterprise auth (BetterAuth, per-tenant Microsoft SSO with audit trail), 14 domain events / 24 listeners replacing inline email side effects, and a 12-step bulk CSV onboarding
- Led tech-debt work: removed 14 circular dependencies and ORM N+1 hot spots, hardened tenant-scoped RBAC, added Playwright E2E + integration coverage, ran the 1.4.0 RC → GA release cycle
