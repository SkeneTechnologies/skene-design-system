import { readFileSync } from 'node:fs'

import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { FeatureRow } from '../src/sections/feature-row.js'

/**
 * `titleAs` and `eyebrow` exist because the second adopter is shaped differently
 * from the first.
 *
 * The homepage renders three rows under one band `<h2>`, so an `<h3>` title and
 * no per-row eyebrow are right. skene-site's subpages render ONE row as the
 * whole section: its title is that section's `<h2>` under the page `<h1>`, and
 * its eyebrow labels that heading and belongs beside it rather than above the
 * card. Left alone, adopting this component on a subpage would silently demote
 * every section heading on nine routes — a change nothing on screen shows and
 * every outline reader sees.
 */

const row = (props = {}) =>
  renderToStaticMarkup(<FeatureRow title="Catch it before it ships." visual={<i />} {...props} />)

const bare = (props = {}) => renderToStaticMarkup(<FeatureRow visual={<i />} {...props} />)

describe('FeatureRow title level', () => {
  it('is h3 by default, so no existing caller moves', () => {
    expect(row()).toContain('<h3')
    expect(row()).not.toContain('<h2')
  })

  it('is h2 on request', () => {
    const html = row({ titleAs: 'h2' })
    expect(html).toContain('<h2')
    expect(html).not.toContain('<h3')
  })

  it('keeps the same classes at either level', () => {
    const cls = /<h[23] class="([^"]+)"/
    expect(row().match(cls)?.[1]).toBe(row({ titleAs: 'h2' }).match(cls)?.[1])
  })
})

describe('FeatureRow eyebrow', () => {
  it('renders above the title, inside the copy column', () => {
    const html = row({ eyebrow: <span data-eyebrow>The PR check</span>, titleAs: 'h2' })
    expect(html.indexOf('data-eyebrow')).toBeLessThan(html.indexOf('<h2'))
  })

  it('takes the 24px gap on a block wrapper, never on the slot', () => {
    // `Eyebrow` is inline-block and its own bottom margin does not collapse.
    expect(row({ eyebrow: <span /> })).toContain('class="mb-[24px]"')
  })

  it('is absent entirely when not passed', () => {
    expect(row()).not.toContain('mb-[24px]')
  })
})

describe('FeatureRow splitAt="never"', () => {
  it('emits no column variant at any breakpoint', () => {
    expect(row({ splitAt: 'never' })).not.toMatch(/grid-cols-/)
  })

  it('still emits one for every real breakpoint', () => {
    for (const bp of ['md', 'lg', 'xl'] as const) {
      expect(row({ splitAt: bp })).toContain(`${bp}:grid-cols-[0.9fr_1.1fr]`)
    }
  })

  it('leaves reverse inert, because there is no second track to move to', () => {
    expect(row({ splitAt: 'never', reverse: true })).toBe(row({ splitAt: 'never' }))
  })

  it('keeps the card shell — the point is the arrangement, not the frame', () => {
    expect(row({ splitAt: 'never' })).toContain('rounded-2xl')
    expect(row({ splitAt: 'never' })).toContain('bg-chrome-surface-1')
  })
})

describe('FeatureRow without a title', () => {
  it('renders no heading element at all, rather than an empty one', () => {
    const html = bare()
    expect(html).not.toMatch(/<h[1-6]/)
  })

  it('still renders everything else it was given', () => {
    const html = bare({ eyebrow: <span data-eyebrow />, n: '01' })
    expect(html).toContain('data-eyebrow')
    expect(html).toContain('01')
  })
})

describe('FeatureRow visual inset', () => {
  it('spends 34px a side when the card is split', () => {
    for (const bp of ['md', 'lg', 'xl'] as const) {
      expect(row({ splitAt: bp })).toContain('p-[34px]')
    }
  })

  it('spends 16px when it is stacked, because nothing sits beside the visual', () => {
    // 68px reclaimed, on exactly the artifacts that chose `never` for being too
    // wide to sit beside anything. Measured: a five-stage LifecycleCanvas at
    // 1440 got 946px of strip against the 998 it needs.
    expect(row({ splitAt: 'never' })).toContain('p-[16px]')
    expect(row({ splitAt: 'never' })).not.toContain('p-[34px]')
  })

  it('does not apply either when the visual sits on a texture', () => {
    // `SectionBackdrop` owns its own inset; the padded wrapper is the fallback.
    const t = row({ splitAt: 'never', texture: 'journey' })
    expect(t).not.toContain('p-[16px]')
    expect(t).not.toContain('p-[34px]')
  })
})

describe('FeatureRow title scale', () => {
  it('is the fluid row clamp by default, so the homepage does not move', () => {
    expect(row()).toContain('text-[clamp(1.75rem,2.4vw,2.55rem)]')
  })

  it('takes the flat section scale on request', () => {
    const html = row({ titleScale: 'section' })
    expect(html).toContain('text-[length:var(--font-size-marketing-xl)]')
    expect(html).not.toContain('clamp(1.75rem,2.4vw,2.55rem)')
  })

  it('emits one size and never both', () => {
    // The bug this guards is a className that appends rather than replaces:
    // two font sizes on one element resolve by source order in the emitted
    // stylesheet, which is not a thing a caller can reason about.
    for (const scale of ['row', 'section'] as const) {
      const m = row({ titleScale: scale }).match(/<h3 class="([^"]+)"/)
      const sizes = (m?.[1] ?? '').split(/\s+/).filter((c) => /^text-\[/.test(c))
      expect(sizes).toHaveLength(1)
    }
  })

  it('spells both scales literally, so Tailwind can see them', () => {
    const src = readFileSync(new URL('../src/sections/feature-row.tsx', import.meta.url), 'utf8')
    expect(src).toContain("'text-[length:var(--font-size-marketing-xl)]'")
    expect(src).toContain("'text-[clamp(1.75rem,2.4vw,2.55rem)]'")
  })
})
