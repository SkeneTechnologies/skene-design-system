/**
 * Pairing tests — the couplings that live in two repos at once.
 *
 * Two things about this package are agreed with the prototype site kept
 * outside this repository, and nothing has been checking either of them:
 *
 *   1. WHICH TEXTURE goes behind WHICH kind of artifact. Both sides encode the
 *      same three pairings, in different files, by hand.
 *   2. The prototype's `tokens.css` is a HAND TRANSCRIPTION of this package's
 *      emission, pinned to a commit. Its own header says so, and says it will
 *      need a second pass when the pending token work lands. That work landed.
 *
 * The prototype is a separate checkout, not a dependency, and it lives outside
 * this repository. Point SKENE_PROTO_ROOT at it to run these tests. Without it
 * they skip — a fresh clone of this package alone must still be green — and
 * when it is present they fail loudly if the two have drifted.
 *
 * Every file read is INSIDE an `it`, deliberately. `describe.skipIf` still runs
 * the describe callback to collect tests; it only skips executing them. A
 * `readFileSync` at describe-body level therefore fires even when the suite is
 * "skipped", which is how the first version of this file passed on a laptop with
 * the prototype checked out and crashed CI with ENOENT on the very first run.
 * The skip is real only if nothing outside a test touches the filesystem.
 */

import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(__dirname, '..')
// No default: the prototype's location is supplied, never guessed from a
// home directory. Absent the variable these tests skip, which is what keeps a
// fresh clone of this package green on its own.
const PROTO = process.env.SKENE_PROTO_ROOT ?? ''
const hasProto = PROTO !== '' && existsSync(resolve(PROTO, 'artifacts.css'))

/** Every `--name: value` in a file, first declaration wins. */
function customProps(path: string): Map<string, string> {
  const css = readFileSync(path, 'utf8')
  const out = new Map<string, string>()
  for (const m of css.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
    if (!out.has(m[1])) out.set(m[1], m[2].trim())
  }
  return out
}

const norm = (v: string) => v.toLowerCase().replace(/\s+/g, '')

describe.skipIf(!hasProto)('texture pairing agrees with the prototype', () => {
  // Parsed out of the component, NOT restated here. A hardcoded copy would
  // agree with itself forever: change SectionBackdrop and the test would keep
  // passing while the two repos silently diverged, which is the exact failure
  // this file exists to catch.
  const ours = () =>
    Object.fromEntries(
      [
        ...readFileSync(resolve(ROOT, 'src/sections/section-backdrop.tsx'), 'utf8').matchAll(
          /(\w+):\s*new URL\('\.\.\/\.\.\/assets\/(card\d_bg)\.webp'/g,
        ),
      ].map((m) => [m[1], m[2]]),
    ) as Record<string, string>

  it('parsed the pairing out of SectionBackdrop', () => {
    expect(Object.keys(ours()).sort()).toEqual(['github', 'journey', 'schema'])
  })
  /** prototype class -> the concept it means, from artifacts.css comments */
  const THEIRS_CLASS: Record<string, keyof typeof OURS> = {
    jr: 'journey',
    gh: 'github',
    db: 'schema',
  }

  it.each(Object.entries(THEIRS_CLASS))(
    '.artframe--%s uses the same texture this package pairs with "%s"',
    (cls, concept) => {
      const artifacts = readFileSync(resolve(PROTO, 'artifacts.css'), 'utf8')
      const OURS = ours()
      const m = new RegExp(
        `\\.artframe--${cls}\\s*\\{[^}]*url\\(["']?img/(card\\d_bg)\\.webp`,
      ).exec(artifacts)
      expect(m, `.artframe--${cls} not found in the prototype's artifacts.css`).not.toBeNull()
      expect(
        m![1],
        `The prototype puts ${m![1]} behind .artframe--${cls}, this package puts ` +
          `${OURS[concept]} behind "${concept}". One of them moved. The pairing is ` +
          `deliberate — the same backdrop sits behind the same kind of artifact on ` +
          `both surfaces — so a divergence here is a real inconsistency, not a detail.`,
      ).toBe(OURS[concept])
    },
  )

  it('ships the textures the pairing names', () => {
    for (const file of Object.values(ours())) {
      expect(
        existsSync(resolve(ROOT, `assets/${file}.webp`)),
        `assets/${file}.webp is named by the pairing but does not ship`,
      ).toBe(true)
    }
  })
})

/**
 * Tokens the prototype transcribed before this package changed them.
 *
 * Recorded rather than hidden, in the same shape as KNOWN_GAPS in
 * check-token-contrast.ts, and for the same reason: a permanently red gate
 * teaches everyone to ignore it, while an exhaustive list means a NEW drift is
 * not on it and still fails.
 *
 * Every entry here is the prototype being stale, not this package being wrong.
 * They are the dashboard-canonical arbitration (207d8bc) and the light-mode
 * brand palette (28e1a50) — landed after the prototype pinned commit 229fbee at
 * design-tokens 2.3.0. The prototype's own header predicted all of them and said
 * the file would need a second pass. Delete entries as that pass lands; when the
 * set is empty, delete the mechanism.
 */
const KNOWN_DRIFT = new Set([
  'destructive', // arbitration: adopted the dashboard's single invariant value
  'primary-hover', // arbitration: #fdd4aa -> the dashboard's #ebdccf
  'sidebar-primary', // arbitration: shadcn blue -> brand peach
  'sidebar-primary-foreground', // follows sidebar-primary
  'warning', // arbitration
  'radius-lg', // prototype keeps a calc() ladder; package emits literals
  'radius-xl',
])

describe.skipIf(!hasProto)('the prototype transcription has not drifted further', () => {
  const read = () => {
    const theirs = customProps(resolve(PROTO, 'tokens.css'))
    const mine = customProps(resolve(ROOT, 'styles/tokens.css'))
    return { theirs, mine, shared: [...theirs.keys()].filter((k) => mine.has(k)) }
  }

  it('has a meaningful overlap to check', () => {
    const { shared } = read()
    // If this collapses, the transcription was restructured and these tests are
    // measuring nothing — which is worse than failing.
    expect(shared.length).toBeGreaterThan(150)
  })

  it('agrees on every shared token except the recorded ones', () => {
    const { theirs, mine, shared } = read()
    const drifted = shared.filter((k) => norm(theirs.get(k)!) !== norm(mine.get(k)!))
    const unexpected = drifted.filter((k) => !KNOWN_DRIFT.has(k))
    expect(
      unexpected.map((k) => `--${k}: prototype=${theirs.get(k)} package=${mine.get(k)}`),
      'A token drifted that is not in KNOWN_DRIFT. Either this package changed a ' +
        'value the prototype transcribed, or the prototype edited one by hand. ' +
        'The package is the SSOT: fix the prototype, or add an entry here saying why not.',
    ).toEqual([])
  })

  it('does not keep stale entries in KNOWN_DRIFT', () => {
    const { theirs, mine, shared } = read()
    // The counterpart guard: once the prototype re-transcribes a token, its
    // entry has to go, or the list silently stops meaning anything.
    const stillDrifted = new Set(
      shared.filter((k) => norm(theirs.get(k)!) !== norm(mine.get(k)!)),
    )
    const resolved = [...KNOWN_DRIFT].filter((k) => shared.includes(k) && !stillDrifted.has(k))
    expect(
      resolved,
      'These tokens now agree, so their KNOWN_DRIFT entries are obsolete. Remove them.',
    ).toEqual([])
  })
})

describe('pairing tests are wired correctly', () => {
  it('reports whether the prototype was found', () => {
    // Not an assertion about the prototype — an assertion that this file knows
    // which mode it ran in, so a silent skip cannot be mistaken for a pass.
    expect(typeof hasProto).toBe('boolean')
    if (!hasProto) {
      console.warn(
        `[pairing] prototype not found${PROTO ? ` at ${PROTO}` : ''} — ` +
          `cross-repo checks skipped. Set SKENE_PROTO_ROOT to enable them.`,
      )
    }
  })
})
