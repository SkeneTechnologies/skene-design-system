import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { FlowDiagram, FlowEdge, FlowNode } from '@skene/design-system/sections/flow-diagram'

/**
 * Nodes and edges in a row. Everything is HTML rather than SVG, so the labels
 * wrap, select and are read in document order — an agent parsing the page gets
 * the flow, not a picture of one.
 */
const meta = {
  title: 'Sections/FlowDiagram',
  component: FlowDiagram,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof FlowDiagram>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    note: 'Read at the source, not at the destination.',
    children: (
      <>
        <FlowNode label="Your code" detail="routes and handlers" />
        <FlowEdge value="scan" />
        <FlowNode label="Skene" detail="reads and checks" />
        <FlowEdge value="findings" meta="file · line" />
        <FlowNode label="Your workspace" detail="what to fix" />
      </>
    ),
  },
}

/** Two nodes, one edge — the smallest diagram. */
export const TwoNodes: Story = {
  args: {
    children: (
      <>
        <FlowNode label="Your code" />
        <FlowEdge value="scan" />
        <FlowNode label="Skene" />
      </>
    ),
  },
}

/** Unlabelled edges — the arrows carry the meaning alone. */
export const BareEdges: Story = {
  args: {
    children: (
      <>
        <FlowNode label="Write" />
        <FlowEdge />
        <FlowNode label="Scan" />
        <FlowEdge />
        <FlowNode label="Check" />
        <FlowEdge />
        <FlowNode label="Ship" />
      </>
    ),
  },
}
