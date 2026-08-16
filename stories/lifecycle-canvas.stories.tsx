import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { LifecycleCanvas } from '@skene/design-system/sections/lifecycle-canvas'

/**
 * `LifecycleCanvas` — the stage rail, one column per lifecycle stage.
 *
 * ## The width fact that matters more than any prop here
 *
 * The rail is `auto-cols-[minmax(190px,1fr)]` with a 12px gap, so N stages want
 * **N × 190 + (N − 1) × 12** pixels before they will compress at all. Five
 * stages is 998px. Below that the rail scrolls, which is fine and intended.
 *
 * What is NOT fine is placing it in a parent that centres its children with
 * `place-items-center`, which sizes the item to fit-content — the canvas then
 * takes its 998px content width instead of its track's, and its forced-light
 * panel spreads under whatever sits beside it. That is how two paragraphs
 * reached 1.00:1 on a production page. The consumer fix is `w-full` on the
 * wrapper; see the FeatureRow stories for the same failure from the other side.
 */
const meta = {
  title: 'Sections/LifecycleCanvas',
  component: LifecycleCanvas,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    summaryStatus: { control: 'inline-radio', options: ['ok', 'warn', 'bad'] },
  },
} satisfies Meta<typeof LifecycleCanvas>

export default meta
type Story = StoryObj<typeof meta>

const stages = [
  {
    key: '01',
    name: 'Acquisition',
    description: 'First contact, before anyone has an account.',
    milestones: [
      { name: 'Landing viewed', bindings: ['page_view'] },
      { name: 'Signup started', description: 'Not fired on the pricing route.' },
    ],
  },
  {
    key: '02',
    name: 'Activation',
    description: 'The first scan a workspace runs.',
    milestones: [{ name: 'Repository connected', bindings: ['repo_connected'] }],
  },
  { key: '03', name: 'Engagement', description: 'Checks running on pull requests.' },
  { key: '04', name: 'Retention', description: 'A second week of scans.' },
  { key: '05', name: 'Revenue', description: 'The upgrade to Pro.' },
]

/** Three stages: 3 × 190 + 24 = 594px. Fits most tracks. */
export const ThreeStages: Story = {
  args: {
    title: 'Lifecycle',
    source: 'demo workspace',
    stages: stages.slice(0, 3),
    summary: '2 of 6 milestones bound',
    summaryStatus: 'warn',
  },
}

/**
 * Five stages — 998px of intrinsic width. Rendered here in a 570px track, the
 * width `FeatureRow`'s visual column takes at 1440. Note the rail scrolls
 * rather than overflowing, because the wrapper is `w-full`.
 */
export const FiveStagesInANarrowTrack: Story = {
  name: 'Five stages in a 570px track',
  args: { ...ThreeStages.args, stages },
  decorators: [
    (Story) => (
      <div className="w-[570px]">
        <Story />
      </div>
    ),
  ],
}

/**
 * The same five stages with the wrapper NOT pinned — `w-fit`, which is what
 * `place-items-center` produces. Compare against the story above: the canvas
 * takes 998px and leaves its track.
 */
export const UnpinnedOverflows: Story = {
  name: 'Unpinned — 998px in a 570px track (defect)',
  args: { ...ThreeStages.args, stages },
  decorators: [
    (Story) => (
      <div className="w-[570px] border border-semantic-error-red">
        <div className="w-fit">
          <Story />
        </div>
      </div>
    ),
  ],
}

export const AllClean: Story = {
  args: {
    ...ThreeStages.args,
    stages: stages.slice(0, 3).map((s) => ({
      ...s,
      milestones: s.milestones?.map((m) => ({ ...m, bindings: ['bound'], description: undefined })),
    })),
    summary: 'Every milestone bound',
    summaryStatus: 'ok',
  },
}
