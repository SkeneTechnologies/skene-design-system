import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { NumberedStep } from '@skene/design-system/patterns/marketing'
import { LightSectionCard } from '@skene/design-system/sections/light-section-card'
import { Button } from '@skene/design-system/ui/button'

/**
 * `LightSectionCard` — a cream panel in a dark page. It forces `light` on its
 * own subtree, which is the whole point of it and also the whole hazard: any
 * child built for ink now sits on cream.
 *
 * ## SCOPE NARROWED IN 0.9.19 — this is no longer a marketing section band
 *
 * `render_marketing_cards_as_feature_row` gives that role to `FeatureRow`
 * alone: a page that alternates one repeating object cannot also alternate
 * polarity without the cream band reading as a second system. What remains here
 * is every non-marketing use — product surfaces, gallery cases, and any
 * dark-document context needing a correctly-inverted cream subtree, which is
 * the part no other component does.
 *
 * The export and the `light` mechanism are unchanged. Nothing below is dead;
 * the stories are simply no longer a pattern to copy onto a marketing page.
 *
 * ## If you are converting one to `FeatureRow`, three things bite
 *
 * 1. **`titleAs` defaults differ** — `h2` here, `h3` on `FeatureRow`. A straight
 *    swap silently demotes a section heading, and no gate catches it. Pass
 *    `titleAs="h2"`.
 * 2. **This renders a `<section>`; `FeatureRow` renders a `<div>`.** Anything
 *    selecting on the old domPath breaks. The band's own `<section>` is
 *    unaffected, so the page keeps its landmarks and loses a nested one it
 *    should not have had.
 * 3. **Removing `light` is never a one-line change.** A cream ground carries
 *    compensations — a near-black primary button, an on-light hairline on an
 *    outline button, `onLight` on every `NumberedStep`. On skene-site's homepage
 *    two of three would have shipped as near-black on near-black.
 */
const meta = {
  title: 'Sections/LightSectionCard',
  component: LightSectionCard,
  parameters: { layout: 'fullscreen' },
  argTypes: { reverse: { control: 'boolean' } },
} satisfies Meta<typeof LightSectionCard>

export default meta
type Story = StoryObj<typeof meta>

const base = {
  title: 'Four ways to plug Skene in.',
  lede: 'Pick the surface that matches how your team already works.',
  actions: <Button>See the surfaces</Button>,
}

export const Default: Story = {
  args: {
    ...base,
    visual: (
      <div className="rounded-xl border border-chrome-line-on-light bg-surface-1 p-6 text-text-muted">
        A visual that inherits the card's `light` class, so its mode-aware
        tokens resolve to their cream values.
      </div>
    ),
  },
}

export const Reversed: Story = { args: { ...Default.args, reverse: true } }

/**
 * The eyebrow slot. Content only: the card renders it through `Eyebrow` with
 * the on-cream overrides applied inside, so this story is one string — compare
 * the trust-panel `Default` story, where the caller still writes the chip and
 * its two overrides by hand.
 */
export const WithEyebrow: Story = {
  args: { ...Default.args, eyebrow: 'Integrations' },
}

/**
 * `NumberedStep` stacked under the card, which is what the homepage renders.
 *
 * `onLight` exists because of this composition. Without it the step's body
 * takes `chrome.text.*`, which is INVARIANT — it does not follow the `light`
 * class, so near-white type lands on cream. That shipped once as a two-utility
 * override at the call site before the prop existed.
 *
 * Flip `onLight` to `false` on any of the three below to see the failure. The
 * a11y panel reports it; the eye sees it immediately.
 */
export const WithStackedSteps: Story = {
  args: {
    ...base,
    visual: (
      <div className="rounded-xl border border-chrome-line-on-light bg-surface-1 p-6 text-text-muted">
        Surfaces
      </div>
    ),
    children: (
      <div className="mt-[24px] grid gap-[16px] md:grid-cols-3">
        <NumberedStep n="01" title="MCP server" onLight>
          Reached at <code>POST /api/mcp</code>. A Skene Cloud surface, not an
          OSS subcommand — the two are separate products and a short label
          collapses them.
        </NumberedStep>
        <NumberedStep n="02" title="Command line" onLight>
          <code>skene analyze</code> against a checkout.
        </NumberedStep>
        <NumberedStep n="03" title="Dashboard" onLight>
          The hosted workspace, for people who are not in an editor.
        </NumberedStep>
      </div>
    ),
  },
}

/**
 * The regression case: the same three steps with `onLight` off. Kept as a
 * story rather than a comment so Chromatic has a baseline for what the bug
 * looks like, and so it is one click away rather than one rebuild away.
 */
export const StepsMissingOnLight: Story = {
  name: 'Steps missing onLight (defect)',
  args: {
    ...WithStackedSteps.args,
    children: (
      <div className="mt-[24px] grid gap-[16px] md:grid-cols-3">
        <NumberedStep n="01" title="MCP server">
          This body is `chrome.text.muted` on cream. Invariant token, mode-aware
          surface.
        </NumberedStep>
        <NumberedStep n="02" title="Command line">
          Same.
        </NumberedStep>
        <NumberedStep n="03" title="Dashboard">
          Same.
        </NumberedStep>
      </div>
    ),
  },
}
