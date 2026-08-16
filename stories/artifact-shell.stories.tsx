import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import {
  AppPanel,
  AppWindow,
  ArtFrame,
  ArtPanel,
  ArtTitle,
  DataCell,
  DataRow,
  DataTable,
  PanelCaption,
  StatPill,
} from '@skene/design-system/sections/artifact-shell'

/**
 * The shell every drawn Skene Cloud artifact is built from. Nine exports, and
 * the reason so many sections in this package look alike is that they are all
 * this.
 *
 * The one fact that matters at every call site: **`AppWindow` forces `light`.**
 * Everything inside it is on a near-white app surface regardless of the page's
 * mode, which is correct — it is a picture of a light product UI — and is also
 * why any consumer text placed near it needs its own ground. That is the
 * mechanism behind the 1.00:1 defect recorded in the FeatureRow stories.
 *
 * `StatPill` is the only status colour in here, and there are exactly three.
 */
const meta = {
  title: 'Sections/ArtifactShell',
  component: AppWindow,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AppWindow>

export default meta
type Story = StoryObj<typeof meta>

export const Window: Story = {
  args: {
    crumb: 'Workspace / Journeys / Activation',
    actions: <StatPill status="warn">2 of 6 bound</StatPill>,
    children: (
      <AppPanel>
        <PanelCaption>Milestones</PanelCaption>
        <p className="text-[13px] text-text-muted">Four have nothing behind them.</p>
      </AppPanel>
    ),
  },
}

/** No bar at all — `AppWindow` drops it when neither crumb nor actions is given. */
export const WindowWithoutBar: Story = {
  args: {
    children: (
      <AppPanel>
        <PanelCaption>Milestones</PanelCaption>
      </AppPanel>
    ),
  },
}

export const Table: Story = {
  args: {
    crumb: 'Workspace / Events',
    children: (
      <AppPanel>
        <DataTable columns={['Event', 'Found at', 'Status']}>
          <DataRow>
            <DataCell mono>checkout_started</DataCell>
            <DataCell muted>app/(shop)/cart/page.tsx</DataCell>
            <DataCell>
              <StatPill status="ok">verified</StatPill>
            </DataCell>
          </DataRow>
          <DataRow>
            <DataCell mono>signup_started</DataCell>
            <DataCell muted>—</DataCell>
            <DataCell>
              <StatPill status="bad">missing</StatPill>
            </DataCell>
          </DataRow>
        </DataTable>
      </AppPanel>
    ),
  },
}

/** All three pill statuses, which is the whole colour vocabulary of the shell. */
export const Pills: Story = {
  args: {
    children: (
      <AppPanel>
        <div className="flex gap-2">
          <StatPill status="ok">verified</StatPill>
          <StatPill status="warn">changed</StatPill>
          <StatPill status="bad">missing</StatPill>
        </div>
      </AppPanel>
    ),
  },
}

/** The framed variants — the textured field the window sits on. */
export const Frames: Story = {
  render: () => (
    <div className="grid gap-6">
      {(['gh', 'db', 'jr'] as const).map((k) => (
        <ArtFrame key={k} kind={k}>
          <ArtPanel bar={<ArtTitle>{k}</ArtTitle>}>
            <p className="text-[13px] text-text-muted">A panel on the {k} field.</p>
          </ArtPanel>
        </ArtFrame>
      ))}
    </div>
  ),
}

/** `row` lays two panels side by side inside one frame. */
export const FrameRow: Story = {
  render: () => (
    <ArtFrame kind="db" row>
      <ArtPanel bar={<ArtTitle>Before</ArtTitle>}>
        <p className="text-[13px] text-text-muted">cart_value present</p>
      </ArtPanel>
      <ArtPanel bar={<ArtTitle>After</ArtTitle>}>
        <p className="text-[13px] text-text-muted">cart_value gone</p>
      </ArtPanel>
    </ArtFrame>
  ),
}
