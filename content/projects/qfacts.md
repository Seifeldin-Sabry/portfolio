---
id: "qfacts"
title: "Qfacts.be"
technologies:
  - "Next.js"
  - "NestJS"
  - "TypeScript"
  - "Google Cloud Platform"
  - "Pulumi"
  - "Stripe"
  - "AI agents"
liveDemo: "https://qfacts.be"
status: "Live"
---
# Qfacts.be

Cloud-based Electronic Quality Management System (eQMS) for pharmaceutical and biotech SMEs across Europe. GAMP 5 validated: documents, quality events, CAPA, change control and training, with affordable, transparent pricing.

## Features

- Document management with version control and approval workflows
- Quality events, investigations and CAPA
- Change control and training management with e-learning quizzes
- Role-based access control and an append-only audit trail
- "Ollie" AI agent for grounded document Q&A and drafting
- Mobile companion for floor workers

## My Contributions

- Ollie AI agent: retrieval-grounded Q&A, recurring-event similarity checks, human-reviewed revision drafts, evaluation experiments
- Marketing site and CMS: off Wix to Next.js on Cloud Run, self-hosted Strapi, technical SEO, multi-language pages
- Mobile companion: phone layouts for dashboard, documents, checklists and admin
- Stripe billing end to end: trials, tiered seat pricing, dunning, idempotent webhooks
- Monorepo + generated OpenAPI SDK, Pulumi infrastructure on GCP, observability (Sentry, Cloud Monitoring, PostHog)
- Super-admin console with signed, append-only audit trail

## Results

- API/app contract drift caught at build time instead of in production
- Marketing ships SEO content without developers
- Floor workers fill checklists from their phone instead of finding a desktop
- Safer releases: reproducible deploys and a tested point-in-time recovery playbook
