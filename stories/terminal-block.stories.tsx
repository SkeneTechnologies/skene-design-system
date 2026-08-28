import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { TerminalBlock } from '@skene/design-system/sections/terminal-block'

/**
 * A terminal with copyable lines.
 *
 * `command` is what gets copied; `display` is what gets shown. Keeping them
 * separate is what lets a line render with a prompt, an ellipsis or annotation
 * while the clipboard still receives something runnable — a reader who copies a
 * line with `$ ` in it gets a command that fails.
 *
 * Only real commands appear here. `skene analyze` is on `main`; `skene audit`
 * is not, and a story is a place people copy from.
 */
const meta = {
  title: 'Sections/TerminalBlock',
  component: TerminalBlock,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof TerminalBlock>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    className: 'w-[520px]',
    title: 'Scan a checkout',
    lines: [
      { command: 'npx skene login' },
      { command: 'npx skene analyze' },
      { command: 'npx skene status' },
    ],
  },
}

/** A line shown with a prompt but copied without one. */
export const DisplayDiffersFromCommand: Story = {
  args: {
    className: 'w-[520px]',
    lines: [
      { command: 'npx skene analyze', display: '$ npx skene analyze' },
      { command: 'npx skene status', display: '$ npx skene status' },
    ],
  },
}

/** Output lines are not copyable — the flag is per line, not per block. */
export const WithOutput: Story = {
  args: {
    className: 'w-[520px]',
    title: 'What a scan prints',
    lines: [
      { command: 'npx skene analyze' },
      { command: '', display: '14 events found across 6 routes', copyable: false },
      { command: '', display: '3 milestones with nothing bound', copyable: false },
    ],
    note: 'Findings are written to the workspace, not to stdout.',
  },
}

/** One line, no title. The smallest shape. */
export const SingleLine: Story = {
  args: { className: 'w-[520px]', lines: [{ command: 'npx skene analyze' }] },
}

/**
 * A line long enough that scrolling it in place hides the half that matters.
 *
 * `wrap` cancels the nowrap, allows a break mid-token — a URL has no spaces to
 * break at — and hangs the continuation under the command rather than under the
 * prompt. The clipboard still receives `command` unchanged.
 */
export const WrappedLine: Story = {
  args: {
    className: 'w-[360px]',
    title: 'Install the TUI',
    lines: [
      { command: 'npx skene analyze' },
      {
        command:
          'curl -LsSf https://astral.sh/uv/install.sh | sh && uv tool install skene',
        wrap: true,
      },
    ],
  },
}
