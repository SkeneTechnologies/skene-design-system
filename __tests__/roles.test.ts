/**
 * The two-role invariant.
 *
 * `chrome.*` is fixed dark chrome; `surface.*` / `text.*` are theme-aware. They
 * exist separately because the two consuming apps meant different things by one
 * set of names, and collapsing them again — in either direction — silently
 * breaks one of them:
 *
 *   make chrome mode-aware   -> the dashboard's dark panels turn light on its
 *                               default (light) theme, and 8 fg/bg pairs drop
 *                               below the WCAG floor
 *   make surface invariant   -> the marketing site loses light mode entirely
 *
 * Neither failure raises an error anywhere. These tests are the only thing that
 * notices.
 */

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(__dirname, '..')
const json = JSON.parse(readFileSync(resolve(ROOT, 'design-tokens.json'), 'utf8'))
const css = readFileSync(resolve(ROOT, 'styles/tokens.css'), 'utf8')

const block = (start: string, end: string) => {
  const a = css.indexOf(start)
  const b = css.indexOf(end)
  expect(a, `missing marker ${start}`).toBeGreaterThan(-1)
  expect(b, `missing marker ${end}`).toBeGreaterThan(a)
  return css.slice(a, b)
}

const lightBlock = block('/* @generated:tokens-light-start */', '/* @generated:tokens-light-end */')
const darkBlock = block('/* @generated:tokens-dark-start */', '/* @generated:tokens-dark-end */')

describe('chrome.* is fixed', () => {
  const chrome = json.color.chrome as Record<string, Record<string, { $value?: string; $modes?: unknown }>>

  it('exists with both sub-groups', () => {
    expect(Object.keys(chrome.surface).length).toBeGreaterThan(5)
    expect(Object.keys(chrome.text).length).toBeGreaterThan(3)
  })

  it('declares no mode-aware token', () => {
    const offenders: string[] = []
    for (const [group, tokens] of Object.entries(chrome)) {
      for (const [name, leaf] of Object.entries(tokens)) {
        if (leaf.$modes) offenders.push(`chrome.${group}.${name}`)
      }
    }
    expect(
      offenders,
      'chrome is "always dark regardless of theme". A mode map here flips the ' +
        'dashboard\'s panels light on its default theme.',
    ).toEqual([])
  })

  it('never appears in the light or dark override blocks', () => {
    expect(lightBlock).not.toContain('--color-chrome-')
    expect(darkBlock).not.toContain('--color-chrome-')
  })
})

describe('accent.* is fixed', () => {
  // A third role, added with the marketing sections: colours that carry neither
  // brand nor status meaning and exist only to tell three feature rows apart.
  //
  // It is invariant for the same reason chrome.* is — these were drawn against
  // dark surfaces and have no designed light value. The difference is that
  // accent.* sits under `color` as a sibling of `brand`, so the chrome.* suite
  // above does not reach it, and nothing else would notice a `$modes` map
  // appearing here.
  const accent = json.color.accent as Record<string, { $value?: string; $modes?: unknown }>

  it('exists', () => {
    expect(Object.keys(accent).length).toBeGreaterThan(0)
  })

  it('declares no mode-aware token', () => {
    const offenders = Object.entries(accent)
      .filter(([, leaf]) => leaf.$modes)
      .map(([name]) => `accent.${name}`)
    expect(
      offenders,
      'accent.* has no designed light variant. Adding a mode map here claims one ' +
        'exists — design the value first, then move it to the theme-aware ladder.',
    ).toEqual([])
  })

  it('never appears in the light or dark override blocks', () => {
    expect(lightBlock).not.toContain('--color-accent-')
    expect(darkBlock).not.toContain('--color-accent-')
  })
})

describe('the marketing radius rungs exist above the dashboard ladder', () => {
  // The dashboard ladder stops at xl (12px) because it was drawn for dense
  // chrome. Marketing cards are 16px and 24px and had been hardcoding both.
  // If these are ever removed or pulled below xl, every section component
  // silently flattens.
  const radius = json.radius as Record<string, { $value: string }>
  const px = (k: string) => parseFloat(radius[k].$value)

  it('2xl and 3xl are present and ordered above xl', () => {
    expect(px('2xl')).toBeGreaterThan(px('xl'))
    expect(px('3xl')).toBeGreaterThan(px('2xl'))
  })
})

describe('surface.* and text.* are theme-aware', () => {
  const themed = {
    surface: json.color.surface as Record<string, { $modes?: Record<string, string> }>,
    text: json.color.text as Record<string, { $modes?: Record<string, string> }>,
  }

  it('declares mode maps', () => {
    const modeAware = Object.values(themed).flatMap((g) =>
      Object.values(g).filter((leaf) => leaf.$modes),
    )
    expect(modeAware.length).toBeGreaterThan(10)
  })

  it('emits every mode-aware token into both blocks', () => {
    for (const [group, tokens] of Object.entries(themed)) {
      for (const [name, leaf] of Object.entries(tokens)) {
        if (!leaf.$modes) continue
        const cssName = `--color-${group}-${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([a-zA-Z]{2,})(\d)/g, '$1-$2').toLowerCase()}`
        expect(lightBlock, `${cssName} missing from the light block`).toContain(`${cssName}:`)
        expect(darkBlock, `${cssName} missing from the dark block`).toContain(`${cssName}:`)
      }
    }
  })

  it('shares its dark values with chrome, which is why the ambiguity survived', () => {
    // The two roles are identical in dark and only diverge in light. If this
    // ever stops being true, the split has drifted into two palettes.
    for (const [name, leaf] of Object.entries(themed.surface)) {
      if (!leaf.$modes) continue
      const chromeLeaf = (json.color.chrome.surface as Record<string, { $value: string }>)[name]
      if (!chromeLeaf) continue
      expect(leaf.$modes.dark, `surface.${name} dark drifted from chrome.surface.${name}`).toBe(
        chromeLeaf.$value,
      )
    }
  })
})

describe('the brand palette is usable on the light ladder', () => {
  // This block used to assert the opposite: that peach FAILED on light, with a
  // comment saying it would "fail loudly the day someone adds light-mode
  // variants". That is what happened, and the failure was the signal working.
  //
  // The light values are DERIVED, not designed — each is the least-darkened
  // hue-preserving value clearing 4.5:1, recorded in the $description on each
  // token. These assertions are the floor a designed replacement must also
  // clear, so swapping in a prettier colour that fails will be caught here.
  const hex = (h: string) => {
    const s = h.replace('#', '')
    return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16) / 255)
  }
  const lum = (h: string) => {
    const [r, g, b] = hex(h).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const ratio = (a: string, b: string) =>
    (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05)

  const lightOf = (path: string[]) => {
    let node: Record<string, never> = json.color
    for (const k of path) node = node[k]
    const leaf = node as unknown as { $modes?: Record<string, string>; $value?: string }
    return leaf.$modes?.light ?? leaf.$value
  }

  const surface1 = lightOf(['surface', '1'])!

  it.each([
    ['brand.peach', ['brand', 'peach']],
    ['semantic.matcha', ['semantic', 'matcha']],
    ['semantic.warningAmber', ['semantic', 'warningAmber']],
    ['semantic.errorRed', ['semantic', 'errorRed']],
  ])('%s clears 4.5:1 on the light surface ladder', (_name, path) => {
    const fg = lightOf(path as string[])!
    expect(ratio(fg, surface1)).toBeGreaterThanOrEqual(4.5)
  })

  it('peachText inverts with peach so a pill stays legible', () => {
    // peach itself is mode-aware now, so text sitting ON it has to invert too.
    // Dark text on the darker light-mode peach was 2.88:1.
    const fg = lightOf(['brand', 'peachText'])!
    const bg = lightOf(['brand', 'peach'])!
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(4.5)
  })
})
