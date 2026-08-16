import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import {
  FooterColumn,
  FooterLink,
  SiteFooter,
  SocialLink,
  SocialLinks,
} from '@skene/design-system/sections/footer'

/**
 * The site footer.
 *
 * The column grid follows the children rather than hardcoding a count. That
 * sounds obvious and was not: the grid held `repeat(3,1fr)` for months because
 * three columns was the only case anyone had rendered, and skene-site's fourth
 * column wrapped under the brand. Every count from one to `MAX_COLUMNS` has a
 * story here for exactly that reason — the bug was invisible until a second
 * count existed.
 */
const meta = {
  title: 'Sections/Footer',
  component: SiteFooter,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SiteFooter>

export default meta
type Story = StoryObj<typeof meta>

const brand = (
  <div>
    <span className="text-[15px] text-chrome-text-primary">Skene</span>
    <p className="mt-5 max-w-[250px] text-[14px] text-chrome-text-muted-warm">
      Product analytics in your own Supabase.
    </p>
    <SocialLinks>
      <SocialLink href="#" label="LinkedIn">
        in
      </SocialLink>
      <SocialLink href="#" label="GitHub">
        gh
      </SocialLink>
    </SocialLinks>
  </div>
)

const COLUMNS: [string, string[]][] = [
  ['Product', ['How it works', 'Features', 'Integrations', 'Pricing']],
  ['Developers', ['Documentation', 'Open source', 'MCP server']],
  ['Resources', ['Blog', 'Glossary', 'Playbooks', 'Releases']],
  ['Company', ['About', 'Community', 'Contact']],
]

const cols = (n: number) =>
  COLUMNS.slice(0, n).map(([title, links]) => (
    <FooterColumn key={title} title={title}>
      {links.map((l) => (
        <FooterLink key={l} href="#">
          {l}
        </FooterLink>
      ))}
    </FooterColumn>
  ))

const shared = {
  wordmark: 'Skene',
  copyright: '© 2026 Skene. All rights reserved.',
  legal: 'Privacy Policy',
  brand,
}

export const FourColumns: Story = { args: { ...shared, children: cols(4) } }
export const ThreeColumns: Story = { args: { ...shared, children: cols(3) } }
export const TwoColumns: Story = { args: { ...shared, children: cols(2) } }
export const OneColumn: Story = { args: { ...shared, children: cols(1) } }

/** No brand block — the columns take the whole width. */
export const WithoutBrand: Story = { args: { ...shared, brand: undefined, children: cols(4) } }
