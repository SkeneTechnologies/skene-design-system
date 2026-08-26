import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import {
  Accent,
  DisplayHeading,
  Eyebrow,
  NumberedStep,
} from '@skene/design-system/patterns/marketing'

/**
 * The marketing page furniture: eyebrow chip, display heading, numbered step.
 * One story file for the module, per the coverage rule's unit — these ship
 * together and are used together, an eyebrow over a heading over steps.
 *
 * `PillNav` re-exports from here but has its own module and its own story
 * file; `SplitAuthLayout` is a full-viewport page frame and appears in the
 * docs-app gallery rather than fighting the story canvas for min-h-screen.
 */
const meta = {
  title: 'Patterns/Marketing',
  component: DisplayHeading,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof DisplayHeading>

export default meta
type Story = StoryObj<typeof meta>

/** The section head as the live site sets it: eyebrow, heading, peach accent. */
export const Default: Story = {
  render: () => (
    <div className="flex max-w-3xl flex-col items-start gap-4">
      <Eyebrow>How it works</Eyebrow>
      <DisplayHeading size="section" as="h2">
        Know before it ships, <Accent>not after the review.</Accent>
      </DisplayHeading>
    </div>
  ),
}

/** The three display sizes, so the scale reads as one decision. */
export const HeadingSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <DisplayHeading size="hero" as="h1">
        Hero
      </DisplayHeading>
      <DisplayHeading size="page" as="h1">
        Page
      </DisplayHeading>
      <DisplayHeading size="section" as="h2">
        Section
      </DisplayHeading>
    </div>
  ),
}

/**
 * The steps stack from /product/how-it-works. `titleAs="h3"` is the default —
 * these sit under the section's own h2 — and the dark-band text roles are the
 * default too; the `onLight` state is exercised where it matters, in the
 * light-section-card stories that provide the cream ground.
 */
export const NumberedSteps: Story = {
  render: () => (
    <div className="flex max-w-2xl flex-col gap-8">
      <NumberedStep n="01" title="Describe what you're shipping">
        A plan, in plain words, before any code is read.
      </NumberedStep>
      <NumberedStep n="02" title="Connect a repo">
        Read-only. The scan reports what the plan needs and cannot find.
      </NumberedStep>
    </div>
  ),
}
