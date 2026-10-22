# Seifeldin Sabry — CV

Senior Software Engineer | TypeScript, Platform & DevOps (GCP, Pulumi)
Belgium · seif-dx@proton.me · linkedin.com/in/seifeldin-sabry · github.com/Seifeldin-Sabry

## Summary

TypeScript engineer who owns production systems end to end: NestJS and Node.js backends, React frontends, infrastructure as code with Pulumi on Google Cloud, CI/CD and releases. At QFacts, a multi-tenant SaaS for regulated quality management, Seif is the main engineer on the platform. He led the move to a TypeScript monorepo, built Stripe billing from scratch, and proposed and shipped the super-admin console and the company's new marketing site and CMS.

## Experience

### QFacts — Software Engineer, Platform & Infrastructure Owner (Jul 2025 – Present, Belgium)

- Became the go-to owner of the whole platform (API, web app, infrastructure and marketing site) by taking features from architecture and design through delivery, releases and production support.
- Ended type drift between API, app and infrastructure, so a contract change now ships in one pull request, by leading the move from two repositories to a pnpm/Turborepo TypeScript monorepo with an OpenAPI-generated SDK, drift checks in CI and path-filtered GitHub Actions.
- Made deploys reproducible and recoverable across staging, UAT and production by owning GCP infrastructure as code in Pulumi (Cloud Run, Cloud SQL, Pub/Sub, Eventarc, Cloud Storage, Secret Manager, IAM), with failed-revision recovery, image-layer caching and gated releases.
- Let customers sign up and pay without sales involvement, with no duplicate charges, by building Stripe billing from scratch: self-serve signup, trials, hosted checkout, volume-tiered seat pricing, dunning and reactivation, protected by idempotency keys, organisation-scoped locks and webhook reconciliation.
- Removed manual database work from client onboarding and support by proposing and building a super-admin console for organisations, data migrations, version recovery, signed operations and background jobs, all recorded in an append-only audit trail.
- Let marketing publish without engineers and gave the company ownership of its site by moving it off Wix, on his own initiative, to Next.js on Cloud Run with a self-hosted Strapi CMS, technical SEO, multi-language pages and PostHog analytics.
- Restored production data during a real incident by setting up structured logging, Sentry, Cloud Monitoring alerts as code and a point-in-time recovery runbook.
- Stopped emails being dropped silently and met enterprise security needs by replacing inline side effects with domain events and listeners, and by adding Microsoft SSO for each tenant and a database-enforced append-only audit log.
- Made the codebase safer and faster to change by removing circular dependencies and N+1 queries, hardening tenant-scoped RBAC, building integration and Playwright E2E coverage, and replacing legacy onboarding with a 12-step bulk import.
- Cut time spent searching and drafting, and helped auditors and workers spot recurring issues early, by delivering an AI assistant with RAG over each customer's documents, brainstorming and similarity checks across quality events, with human review and evaluation experiments.
- Made the product easier to learn and usable on the shop floor by leading the UI modernisation and mobile companion: one list, filter and export pattern on every page, clearer detail pages and phone layouts.
- Shipped 1.4.0 to production safely by running the release-candidate and UAT hotfix cycle.

### Etoile — Software Engineer, concurrent role (May 2025 – Apr 2026, Remote)

- Took an AI-native event platform to production by designing and building its backend: modular APIs, secure authentication and role-based access for multiple organisations, with storage, notifications and analytics integrated.
- Made releases repeatable and reviewable by setting up CI/CD from scratch with automated tests and quality gates.

## Technical Skills

- Languages: TypeScript, JavaScript, Python, SQL, Bash, Java
- Backend: Node.js, NestJS, Express, REST, OpenAPI, PostgreSQL, MikroORM, Kysely, Stripe, XState
- Frontend: React, Next.js, Vite, React Query, Zustand, Tailwind CSS, Playwright, Vitest
- Cloud & DevOps: Google Cloud Platform (GCP), Cloud Run, Cloud SQL, Pub/Sub, Eventarc, IAM, Pulumi, Infrastructure as Code, Docker, GitHub Actions, CI/CD, Turborepo, pnpm
- Observability: Sentry, Cloud Monitoring, structured logging, PostHog
- Architecture: Multi-tenant SaaS, event-driven systems, idempotency, RBAC, SSO/OAuth, monorepos, Strapi CMS, SEO

## Education

### Karel de Grote Hogeschool — Bachelor of Applied Computer Science (2021 – 2024, Antwerp, Belgium)
