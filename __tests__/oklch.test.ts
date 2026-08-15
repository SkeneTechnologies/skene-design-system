/**
 * The oklch parser in the contrast gate.
 *
 * Every shadcn slot is authored in oklch, so before this parser existed the
 * gate walked straight past 39 tokens and reported them as "non-hex value" —
 * blindness that read as a skipped check. That is how a near-white
 * `--sidebar-primary-foreground` came to sit on a peach `--sidebar-primary` at
 * 1.55:1 with a green build.
 *
 * A colour-space conversion is exactly the kind of code that is plausible and
 * wrong, so the expected values here are not derived from the same maths. They
 * were measured out of Chrome, by assigning each string to a canvas fillStyle
 * and reading the pixel back. If someone rewrites the matrices, this notices.
 */

import { describe, it, expect } from 'vitest'
import { parseOklch, parseColor } from '../scripts/check-token-contrast'

const hex = (rgb: [number, number, number] | null) =>
  rgb ? '#' + rgb.map((c) => c.toString(16).padStart(2, '0')).join('') : null

describe('parseOklch matches the browser', () => {
  it.each([
    ['oklch(1 0 0)', '#ffffff'],
    ['oklch(0 0 0)', '#000000'],
    // Tailwind v4 neutral-50 / neutral-800 / neutral-900.
    ['oklch(0.985 0 0)', '#fafafa'],
    ['oklch(0.269 0 0)', '#262626'],
    ['oklch(0.205 0 0)', '#171717'],
    // Tailwind v4 red-600, shadcn's light --destructive.
    ['oklch(0.577 0.245 27.325)', '#e7000b'],
    // shadcn's dark --destructive. Light enough that white on it is 2.89:1.
    ['oklch(0.704 0.191 22.216)', '#ff6467'],
    // shadcn's stock --sidebar-primary in dark: the default blue this system
    // replaced with brand peach.
    ['oklch(0.488 0.243 264.376)', '#1447e6'],
  ])('%s -> %s', (input, expected) => {
    expect(hex(parseOklch(input))).toBe(expected)
  })

  it('rejects anything that is not oklch', () => {
    expect(parseOklch('#fec089')).toBeNull()
    expect(parseOklch('rgb(1, 2, 3)')).toBeNull()
    expect(parseOklch('oklch()')).toBeNull()
  })

  it('drops alpha rather than failing, matching parseHex', () => {
    expect(hex(parseOklch('oklch(1 0 0 / 50%)'))).toBe('#ffffff')
  })

  it('clamps out-of-gamut results instead of emitting negative channels', () => {
    const rgb = parseOklch('oklch(0.5 0.4 150)')
    expect(rgb).not.toBeNull()
    for (const c of rgb!) {
      expect(c).toBeGreaterThanOrEqual(0)
      expect(c).toBeLessThanOrEqual(255)
    }
  })
})

describe('parseColor accepts both syntaxes the token file uses', () => {
  it('still parses hex', () => {
    expect(hex(parseColor('#fec089'))).toBe('#fec089')
  })

  it('falls through to oklch', () => {
    expect(hex(parseColor('oklch(0.985 0 0)'))).toBe('#fafafa')
  })

  it('returns null for a syntax nothing in the token file uses', () => {
    expect(parseColor('hsl(30 100% 50%)')).toBeNull()
  })
})
