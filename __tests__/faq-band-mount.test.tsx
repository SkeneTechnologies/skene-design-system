import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { FaqBand, FaqRow } from '../src/sections/faq-band.js'

/**
 * A closed FAQ used to ship its questions and none of its answers.
 *
 * Radix mounts `Accordion.Content` only while its row is open, so the answer
 * text reached the RSC flight payload — a JSON-escaped blob inside a `<script>`
 * — and never the rendered document. Measured on `/pricing`: five questions in
 * the DOM, five answers absent from it. Anything reading the page as text got
 * half the content.
 *
 * These assertions are on the SERVER render with every row closed, which is the
 * state a crawler, an agent and a reader-mode extractor all see.
 */

const band = () =>
  renderToStaticMarkup(
    <FaqBand title="What people ask before they start.">
      <FaqRow question="Is there a free tier?">
        Yes. Free is USD 0 and gives you one audit of what your product collects.
      </FaqRow>
      <FaqRow question="What does Pro add?">Continuous monitoring on every pull request.</FaqRow>
    </FaqBand>,
  )

describe('FaqBand server render, all rows closed', () => {
  it('ships the questions', () => {
    expect(band()).toContain('Is there a free tier?')
    expect(band()).toContain('What does Pro add?')
  })

  it('ships the ANSWERS — the thing that was missing', () => {
    expect(band()).toContain('one audit of what your product collects')
    expect(band()).toContain('Continuous monitoring on every pull request')
  })

  it('keeps them collapsed rather than merely present', () => {
    // In the document and out of the layout. `hidden` is indexed; unmounted is not.
    expect(band()).toContain('data-[state=closed]:hidden')
  })

  it('renders one answer node per row, not a duplicate for the closed state', () => {
    const n = band().split('one audit of what your product collects').length - 1
    expect(n).toBe(1)
  })
})
