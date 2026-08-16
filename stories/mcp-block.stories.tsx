import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { McpBlock, McpCode, McpTool } from '@skene/design-system/sections/mcp-block'

/**
 * The MCP surface, drawn.
 *
 * One fact this component is a common place to get wrong: **Skene MCP is a Skene
 * Cloud surface, reached at `POST /api/mcp`.** It is not an OSS CLI subcommand —
 * there is no `skene mcp` on `main` — and the two products are kept apart on
 * purpose. A tool name or an endpoint written here reads as tested, which is
 * exactly why it has to be one that exists.
 */
const meta = {
  title: 'Sections/McpBlock',
  component: McpBlock,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof McpBlock>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    className: 'w-[520px]',
    title: 'Skene MCP',
    meta: 'POST /api/mcp',
    children: (
      <>
        <McpTool name="skene_check" description="Run the checks for a workspace." />
        <McpTool name="skene_gap" description="List milestones with nothing bound." />
        <McpTool name="skene_get_journey" description="Fetch one journey and its steps." />
      </>
    ),
  },
}

export const WithCode: Story = {
  args: {
    className: 'w-[520px]',
    title: 'Skene MCP',
    meta: 'POST /api/mcp',
    children: (
      <>
        <McpCode>{'{ "method": "tools/list" }'}</McpCode>
        <McpTool name="skene_workspace_info" description="Which workspace this session is in." />
      </>
    ),
  },
}

/** Tools without descriptions — the dense listing. */
export const NamesOnly: Story = {
  args: {
    className: 'w-[520px]',
    title: 'Tools',
    children: (
      <>
        <McpTool name="skene_check" />
        <McpTool name="skene_gap" />
        <McpTool name="skene_ack" />
        <McpTool name="skene_view_journey" />
      </>
    ),
  },
}
