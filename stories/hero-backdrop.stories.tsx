import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { assetUrls } from '@skene/design-system/asset-urls'
import { HeroBackdrop } from '@skene/design-system/patterns/hero-backdrop'
import { DisplayHeading, Eyebrow } from '@skene/design-system/patterns/marketing'

/**
 * The dark textured hero strip every public-site header composes from. The
 * split-header grid deliberately stays a recipe in the source file rather than
 * an export, so what these stories cover is the ground itself: texture under a
 * gradient, and the gradient standing alone when no image is passed.
 */
const meta = {
  title: 'Patterns/HeroBackdrop',
  component: HeroBackdrop,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof HeroBackdrop>

export default meta
type Story = StoryObj<typeof meta>

const copy = (
  <section className="px-10 pb-16 pt-24">
    <div className="flex max-w-xl flex-col items-start gap-4">
      <Eyebrow>How it works</Eyebrow>
      <DisplayHeading size="page" as="h1">
        A dark strip that fades into the page.
      </DisplayHeading>
      <p className="text-sm text-chrome-text-muted">
        The texture is the package&apos;s own subpage dither; the grid around this copy is the
        caller&apos;s, per the recipe in the source file.
      </p>
    </div>
  </section>
)

/** The subpage treatment: the shipped dither at the live opacity. */
export const Default: Story = {
  args: {
    image: assetUrls.subpageDither,
    imageOpacity: 0.72,
    children: copy,
  },
}

/**
 * No image. The prop's own comment is explicit that this is a real state, not
 * a failure: a default that 404s would look intentional while the texture was
 * simply missing, so the component ships none and the gradient carries it.
 */
export const GradientOnly: Story = {
  args: { children: copy },
}
