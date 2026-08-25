import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { FaqBand, FaqRow } from '@skene/design-system/sections/faq-band'
import { Button } from '@skene/design-system/ui/button'

/**
 * The FAQ band.
 *
 * `multiple` decides whether more than one answer can be open. The more
 * important property is not visible in any screenshot: the answers are in the
 * DOCUMENT whether open or not, hidden rather than unmounted. On a site whose
 * premise is being agent-readable, an answer that only exists after a click is
 * an answer a reader cannot get — and that was a real defect here, fixed in
 * 0.9.13.
 */
const meta = {
  title: 'Sections/FaqBand',
  component: FaqBand,
  parameters: { layout: 'fullscreen' },
  argTypes: { multiple: { control: 'boolean' } },
} satisfies Meta<typeof FaqBand>

export default meta
type Story = StoryObj<typeof meta>

const rows = (
  <>
    <FaqRow question="Do I have to swap my SDK?">
      No. Skene reads the collection layer where it is written, in your own code.
    </FaqRow>
    <FaqRow question="What does the free plan scan?">
      One repository, in full. Findings are yours to export.
    </FaqRow>
    <FaqRow question="Does Skene keep my source?">
      No. Findings reference files and lines; source is not retained after a scan.
    </FaqRow>
  </>
)

export const Default: Story = {
  args: {
    eyebrow: 'Questions',
    title: 'The ones people actually ask.',
    children: rows,
  },
}

export const Multiple: Story = { args: { ...Default.args, multiple: true } }

export const WithNote: Story = {
  args: { ...Default.args, note: 'Everything else is in the docs.' },
}

/**
 * The head-actions slot: a CTA under the note, in the heading column. The
 * button is the near-black variant on purpose — this column is cream, where
 * the default peach primary lands darker than intended (the same inversion
 * caveat as `LightSectionCard.actions`).
 */
export const WithActions: Story = {
  args: {
    ...Default.args,
    note: 'Everything else is in the docs.',
    actions: <Button variant="secondary">Talk to us</Button>,
  },
}

/** No eyebrow — title only. */
export const TitleOnly: Story = { args: { title: 'Questions', children: rows } }

/** One row. */
export const SingleRow: Story = {
  args: {
    title: 'One question',
    children: <FaqRow question="Do I have to swap my SDK?">No.</FaqRow>,
  },
}
