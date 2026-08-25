import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { ValueCard, ValueCards } from '@skene/design-system/sections/value-cards'

/**
 * The cost/gain pair. `tone` is the only colour decision and it is semantic:
 * `cost` is the red side of the argument, `gain` is the peach side. Using them
 * the other way round reads as an error rather than as a style choice.
 */
const meta = {
  title: 'Sections/ValueCards',
  component: ValueCards,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ValueCards>

export default meta
type Story = StoryObj<typeof meta>

export const Pair: Story = {
  args: {
    children: (
      <>
        <ValueCard label="Without" title="A renamed event ships green." tone="cost">
          It passes every test, because no test knows the name mattered.
        </ValueCard>
        <ValueCard label="With" title="The check fails on the pull request." tone="gain">
          Named file, named line, before the merge rather than after the quarter.
        </ValueCard>
      </>
    ),
  },
}

export const Three: Story = {
  args: {
    children: (
      <>
        <ValueCard label="Today" title="Nobody owns the collection layer." tone="cost">
          Analytics assumes engineering, engineering assumes analytics.
        </ValueCard>
        <ValueCard label="Week one" title="You get a map." tone="gain">
          Every signal, where it is written, and whether it fires.
        </ValueCard>
        <ValueCard label="Steady state" title="It stays true." tone="gain">
          A check on every pull request that touches the layer.
        </ValueCard>
      </>
    ),
  },
}

/**
 * `neutral` peers: labelled cards that claim neither a defect nor a payoff.
 * The label is `text.muted` — no red, no verdict — and one `gain` at the end
 * still restores the turn.
 */
export const NeutralPeers: Story = {
  args: {
    children: (
      <>
        <ValueCard label="Growth" title="Did activation fall after the release?" tone="neutral">
          Know whether the drop is real before you redesign onboarding.
        </ValueCard>
        <ValueCard label="Lifecycle" title="What should trigger the next message?" tone="neutral">
          Know which signal a campaign is wired to.
        </ValueCard>
        <ValueCard label="Revenue" title="Which seats convert?" tone="neutral">
          Know what the upgrade path actually looks like.
        </ValueCard>
      </>
    ),
  },
}

/** No label, no body — title only. */
export const TitleOnly: Story = {
  args: {
    children: (
      <>
        <ValueCard title="A renamed event ships green." tone="cost" />
        <ValueCard title="The check fails on the pull request." tone="gain" />
      </>
    ),
  },
}
