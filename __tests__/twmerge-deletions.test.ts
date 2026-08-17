/**
 * `cn` is twMerge, and twMerge DELETES classes. This finds the ones it eats.
 *
 * Tailwind's `text-lg` sets font-size AND line-height, so tailwind-merge puts
 * the two in one conflict group. A `text-*` utility appearing after a
 * `leading-*` in the same `cn()` therefore removes the leading — silently, with
 * no type error, no lint warning and no unit failure, because the class string
 * is well-formed and the component renders. Only the pixels differ.
 *
 * It shipped. `FeatureRow`'s title had its size extracted into a `TITLE_SIZE`
 * const in 0.9.20 and appended, which moved `leading-tight` in front of it and
 * dropped the leading from every row heading in the estate. The class list was
 * identical in content and wrong in sequence. Nothing caught it until the visual
 * suite diffed a heading whose two lines had spread apart, and the reason it
 * took that long is that a reviewer reading the diff sees the same classes on
 * both sides.
 *
 * Two more were found by sweeping for the shape: `LightSectionCard`'s `h2` and
 * `Bridge`'s node title, both from the squashed initial commit, so neither can
 * be attributed to a change.
 *
 * ## What this checks, and what it cannot
 *
 * It parses `cn(...)` call sites out of the source and asks tailwind-merge
 * whether any `leading-*` present in the arguments survives the merge. That is a
 * source-text check over string literals: a class assembled at runtime, or one
 * arriving through a caller's `className`, is invisible to it.
 *
 * The narrow rule it enforces is the one that has actually bitten three times:
 * put the size BEFORE the leading. It generalises — twMerge has many conflict
 * groups — and this file deliberately does not try to cover all of them, because
 * a check that reports fifty theoretical conflicts is one nobody reads.
 */

import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { resolve, join, relative } from 'node:path'
import { twMerge } from 'tailwind-merge'

const ROOT = resolve(__dirname, '..')

function sourceFiles(): { path: string; text: string }[] {
  const out: { path: string; text: string }[] = []
  const walk = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, e.name)
      if (e.isDirectory()) walk(full)
      else if (e.name.endsWith('.tsx')) out.push({ path: relative(ROOT, full), text: readFileSync(full, 'utf8') })
    }
  }
  walk(resolve(ROOT, 'src'))
  return out
}

/**
 * Every `cn(...)` argument, in source order, resolved far enough to be useful.
 *
 * Quoted strings come through as themselves. A BARE IDENTIFIER is resolved by
 * looking for string literals assigned to that name anywhere in the file, and
 * standing in for it with those — because the defect this file exists for was a
 * size held in a const:
 *
 *     const TITLE_SIZE = { row: 'text-[clamp(...)]', ... }[titleScale]
 *     cn('… leading-tight …', TITLE_SIZE)
 *
 * The first version of this check only read quoted strings, so that call site
 * offered one literal, fell under the two-argument minimum, and was skipped.
 * The guard passed on the exact regression it was written for. Found by
 * reintroducing the bug and watching it stay green, which is the only way this
 * kind of hole is ever found.
 */
function cnArgs(body: string, fileText: string): string[] {
  const out: string[] = []
  for (const raw of body.split(',')) {
    const arg = raw.trim()
    if (!arg) continue
    const lit = arg.match(/^'([^']*)'$/)
    if (lit) {
      out.push(lit[1])
      continue
    }
    const ident = arg.match(/^([A-Za-z_$][\w$]*)$/)
    if (!ident) continue
    const name = ident[1]

    // `className` is the caller's, and unknowable here. A consumer CAN pass a
    // text size that deletes a leading — that is the documented override
    // mechanism, not a defect, and flagging it would make this check noise.
    //
    // Resolving it was also the first version's other bug: matching any
    // `name =` picked up every `className={cn(...)}` attribute in the file and
    // dragged their literals in, which reported `TableCheck` and `TableDash`
    // as broken when both put their size first and are correct.
    if (name === 'className') continue

    // Only a real declaration, anchored to `const NAME =` at a line start.
    //
    // The terminator is a lookahead and carries NO `$` alternative, which is
    // the third bug this function has had. With the `m` flag `$` means end of
    // LINE, so `const TITLE_SIZE = {` captured the two characters ` {` and
    // nothing else — the object body, where every class literal lives, was cut
    // off at the newline. The check went green on the regression it was written
    // for a second time, for a different reason than the first.
    const decl = new RegExp(`^\\s*const\\s+${name}\\s*(?::[^=]*)?=([\\s\\S]{0,400}?)(?=\\n\\s*(?:const |return |function |export ))`, 'm')
    const m = fileText.match(decl)
    if (!m) continue
    for (const l of m[1].matchAll(/'([^']*)'/g)) if (/[a-z]+-/.test(l[1])) out.push(l[1])
  }
  return out
}

describe('cn is twMerge, so order decides what survives', () => {
  const files = sourceFiles()

  it('found source to check', () => {
    expect(files.length).toBeGreaterThan(10)
  })

  it('no cn() call site loses a leading-* to a later text-*', () => {
    const offenders: string[] = []

    for (const f of files) {
      // Strip comments: this file's own explanation quotes the broken order.
      const code = f.text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
      for (const m of code.matchAll(/\bcn\(([\s\S]{0,600}?)\)\s*}/g)) {
        const parts = cnArgs(m[1], code)
        if (parts.length < 2) continue
        const leadings = parts.flatMap((p) => p.match(/\bleading-\S+/g) ?? [])
        if (leadings.length === 0) continue

        const merged = twMerge(...parts)
        for (const lead of leadings) {
          if (!merged.includes(lead)) {
            const line = code.slice(0, m.index).split('\n').length
            offenders.push(`${f.path}:~${line} — twMerge deletes "${lead}"`)
          }
        }
      }
    }

    expect(
      offenders,
      `move the text-* size BEFORE the leading-* in these cn() calls:\n  ${offenders.join('\n  ')}`,
    ).toEqual([])
  })

  it('detects the defect when it is reintroduced', () => {
    // The guard proven in its failing direction, on the exact string that
    // shipped: the broken order loses the leading, the fixed order keeps it.
    const size = 'text-[clamp(1.75rem,2.4vw,2.55rem)]'
    const rest = 'mb-4 max-w-[420px] leading-tight text-chrome-text-primary'
    expect(twMerge(rest, size)).not.toContain('leading-tight')
    expect(twMerge(size, rest)).toContain('leading-tight')
  })
})
