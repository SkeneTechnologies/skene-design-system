#!/usr/bin/env node
/**
 * Story coverage, as a ratchet rather than a gate.
 *
 * ## Why this is not "every component must have a story, full stop"
 *
 * There are 44 sections and 30 UI components in this package and, on the day
 * this landed, twelve of them had stories. A rule that fails the build on
 * sixty-two files does not get those files written; it gets the rule deleted,
 * or `--max-warnings` raised, or the job marked `continue-on-error`. That is
 * the observed fate of every all-at-once lint rule introduced against a large
 * existing surface.
 *
 * So the rule this enforces is the one that can actually hold:
 *
 * - A component NOT in `stories/BACKLOG.json` must have a story. That makes it
 *   impossible to add a new component without one, which is the case that
 *   matters, because a new component is exactly when the cost of writing the
 *   story is lowest.
 * - The backlog may only SHRINK. If a file in it gains a story, the check
 *   fails until the entry is removed. That stops the list decaying into a
 *   permanent exemption.
 * - A backlog entry naming a component that no longer exists also fails, so a
 *   deletion cannot leave the list stale.
 *
 * `npm run stories:check -- --write` rewrites the backlog to the current state.
 * That is for the shrink case; it will refuse to ADD entries, because a script
 * that can quietly widen its own exemption list is not a ratchet.
 *
 * ## What counts as a story
 *
 * `stories/<kebab-name>.stories.tsx`, matched by file name against the
 * component module's own file name. One story file may cover several exported
 * components from the same module — `PlanCard` and `PlanGrid` ship together and
 * are one file — which is why the unit is the module, not the export.
 */

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const BACKLOG = join(ROOT, 'stories', 'BACKLOG.json')

/** Directories held to the rule, and the reason each one is in or out. */
const TRACKED = [
  // The marketing sections. This is the surface a page composes from and the
  // surface where a composition defect has actually shipped.
  'src/sections',
  // The primitives. Fewer states each, but they are the ones every section
  // inherits, so a regression here is a regression everywhere at once.
  'src/ui',
]

// `src/patterns` is deliberately absent: it is helper composition over the two
// directories above, and holding it to the same rule would mean stories that
// re-render a section's story with different words.

const write = process.argv.includes('--write')

function modules() {
  const out = []
  for (const dir of TRACKED) {
    const abs = join(ROOT, dir)
    if (!existsSync(abs)) continue
    for (const f of readdirSync(abs)) {
      if (!f.endsWith('.tsx') || f.endsWith('.test.tsx')) continue
      out.push(`${dir}/${f}`)
    }
  }
  return out.sort()
}

function hasStory(modulePath) {
  const base = modulePath.split('/').pop().replace(/\.tsx$/, '')
  return existsSync(join(ROOT, 'stories', `${base}.stories.tsx`))
}

const all = modules()
const covered = all.filter(hasStory)
const uncovered = all.filter((m) => !hasStory(m))

const backlog = existsSync(BACKLOG) ? JSON.parse(readFileSync(BACKLOG, 'utf8')) : { modules: [] }
const listed = new Set(backlog.modules)

if (write) {
  const added = uncovered.filter((m) => !listed.has(m))
  if (added.length) {
    console.error(
      `refusing to widen the backlog. These have no story and are not listed:\n  ${added.join('\n  ')}\n` +
        `Write the story, or add the entry by hand with a reason in the commit message.`,
    )
    process.exit(1)
  }
  const next = { ...backlog, modules: uncovered }
  writeFileSync(BACKLOG, `${JSON.stringify(next, null, 2)}\n`)
  console.log(`backlog rewritten: ${listed.size} -> ${uncovered.length}`)
  process.exit(0)
}

const failures = []

for (const m of uncovered) {
  if (!listed.has(m)) failures.push(`no story, and not in the backlog: ${m}`)
}

for (const m of backlog.modules) {
  if (!all.includes(m)) failures.push(`backlog names a module that no longer exists: ${m}`)
  else if (hasStory(m)) failures.push(`has a story but is still in the backlog: ${m} (run with --write)`)
}

const pct = all.length ? Math.round((covered.length / all.length) * 100) : 100
console.log(`stories: ${covered.length}/${all.length} modules (${pct}%), ${backlog.modules.length} in backlog`)

if (failures.length) {
  console.error(`\n${failures.length} problem(s):`)
  for (const f of failures) console.error(`  ${f}`)
  process.exit(1)
}
