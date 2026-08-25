import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { TrustFact, TrustPanel } from '@skene/design-system/sections/trust-panel'

/**
 * `TrustPanel` — the cream security band. Left column is the claim, right
 * column is a list of `TrustFact`s.
 *
 * Two things about it that a call site gets wrong:
 *
 * 1. **`light` is unconditional on the section.** The panel paints
 *    `bg-brand-light` whatever the page is doing, so the class is not a
 *    preference — a conditional one would leave dark-mode tokens on cream.
 * 2. **`eyebrow` is a slot, not a string.** The shipped `Eyebrow` uses
 *    invariant `chrome.*` colours, which are near-invisible here. The caller
 *    passes the chip WITH whatever two-utility override its ground needs. That
 *    is why the prop takes a node.
 *
 * `children` renders inside a `<ul>`. Pass `TrustFact`s, which are `<li>`s.
 */
const meta = {
  title: 'Sections/TrustPanel',
  component: TrustPanel,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof TrustPanel>

export default meta
type Story = StoryObj<typeof meta>

const facts = (
  <>
    <TrustFact icon={<span aria-hidden>◆</span>} title="Read-only by default">
      The scan reads your repository and writes nothing back to it.
    </TrustFact>
    <TrustFact icon={<span aria-hidden>◆</span>} title="Your code stays yours">
      Findings reference files and lines. Source is not retained after a scan.
    </TrustFact>
    <TrustFact icon={<span aria-hidden>◆</span>} title="Revoke in one click">
      The GitHub App's access ends the moment you remove it.
    </TrustFact>
  </>
)

export const Default: Story = {
  args: {
    eyebrow: (
      // The two-utility override the file header describes. Without it this
      // chip is `chrome.text.muted` on cream.
      <span className="rounded-full border border-chrome-line-on-light px-3 py-1 font-mono text-[11px] text-text-muted">
        Security
      </span>
    ),
    title: 'Skene reads your code. It does not keep it.',
    lede: 'The scan runs against a checkout, reports what it found, and retains findings rather than source.',
    links: (
      <>
        <a href="#" className="text-text-primary underline underline-offset-4">
          Security overview
        </a>
        <a href="#" className="text-text-primary underline underline-offset-4">
          Sub-processors
        </a>
      </>
    ),
    children: facts,
  },
}

/**
 * With a background image behind the panel, passed through `className`. This is
 * how the homepage renders it — a texture plus a scrim, because the raw image
 * puts mid-tones under cream type.
 */
export const WithTexture: Story = {
  args: {
    ...Default.args,
    className: 'bg-[image:var(--story-texture)] bg-cover bg-center',
  },
  decorators: [
    (Story) => (
      <div
        style={
          {
            // Inline rather than a Tailwind arbitrary value: a URL written into
            // a class string is scanned out of SOURCE, and a story that
            // interpolates one emits no CSS at all.
            '--story-texture':
              'linear-gradient(color-mix(in oklab, var(--color-brand-light) 82%, transparent), color-mix(in oklab, var(--color-brand-light) 82%, transparent))',
          } as React.CSSProperties
        }
      >
        <Story />
      </div>
    ),
  ],
}

/** No facts. The panel collapses to one column — the template follows the markup. */
export const SingleColumn: Story = {
  args: { ...Default.args, children: undefined },
}

/** No eyebrow, no links. The smallest shape. */
export const ClaimOnly: Story = {
  args: { title: Default.args.title, lede: Default.args.lede, children: facts },
}

/**
 * `TrustFact` outside the panel, on the dark page: `tone="muted"` swaps the
 * two invariant pieces of on-light chrome — the separating rule and the disc —
 * for their theme-following pair. At the default `tint` these rows would keep
 * their type and lose the rule and the circle against this ground.
 */
export const FactsOnDark: Story = {
  render: () => (
    <div className="p-8">
      <ul className="m-0 max-w-[520px] list-none p-0">
        <TrustFact tone="muted" icon="⌂" title="Your systems remain the source of truth">
          Skene reads; it does not become the store.
        </TrustFact>
        <TrustFact tone="muted" icon="✓" title="Every finding is reviewable">
          File and line, on the pull request.
        </TrustFact>
        <TrustFact tone="muted" icon="⇄" title="One engine, four ways to connect">
          CLI, MCP, GitHub App, API.
        </TrustFact>
      </ul>
    </div>
  ),
  args: { title: Default.args.title },
  parameters: { layout: 'fullscreen' },
}
