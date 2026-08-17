import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { PlanCard } from '../src/sections/plan-card.js'

/**
 * `/pricing`'s three tier names reached the page only as chips, so that page's
 * outline ran `h1` straight to its section headings with nothing naming a
 * single tier — on the page whose entire structure IS the three tiers. The
 * prototype had them as `<h2>`s.
 *
 * The chip was never the problem. It was the only mark.
 */
const card = (props = {}) =>
  renderToStaticMarkup(<PlanCard tier="Pro" price="$249" unit="/ month" {...props} />)

describe('PlanCard tier heading', () => {
  it('renders no heading by default, which is what the homepage preview wants', () => {
    expect(card()).not.toMatch(/<h[1-6]/)
  })

  it('wraps the chip in a heading on request', () => {
    const html = card({ tierAs: 'h2' })
    expect(html).toMatch(/<h2[^>]*>.*Pro.*<\/h2>/s)
  })

  it('keeps the chip rather than replacing it, so nothing moves on screen', () => {
    const plain = card()
    const heading = card({ tierAs: 'h2' })
    // the chip's own classes survive intact inside the heading
    const chipClass = plain.match(/<span class="([^"]*)"[^>]*>Pro</)?.[1]
    expect(chipClass).toBeTruthy()
    expect(heading).toContain(chipClass!)
  })

  it('zeroes the heading margin the UA would add', () => {
    // The chip row is `items-center`; a UA heading margin re-centres the row
    // and moves the `flag` beside it.
    expect(card({ tierAs: 'h3' })).toMatch(/<h3 class="m-0"/)
  })
})

// ---------------------------------------------------------------------------

import { LightSectionCard } from '../src/sections/light-section-card.js'

/**
 * The third section-heading scale, and the last one measured.
 *
 * `design-system-gaps.md` §2 named it before it was measured — "a tonal band's
 * heading is not on the same scale as the section headings around it" — and
 * closing `FeatureRow`'s scale is what left this one alone on the page. On two
 * routes it renders 32.77px at 1024, 42.66 at 1333 and 46.08 at 1440 against a
 * flat 32 on every band beside it.
 */
const tonal = (props = {}) =>
  renderToStaticMarkup(<LightSectionCard title="Start with the truth." {...props} />)

describe('LightSectionCard title scale', () => {
  it('is its own display clamp by default', () => {
    expect(tonal()).toContain('text-[clamp(2rem,3.2vw,3.25rem)]')
  })

  it('takes the flat section scale on request', () => {
    const html = tonal({ titleScale: 'section' })
    expect(html).toContain('text-[length:var(--font-size-marketing-xl)]')
    expect(html).not.toContain('clamp(2rem,3.2vw,3.25rem)')
  })

  it('emits one size and never both', () => {
    for (const scale of ['display', 'section'] as const) {
      const m = tonal({ titleScale: scale }).match(/<h2 class="([^"]+)"/)
      const sizes = (m?.[1] ?? '').split(/\s+/).filter((c) => /^text-\[/.test(c))
      expect(sizes).toHaveLength(1)
    }
  })
})
