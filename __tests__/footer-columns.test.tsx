import { readFileSync } from 'node:fs'

import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { FooterColumn, FooterLink, SiteFooter } from '../src/sections/footer.js'

/**
 * The footer grid used to be `lg:grid-cols-[1.7fr_repeat(3,1fr)]` — brand plus
 * exactly three link columns. skene-site passes four, so its Company column
 * wrapped onto a second row and sat under the brand. Nothing failed: typecheck,
 * lint, build and every existing test were green, because a grid with too few
 * tracks is valid CSS. Only a rendered page showed it.
 *
 * So this asserts on the emitted class string, which is the thing that was
 * wrong. It also guards the reason the track list is a lookup table rather than
 * a template literal: Tailwind scans source text, so an interpolated class name
 * generates no rule and, like every class that generates nothing, does not warn.
 * If someone rewrites COLUMNS as `` `lg:grid-cols-[1.7fr_repeat(${n},1fr)]` ``
 * this test still passes — the string is right, the CSS is missing — which is
 * why the second test greps the source for the literal instead.
 */

function footer(columns: number) {
  return renderToStaticMarkup(
    <SiteFooter brand={<div>brand</div>}>
      {Array.from({ length: columns }, (_, i) => (
        <FooterColumn key={i} title={`Column ${i + 1}`}>
          <FooterLink href="/">Link</FooterLink>
        </FooterColumn>
      ))}
    </SiteFooter>,
  )
}

describe('SiteFooter track count', () => {
  it.each([1, 2, 3, 4, 5])('reserves a track per link column (%i)', (n) => {
    expect(footer(n)).toContain(`lg:grid-cols-[1.7fr_repeat(${n},1fr)]`)
  })

  it('keeps three columns rendering exactly as they did before', () => {
    expect(footer(3)).toContain('grid gap-8 md:grid-cols-2 lg:gap-[60px] lg:grid-cols-[1.7fr_repeat(3,1fr)]')
  })

  it('clamps past five rather than emitting an unknown class', () => {
    // Six columns at 1280px would be narrower than the link text they hold. The
    // clamp is a layout decision; what matters here is that it never asks for a
    // `repeat(6,...)` utility that no stylesheet contains.
    expect(footer(6)).toContain('lg:grid-cols-[1.7fr_repeat(5,1fr)]')
    expect(footer(6)).not.toContain('repeat(6,1fr)')
  })

  it('spells every track list literally, so Tailwind can see it', () => {
    const source = readFileSync(new URL('../src/sections/footer.tsx', import.meta.url), 'utf8')
    for (const n of [1, 2, 3, 4, 5]) {
      expect(source).toContain(`'lg:grid-cols-[1.7fr_repeat(${n},1fr)]'`)
    }
    expect(source).not.toMatch(/grid-cols-\[[^\]]*\$\{/)
  })

  it('ignores a conditionally-absent column', () => {
    const markup = renderToStaticMarkup(
      <SiteFooter brand={<div>brand</div>}>
        <FooterColumn title="One">
          <FooterLink href="/">Link</FooterLink>
        </FooterColumn>
        <FooterColumn title="Two">
          <FooterLink href="/">Link</FooterLink>
        </FooterColumn>
        {false ? <FooterColumn title="Three">x</FooterColumn> : null}
      </SiteFooter>,
    )
    // `Children.count` would say three here and reserve an empty track.
    expect(markup).toContain('lg:grid-cols-[1.7fr_repeat(2,1fr)]')
  })
})
