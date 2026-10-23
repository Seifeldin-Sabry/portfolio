---
id: "incident-recovery"
title: "Restoring production data during a live incident"
company: "Qfacts"
stack: ["Cloud SQL", "Pulumi", "Sentry", "Cloud Monitoring"]
---
# Restoring production data during a live incident

## Problem

When production data is lost, the clock starts immediately. Without observability and a rehearsed recovery path, you're debugging and restoring at the same time, under pressure.

## What I did

- Set up structured logging, Sentry, and Cloud Monitoring dashboards and alerts, all written as Pulumi code.
- Wrote and documented a point-in-time recovery runbook: clone the database to a point in time, diff the affected ids, restore only the missing rows.

## Outcome

- Used the runbook in a real incident and restored the production data.
- Recovery became a documented procedure instead of improvisation.
