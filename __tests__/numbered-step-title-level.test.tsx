import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { NumberedStep } from '../src/patterns/marketing.js'

/**
 * The third instance of one prop, and the reason it is not a fourth spelling.
 *
 * `NumberedStep` hardcoded `<h3>`. That is right where the pattern was written
 * for — steps under a band `<h2>` — and wrong where the steps ARE the band.
 * skene-site's `/product/how-it-works` band 1 is three steps beside a
 * decorative texture with no heading of its own, so its outline ran `h1`
 * straight to `h3`: the only heading-level skip measured across its 24 routes,
 * and not something a `className` can reach from outside.
 *
 * `FeatureRow.titleAs` already exists with the same union and the same default.
 * This asserts the two agree, so the next person adding a level control to a
 * fourth component copies a settled shape rather than inventing one.
 */

const step = (props = {}) =>
  renderToStaticMarkup(<NumberedStep n="01" title="Connect and audit" {...props} />)

describe('NumberedStep title level', () => {
  it('is h3 by default, so no existing caller moves', () => {
    expect(step()).toContain('<h3')
    expect(step()).not.toContain('<h2')
  })

  it('is h2 on request', () => {
    const html = step({ titleAs: 'h2' })
    expect(html).toContain('<h2')
    expect(html).not.toContain('<h3')
  })

  it('keeps the same classes and the same type size at either level', () => {
    const attrs = /<h[23] ([^>]+)>/
    expect(step().match(attrs)?.[1]).toBe(step({ titleAs: 'h2' }).match(attrs)?.[1])
    expect(step({ titleAs: 'h2' })).toContain('var(--font-size-marketing-xl)')
  })

  it('still switches ink on a cream ground at either level', () => {
    expect(step({ onLight: true, titleAs: 'h2' })).toContain('text-text-primary')
    expect(step({ titleAs: 'h2' })).toContain('text-chrome-text-primary')
  })
})
