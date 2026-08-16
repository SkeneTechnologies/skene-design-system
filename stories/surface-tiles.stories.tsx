import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import {
  SurfaceDetail,
  SurfaceTile,
  SurfaceTiles,
} from '@skene/design-system/sections/surface-tiles'

/**
 * The row of connection surfaces, with a detail panel under it.
 *
 * `selected` is presentation, not state — the component does not manage which
 * tile is picked. Anything in `SurfaceDetail`'s `code` slot reads as a tested
 * command, so it has to be one that exists: `skene analyze` is on `main`,
 * `skene mcp` is not, because MCP is a Skene Cloud surface at `POST /api/mcp`
 * rather than an OSS subcommand.
 */
const meta = {
  title: 'Sections/SurfaceTiles',
  component: SurfaceTiles,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SurfaceTiles>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <>
        <SurfaceTile accent="peach" name="MCP server" note="For an agent session" selected icon={<span aria-hidden>◆</span>} />
        <SurfaceTile accent="violet" name="Command line" note="For a checkout" icon={<span aria-hidden>▸</span>} />
        <SurfaceTile accent="blue" name="GitHub App" note="For a pull request" icon={<span aria-hidden>◈</span>} />
        <SurfaceTile accent="neutral" name="Dashboard" note="For everyone else" icon={<span aria-hidden>◉</span>} />
      </>
    ),
  },
}

/** No selection — every tile at rest. */
export const NothingSelected: Story = {
  args: {
    children: (
      <>
        <SurfaceTile accent="peach" name="MCP server" note="For an agent session" />
        <SurfaceTile accent="violet" name="Command line" note="For a checkout" />
        <SurfaceTile accent="blue" name="GitHub App" note="For a pull request" />
      </>
    ),
  },
}

export const WithDetail: Story = {
  args: { children: <SurfaceTile accent="violet" name="Command line" selected /> },
  render: () => (
    <div className="grid gap-4">
      <SurfaceTiles>
        <SurfaceTile accent="peach" name="MCP server" note="For an agent session" />
        <SurfaceTile accent="violet" name="Command line" note="For a checkout" selected />
      </SurfaceTiles>
      <SurfaceDetail tag="Command line" code="npx skene analyze">
        Runs against a checkout and reports what the collection layer is missing.
      </SurfaceDetail>
    </div>
  ),
}

/** A detail with no command — an absent chip is not a hole in the design. */
export const DetailWithoutCode: Story = {
  args: { children: <SurfaceTile accent="blue" name="GitHub App" /> },
  render: () => (
    <SurfaceDetail tag="GitHub App">
      Checks every pull request that touches the collection layer. Nothing to run.
    </SurfaceDetail>
  ),
}
