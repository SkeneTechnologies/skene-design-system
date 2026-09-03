import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { PlanCard } from '../src/sections/plan-card.js'

/**
 * The price slot's tracking must not reach an element the caller passes.
 *
 * `tracking-[-0.06em]` is sized for a large numeral and computes to -3.456px at
 * the clamp's 57.6px. Letter-spacing declared in `em` resolves against the
 * element that DECLARES it and inherits as that absolute length rather than
 * re-resolving against a child's font-size, so a caller passing
 * `<span className="text-[22px]">Contact us</span>` got -3.456px at 22px, which
 * is -0.157em. The word space closed up and the card read "Contactus" on
 * skene-marketing-website's live /pricing.
 *
 * Found in a screenshot pass, by eye, which is the reason for this file: no
 * gate in either repository could see it, and the consuming repo had two copies
 * of the card, one carrying a hand-written `tracking-normal` and the other not.
 */
describe('PlanCard price tracking', () => {
  it('keeps the tight tracking for a bare numeral', () => {
    const html = renderToStaticMarkup(<PlanCard tier="Pro" price="$249" unit="/ month" />)
    expect(html).toMatch(/tracking-\[-0\.06em\]/)
  })

  it('resets tracking on anything the caller wraps, so a small string is not crushed', () => {
    const html = renderToStaticMarkup(
      <PlanCard
        tier="Enterprise"
        price={<span className="text-[22px] leading-none">Contact us</span>}
      />,
    )
    // `&` arrives HTML-escaped in server-rendered markup, which is what the
    // first cut of this assertion missed.
    expect(html).toMatch(/tracking-\[-0\.06em\] \[&amp;_\*\]:tracking-normal/)
  })

  it('leaves the unit alone, because it is a sibling and not a descendant', () => {
    const html = renderToStaticMarkup(<PlanCard tier="Pro" price="$249" unit="/ month" />)
    // The unit's own element, not a byte window around the text: a window wide
    // enough to reach "/ month" also reaches the strong's class list, which is
    // how the first cut of this test failed against correct markup.
    const unitTag = html.match(/<span class="([^"]*)">\/ month<\/span>/)
    expect(unitTag).not.toBeNull()
    expect(unitTag![1]).not.toMatch(/tracking/)
  })
})
