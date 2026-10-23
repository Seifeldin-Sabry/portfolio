# Launch kit

Drafts for launching the site. Nothing here is posted automatically; edit and post yourself.
Every link below has a deep link + its own preview card (check them in
LinkedIn's Post Inspector first: https://www.linkedin.com/post-inspector/).

## Show HN

**Title:** Show HN: My portfolio is a desktop OS with an AI assistant that writes its own tests

**Body:**
I rebuilt my portfolio as a small desktop: draggable windows, a dock, a terminal,
Minesweeper. The part I'm proudest of is the assistant: a RAG agent with guardrails,
and an eval suite that grows itself in CI (it paraphrases its own failures, writes
questions about content I change, red-teams itself, and only keeps cases that pass
twice).

That suite caught my guardrails failing *open*: when the free-tier model hit its daily
quota, the injection detector logged "allowing content" and switched itself off. Write-up:
https://seif-dx.com/blog/self-improving-evals

Site: https://seif-dx.com · Lab (live eval scores): https://seif-dx.com/apps/lab

## LinkedIn

My portfolio's AI assistant writes its own tests. Last week they caught a security bug.

When the model behind my prompt-injection guard ran out of daily quota, the guard didn't
fail. It logged "allowing content" and quietly switched itself off. To a visitor that
looks exactly like everything working.

The fix:
→ guardrails that fail closed
→ one model per job, so one can't starve another
→ a live smoke test that gates every deploy (it caught a broken model on day one)

The whole system is on my site. Try to break the assistant:
https://seif-dx.com/apps/lab

If you're building an assistant over your own docs and want it done with this level of
care, I'm taking one project this quarter.

## X / Bluesky thread

1/ My portfolio's AI assistant writes its own test cases. They caught my guardrails failing OPEN. 🧵
2/ Three eval categories: knowledge (LLM-judged), guardrails (deterministic), agentic tool use (deterministic). Judges never decide safety.
3/ Weekly growth loop: paraphrase failures, generate questions from changed content (anchors verified verbatim), red-team. Keep only cases that pass twice.
4/ The bug: shared free-tier quota ran out → injection detector logged "allowing content". Silent.
5/ Fix: fail-closed guard, one model per job, live smoke test gating deploys. Write-up → https://seif-dx.com/blog/self-improving-evals

## r/webdev (Showoff Saturday)

**Title:** I rebuilt my portfolio as a macOS-style desktop (Next.js, static export, framer-motion)

Mention the engineering, since that's what the sub upvotes: transform-only window drags (no
layout per frame), memoized window manager, every app deep-linkable at /apps/<id> with
build-time OG cards. Link: https://seif-dx.com

## Where each audience should land

| Audience | Link |
|---|---|
| MSSP founders (SDX outbound) | https://seif-dx.com/apps/tools |
| Freelance clients | https://seif-dx.com/apps/services |
| Engineers / HN | https://seif-dx.com/apps/lab |
| Recruiters | https://seif-dx.com/apps/experience |
