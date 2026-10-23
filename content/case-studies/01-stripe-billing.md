---
id: "stripe-billing"
title: "Self-serve billing with no duplicate charges"
company: "Qfacts"
stack: ["Stripe", "NestJS", "PostgreSQL", "Webhooks"]
---
# Self-serve billing with no duplicate charges

## Problem

Every new customer went through sales by hand. The product needed self-serve signup and payment, in a regulated product where billing mistakes cost trust.

## What I did

- Designed and built Stripe billing from scratch: self-serve signup, trials, hosted checkout, volume-tiered seat pricing, grace periods, dunning and reactivation.
- Protected it against the classic failures: idempotency keys on every create, organisation-scoped locks, duplicate reconciliation and webhook catch-up.

## Outcome

- Customers sign up and pay without any sales involvement.
- No duplicate charges, even under retries, double-clicks and redelivered webhooks.
