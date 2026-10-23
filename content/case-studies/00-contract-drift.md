---
id: "contract-drift"
title: "Contract breaks fail at build time, not in production"
company: "Qfacts"
stack: ["pnpm", "Turborepo", "OpenAPI", "TypeScript", "GitHub Actions"]
---
# Contract breaks fail at build time, not in production

## Problem

The API and the web app lived in two repositories with hand-maintained API clients. A change on one side could silently break the other, and the first place anyone found out was production.

## What I did

- Proposed and led the move of both repositories into one pnpm + Turborepo TypeScript monorepo, keeping both histories.
- Replaced the hand-written clients with an SDK generated from the API's OpenAPI spec, plus a drift check in CI.
- Replaced per-app CI with path-filtered root workflows and reusable deploy workflows for staging, UAT and production.

## Outcome

- An API, app and infrastructure change now ships together in one pull request.
- Type drift between the API and the app is gone: a contract break fails the build instead of reaching users.
