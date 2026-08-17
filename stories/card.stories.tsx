import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@skene/design-system/ui/card'
import { Button } from '@skene/design-system/ui/button'

/**
 * Two cards in one component, and the distinction is the reason `variant` exists.
 *
 * The default is the product container — elevated, `card` tokens, for a
 * dashboard. `variant="surface"` is the FLAT flavour of the same card:
 * `border-surface-border` over `bg-surface-1`, 24px of its own padding, no
 * shadow. That recipe appeared inline eight times across skene-site's routes
 * plus six near-copies that differed only by being an `<a>` — one panel, two
 * spellings that do not grep as each other.
 *
 * ## SCOPE NARROWED IN 0.9.19 — read before reaching for `surface`
 *
 * `surface` is **no longer the marketing grid cell.**
 * `render_marketing_cards_as_feature_row` in `machine/rules.yaml` routes every
 * card on a marketing page to `FeatureRow`, including the small ones in a 2-up
 * or 3-up grid. The reason is not tidiness: skene-site was rendering three card
 * systems on one page — 50 `FeatureRow`s, 51 `Card variant="surface"` grid
 * cells and 2 `LightSectionCard`s — so a reader could tell from the frame
 * whether a section happened to have a product surface beside it.
 *
 * `FeatureRow`'s copy-only path is what makes that affordable: a cell with no
 * `visual` has no 600px floor, so a grid of them stays at content height.
 *
 * **On product surfaces this component is unchanged and remains the default
 * container.** That is the line: inside Skene Cloud, use `Card`. On a marketing
 * page, use `FeatureRow` and pass `titleScale="cell"`.
 *
 * This file said "the marketing flavour" until 0.9.20 and was wrong for a day —
 * `ui/card`'s `useFor` was corrected in 0.9.19 and nobody grepped the stories
 * for the phrase. A gallery and a contract can disagree silently; nothing fails.
 *
 * `asChild` is what retired the anchor copies: `surface` already carries `block`
 * and `no-underline`, so the link needs no classes of its own.
 */
const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: { layout: 'centered' },
  argTypes: { variant: { control: 'inline-radio', options: [undefined, 'surface'] } },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Product: Story = {
  args: {
    className: 'w-[380px]',
    children: (
      <>
        <CardHeader>
          <CardTitle>Activation</CardTitle>
          <CardDescription>2 of 6 milestones bound</CardDescription>
        </CardHeader>
        <CardContent>
          Four events fire on this journey. Two of them stopped after the checkout route moved.
        </CardContent>
        <CardFooter>
          <Button size="sm">Open journey</Button>
        </CardFooter>
      </>
    ),
  },
}

/** The flat panel on a PRODUCT surface. It brings its own padding — no CardContent. */
export const Surface: Story = {
  args: {
    variant: 'surface',
    className: 'w-[380px]',
    children: (
      <>
        <h3 className="font-semibold text-text-primary">Read-only by default</h3>
        <p className="mt-2 text-text-muted">
          The scan reads your repository and writes nothing back to it.
        </p>
      </>
    ),
  },
}

/** `asChild` over an anchor — the six near-copies this replaced. */
export const SurfaceAsLink: Story = {
  args: {
    variant: 'surface',
    asChild: true,
    className: 'w-[380px]',
    children: (
      <a href="#">
        <h3 className="font-semibold text-text-primary">Workspace settings →</h3>
        <p className="mt-2 text-text-muted">Members, keys and data residency.</p>
      </a>
    ),
  },
}

/** Both, side by side, so the flat/elevated difference is visible at a glance. */
export const Comparison: Story = {
  render: () => (
    <div className="flex gap-4">
      <Card className="w-[280px]">
        <CardHeader>
          <CardTitle>Default</CardTitle>
          <CardDescription>Elevated, product tokens</CardDescription>
        </CardHeader>
        <CardContent>Body</CardContent>
      </Card>
      <Card variant="surface" className="w-[280px]">
        <h3 className="font-semibold text-text-primary">Surface</h3>
        <p className="mt-2 text-text-muted">Flat, its own 24px padding. Product surfaces only.</p>
      </Card>
    </div>
  ),
}
