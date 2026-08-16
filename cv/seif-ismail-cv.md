# Seifeldin Sabry

Software Engineer

seif-dx@proton.me · /seifeldin-sabry · /Seifeldin-Sabry · /Portfolio · +32 468 29 52 40

## Professional Experience

### Software Engineer | QFacts

July 2025 – Present

Stack: TypeScript, NestJS, React, PostgreSQL, Stripe, GCP, Pulumi

- Led the migration of qfacts-api and qfacts-app from separate repositories into a type-safe pnpm/Turborepo monorepo. Established a generated shared TypeScript SDK, shared runtime configuration, workspace-aware CI, and integrated Pulumi infrastructure, reducing cross-repository type drift and keeping API, app, and infrastructure changes aligned.
- Owned infrastructure across Cloud Run, Pub/Sub, Eventarc, Cloud SQL, GCS, and Secret Manager; introduced reproducible infrastructure-as-code deployments, failed-revision recovery, and image-layer caching to improve rollout safety and deployment reliability.
- Architected Stripe billing end to end, including self-serve signup, 7-day trials, hosted checkout, volume-tiered seat pricing, grace periods, dunning, and reactivation. Hardened provisioning with Stripe idempotency keys, organisation-scoped locks, atomic writes, duplicate reconciliation, and webhook catch-up to protect revenue flows from race conditions and duplicate subscriptions.
- Replaced inline email side effects with persistence-aware domain events across 14 business events and 24 listener flows; fixed silently dropped training emails and decoupled core product workflows from notification delivery.
- Led a cross-cutting technical-debt reduction initiative: eliminated 14 circular dependencies, removed MikroORM anti-patterns and N+1 queries, hardened tenant-scoped RBAC, and strengthened regression coverage with 460+ API integration tests and 13 Playwright suites. This reduced change risk and made future feature delivery safer across the monorepo.
- Rebuilt enterprise onboarding and learning workflows: delivered a 12-step bulk CSV import platform, removed 9,000 lines of legacy code, and shipped XState-driven E-learning with automatic grading, retake cooldowns, electronic signatures, and audit trails.

### Software Engineer | Etoile

May 2025 – April 2026

Stack: Python, PostgreSQL, Docker, GitHub Actions, TypeScript, Next.js

- Architected and delivered a production backend for an AI-native event platform, establishing modular APIs, secure authentication, and role-based access for multi-organisation workflows.
- Established CI/CD with automated testing and quality gates, turning releases into repeatable, reviewable deployments; integrated storage, notifications, and analytics services.

## Core Technologies

- **Languages:** TypeScript/JavaScript, Python, Java, SQL, Bash
- **Backend:** Node.js, NestJS, PostgreSQL, MikroORM, REST/OpenAPI, Stripe
- **Frontend:** React, Next.js, Vite, React Query, Zustand, Playwright
- **Cloud and Delivery:** GCP, Cloud Run, Cloud SQL, Pub/Sub, Eventarc, GCS, Secret Manager, Pulumi, Docker, GitHub Actions
- **Architecture:** Multi-tenancy, event-driven systems, idempotency, RBAC, state machines, CI/CD, integration testing

## Education

| Degree | Institute | Year |
| --- | --- | --- |
| B.ASc | Karel de Grote Hogeschool | 2021–2024 |
