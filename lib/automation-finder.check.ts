/** Self-check for the finder's maths: `pnpm --filter agent exec tsx ../lib/automation-finder.check.ts`. */
import assert from "node:assert/strict"

import {hoursSaved, scoreFinder, TASKS, verdict} from "./automation-finder"

const reporting = TASKS.find((t) => t.id === "reporting")!
// Weekly (4.3/month) × 60 min × 2 people × 0.9 rule-based = 7.74 h/month
assert.equal(hoursSaved(reporting, {taskId: "reporting", frequency: "weekly", minutes: 60, people: 2}).toFixed(2), "7.74")

const result = scoreFinder(
    ["sheets", "chat", "crm"],
    [
        {taskId: "reporting", frequency: "weekly", minutes: 60, people: 2},
        {taskId: "re-typing", frequency: "daily", minutes: 15, people: 2},
        {taskId: "invoicing", frequency: "monthly", minutes: 30, people: 1},
    ],
)
// Daily re-typing (21 × 15 × 2 × 0.95 / 60 = 9.975 h) beats weekly reporting (7.74 h).
assert.deepEqual(result.ranked.map((r) => r.task.id), ["re-typing", "reporting", "invoicing"])
assert.deepEqual(result.ranked[2].missingTools, ["invoicing", "email"], "flags tools the workflow needs that aren't in use")
assert.ok(result.hoursPerMonth > 17 && result.hoursPerMonth < 18.5)
assert.ok(result.score >= 0 && result.score <= 100)
assert.equal(scoreFinder([], []).score, 0, "empty input scores zero, not NaN")
assert.equal(verdict(80).title, "Prime for automation")
assert.equal(verdict(10).title, "Start with one workflow")
console.log("automation finder ok")
