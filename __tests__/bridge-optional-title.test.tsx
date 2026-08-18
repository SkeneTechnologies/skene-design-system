import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { Bridge, BridgeNode } from '../src/sections/bridge.js'

/**
 * Ask q: `title` was required and rendered an unconditional `<h2>`.
 *
 * That is right for the band this was written as — a section of its own under
 * the page `<h1>`. It is wrong inside a `FeatureRow`, where the row already
 * carries the section `<h2>`: skene-site's `/developers` printed the band's
 * sentence twice, once as the section head and once inside its own visual, and
 * gave one `<section>` two `<h2>`s.
 *
 * The half of the fix that is easy to get wrong is the SPACING, not the
 * element. The head block is a `text-center` div holding three optional parts.
 * Drop the title from it and the div is still there at zero height, still
 * owning the 56px top margin on the card row — an empty slot under the band's
 * own 88px of padding, which looks precisely like a heading that failed to
 * render. So the assertions below are about `mt-14` and `mt-5` as much as about
 * `<h2>`.
 */

/**
 * Three children, passed as siblings rather than wrapped in a fragment.
 * `Children.toArray` does not flatten a fragment, so `<>…</>` arrives as ONE
 * node: three cards in a single track and no arrows between them. Worth
 * knowing, and worth not asserting through.
 */
const band = (props: Record<string, unknown> = {}) =>
  renderToStaticMarkup(
    <Bridge {...props}>
      <BridgeNode label="GTM" title="Asks" items={['One', 'Two']} />
      <BridgeNode featured label="Skene" title="Checks" items={['Three']} />
      <BridgeNode label="Engineering" title="Ships" items={['Four']} />
    </Bridge>,
  )

/** The card row, which is the element the head block's absence has to reach. */
const rowClasses = (html: string) =>
  html.match(/class="((?:[^"]*\b)?flex flex-col items-stretch[^"]*)"/)?.[1] ?? ''

describe('Bridge title is optional', () => {
  it('renders no heading at all when title is omitted', () => {
    const html = band()
    expect(html).not.toContain('<h1')
    expect(html).not.toContain('<h2')
    expect(html).not.toMatch(/<h[3-6]/)
  })

  it('still renders the three cards and the two arrows', () => {
    const html = band()
    expect(html.match(/<article/g)).toHaveLength(3)
    expect(html.match(/<svg/g)).toHaveLength(2)
  })

  it('drops the head block entirely, so nothing empty is left behind', () => {
    expect(band()).not.toContain('text-center')
  })

  it('drops the card row top margin with it, leaving no gap where the head was', () => {
    expect(rowClasses(band())).not.toContain('mt-14')
  })

  it('keeps that margin whenever any head part is present', () => {
    expect(rowClasses(band({ title: 'A title.' }))).toContain('mt-14')
    expect(rowClasses(band({ eyebrow: 'The product' }))).toContain('mt-14')
    expect(rowClasses(band({ lede: 'One line.' }))).toContain('mt-14')
  })

  it('does not leave the lede spaced from a heading that is not there', () => {
    // A lede with no title above it is the head block on its own. `mt-5` is the
    // gap between two things; with one thing it is the missing heading's slot.
    expect(band({ lede: 'One line.' })).not.toMatch(/mt-5[^"]*">\s*One line\./)
    expect(band({ title: 'A title.', lede: 'One line.' })).toContain('mt-5')
  })
})

describe('Bridge titleAs', () => {
  it('is h2 by default, so every existing caller renders what it renders today', () => {
    const html = band({ title: 'A title.' })
    expect(html).toContain('<h2')
    expect(html).not.toContain('<h3')
  })

  it('is h3 on request, for a band nested under a heading it does not own', () => {
    const html = band({ title: 'A title.', titleAs: 'h3' })
    expect(html).toContain('<h3')
    expect(html).not.toContain('<h2')
  })

  it('keeps the same classes at either level', () => {
    const cls = /<h[23] class="([^"]+)"/
    expect(band({ title: 'A title.' }).match(cls)?.[1]).toBe(
      band({ title: 'A title.', titleAs: 'h3' }).match(cls)?.[1],
    )
  })

  it('matches FeatureRow, which is where the spelling comes from', async () => {
    const { FeatureRow } = await import('../src/sections/feature-row.js')
    const row = renderToStaticMarkup(
      <FeatureRow title="A title." titleAs="h2" visual={<i />} />,
    )
    expect(row).toContain('<h2')
    expect(band({ title: 'A title.', titleAs: 'h2' })).toContain('<h2')
  })
})
