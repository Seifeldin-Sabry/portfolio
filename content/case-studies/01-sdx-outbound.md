---
id: "sdx-outbound"
title: "An outbound agency run as code: one playbook, any B2B niche"
company: "SDX Studio"
pillar: "gtm"
featured: true
period: "March 2026 – present"
summary: "SDX Studio is my GTM engineering agency. Its outbound engine finds buyers from signals, writes with AI, sends with human approval, and points at a new niche by changing a config, not the machine."
link: "https://sdxstudio.co"
stack: ["Claude Code", "Apify", "Hunter", "Smartlead", "HeyReach", "Attio", "Exa"]
---
# An outbound agency run as code: one playbook, any B2B niche

## Problem

Most outbound is a list bought once, a template blasted to it, and a reply rate nobody can explain. It does not compound: every new campaign starts from zero, and nothing is learned about which signals actually predict a reply.

## What I did

- Founded SDX Studio, a done-for-you outbound agency. The first niche is MSSPs (managed security service providers): 6 qualified meetings with security buyers in 90 days, or SDX keeps working for free until they are held.
- Built the engine as versioned playbooks and custom skills in Claude Code: ICP, signals, sourcing, enrichment, copy and sending are each a step with a runbook.
- Sourcing from signals, not static lists: job posts, hiring spikes and funding from scrapers and data APIs (Apify, job boards, Google Maps, Exa), with verified emails from Hunter and deduplication across runs.
- AI writes the first draft of every message from the signal that triggered it; a human approves before anything is sent.
- Multichannel delivery: cold email through Smartlead and LinkedIn through HeyReach, with replies tracked in Attio.
- Made the niche a parameter: the same pipeline has been pointed at security buyers, at decision makers in SaaS, and at local businesses with website gaps.

## Outcome

- One playbook, reused per niche: a new market starts from a working system instead of a blank sheet.
- Cheap to run: one signal-based run that found 32 decision makers at SaaS companies and drafted a personal email to each cost about $5.60 in data.
- Another run built and audited a list of 805 local businesses in three cities for under $1 of data credits.

## Numbers

- 3 | niches run through the same pipeline | security buyers, SaaS teams, local businesses
- 32 | decision makers found and drafted in one run | about $5.60 of data
- 805 | local businesses sourced and audited in one run | under $1 of data
- 0 | messages sent without human approval | by design
