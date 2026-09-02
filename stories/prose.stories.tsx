import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Prose } from '@skene/design-system/sections/prose'

/**
 * The container that styles the HTML inside it, for documents this package did
 * not author.
 *
 * Extracted after `skene-marketing-website` was found carrying two prose
 * treatments for the same elements, in two vocabularies that could not be
 * compared without reading both.
 */
const meta = {
  title: 'Sections/Prose',
  component: Prose,
  parameters: { layout: 'padded' },
  argTypes: { density: { control: 'inline-radio', options: ['comfortable', 'compact'] } },
  args: {
    children: (
      <article>
        <h2>What the check reads</h2>
        <p>
          Skene reads the repository and the schema, then compares what it finds
          against the plan. A missing write is named where it happened, in the
          pull request that caused it.
        </p>
        <h3>What counts as a break</h3>
        <ul>
          <li>An event that stopped being written</li>
          <li>
            A property that changed shape, for example <code>plan</code> going
            from a string to an object
          </li>
          <li>A table the plan expects that is not there</li>
        </ul>
        <p>
          See the <a href="#">reference</a> for the full list.
        </p>
        <blockquote>A row that stopped arriving is not a failing test.</blockquote>
      </article>
    ),
  },
} satisfies Meta<typeof Prose>

export default meta
type Story = StoryObj<typeof meta>

/** The default rhythm, for a full-width document column. */
export const Comfortable: Story = {}

/** Half the vertical scale, for a dense column. The type does not move. */
export const Compact: Story = { args: { density: 'compact' } }
