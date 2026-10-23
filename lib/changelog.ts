import {execSync} from "child_process"
import type {ChangelogEntry} from "./content-types"

const LIMIT = 40
const CONVENTIONAL = /^(\w+)(?:\([^)]*\))?!?:\s*(.+)$/

/**
 * Recent commits, read from git at build time: proof the site ships
 * continuously. Merge commits are skipped (the squashed subjects say more).
 * Returns [] when git history isn't available (e.g. a shallow checkout).
 */
export function getChangelog(): ChangelogEntry[] {
    try {
        const log = execSync(`git log --no-merges -n ${LIMIT} --date=short --pretty=format:%h%x09%ad%x09%s`, {encoding: "utf8"})
        return log
            .split("\n")
            .filter(Boolean)
            .map((line) => {
                const [sha, date, subject] = line.split("\t")
                const match = subject.match(CONVENTIONAL)
                return {sha, date, type: match?.[1] ?? "chore", summary: match?.[2] ?? subject}
            })
    } catch {
        return []
    }
}
