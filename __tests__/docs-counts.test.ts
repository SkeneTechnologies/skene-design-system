/**
 * Counts typed into prose, checked against the source.
 *
 * Three numbers in this package's documentation were derived once and then
 * asserted forever: `stories/README.md` claimed 74 of 74 modules and 318
 * stories when the real figures were 81 and 379, and `docs/sections.md` claimed
 * one module without a gallery case when there were ten. Every one of them was
 * true when written. None of them had anything behind it.
 *
 * That is the same failure `scripts/check-story-coverage.mjs` exists to prevent
 * one level down, so it gets the same treatment: the number stays in the prose,
 * where it is readable, and this file is what makes it a claim rather than a
 * decoration. A doc that has drifted fails `npm test` instead of being believed.
 *
 * These read the docs by regex on purpose. A doc built from a template would
 * stop being editable prose, and the point is that someone can still write a
 * paragraph — they just cannot invent a figure inside one.
 */
import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'

const ROOT = resolve(__dirname, '..')
const read = (p: string) => readFileSync(resolve(ROOT, p), 'utf8')

/** The one figure in the doc, or a failure naming what could not be found. */
function figure(doc: string, source: string, pattern: RegExp): number {
  const m = source.match(pattern)
  expect(m, `${doc}: no sentence matching ${pattern} — the claim was reworded, not the number`).toBeTruthy()
  return Number(m![1])
}

describe('stories/README.md', () => {
  const doc = read('stories/README.md')

  /**
   * Modules held to the story ratchet — `src/sections` and `src/ui`, matching
   * TRACKED in the coverage script. `src/patterns` is deliberately out, which
   * is why this is 81 and the package has 89 modules.
   */
  const tracked = ['src/sections', 'src/ui'].flatMap((dir) =>
    readdirSync(resolve(ROOT, dir)).filter((f) => f.endsWith('.tsx') && !f.endsWith('.test.tsx')),
  )

  it('the coverage figure matches the modules on disk', () => {
    const claimed = figure('stories/README.md', doc, /\*\*(\d+) of \d+ modules have/)
    expect(claimed, 'README coverage count is stale — run npm run stories:check').toBe(tracked.length)
    // Stated as N of N; both halves have to move together or the sentence lies
    // in a way this test would otherwise wave through.
    expect(doc).toContain(`**${tracked.length} of ${tracked.length} modules have`)
  })

  it('every tracked module really does have a story, so N of N is not just arithmetic', () => {
    const missing = tracked.filter(
      (f) => !existsSync(join(ROOT, 'stories', `${f.replace(/\.tsx$/, '')}.stories.tsx`)),
    )
    expect(missing).toEqual([])
  })

  it('the render-gate figure matches the stories on disk', () => {
    const onDisk = readdirSync(resolve(ROOT, 'stories'))
      .filter((f) => f.endsWith('.stories.tsx'))
      .reduce(
        (n, f) => n + (read(`stories/${f}`).match(/^export const [A-Za-z0-9_]+: Story/gm)?.length ?? 0),
        0,
      )
    const claimed = figure('stories/README.md', doc, /loads all (\d+) stories/)
    expect(claimed, 'README story count is stale').toBe(onDisk)
  })
})

describe('docs/sections.md', () => {
  it('the no-gallery-case list matches the generated inventory', () => {
    const doc = read('docs/sections.md')
    const inventory = JSON.parse(read('docs-app/app/decisions/inventory.json')) as {
      modules: Array<{ module: string; cases: string[] }>
    }
    const uncovered = inventory.modules.filter((m) => m.cases.length === 0).map((m) => m.module)

    // The paragraph names them rather than only counting them, which is the
    // stronger form: a module that loses its last case has to be written down
    // by name before this passes again. Read from the indented block alone —
    // matching against the whole document would let a word like `code` pass on
    // any incidental mention.
    const block = doc.match(/accumulated with no case:\n\n((?: {4}.*\n)+)/)
    expect(block, 'docs/sections.md: the list of uncovered modules is gone or reindented').toBeTruthy()
    const named = new Set(block![1].split(/\s+/).filter(Boolean))

    expect(
      uncovered.filter((m) => !named.has(m)),
      'docs/sections.md does not name these modules, which have no gallery case',
    ).toEqual([])
    expect(
      [...named].filter((m) => !uncovered.includes(m)),
      'docs/sections.md names these as uncovered, but they have a gallery case now',
    ).toEqual([])

    const claimed = figure('docs/sections.md', doc, /while (\d+) modules accumulated with no case/)
    expect(claimed).toBe(uncovered.length)
  })
})
