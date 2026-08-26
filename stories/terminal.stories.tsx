import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Terminal, TerminalLine } from '@skene/design-system/patterns/terminal'

/**
 * The pattern-layer terminal frame: `.skene-terminal` chrome from
 * styles/effects.css around free-form lines. Distinct from
 * `sections/terminal-block`, which owns copy-to-clipboard and a caption row;
 * this one is the frame a docs page or onboarding step wraps by hand.
 *
 * Only real commands appear here, for the same reason `terminal-block`'s
 * stories insist on it: a story is a place people copy from. The invocation is
 * the OSS CLI's own — `uvx skene`, s-spelled subcommand.
 */
const meta = {
  title: 'Patterns/Terminal',
  component: Terminal,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Terminal>

export default meta
type Story = StoryObj<typeof meta>

/** A command and its output, prompt on the command line only. */
export const Default: Story = {
  render: () => (
    <Terminal title="skene" className="w-[520px]">
      <TerminalLine prompt>uvx skene analyse-journey .</TerminalLine>
      <TerminalLine>reading src/ … 214 files</TerminalLine>
      <TerminalLine>wrote skene-context/journey.yaml</TerminalLine>
    </Terminal>
  ),
}

/** No title: the bar keeps the traffic lights and nothing else. */
export const Untitled: Story = {
  render: () => (
    <Terminal className="w-[520px]">
      <TerminalLine prompt>uvx skene analyse-journey .</TerminalLine>
    </Terminal>
  ),
}
