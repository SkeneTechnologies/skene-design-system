import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@skene/design-system/ui/tabs'

/** Mutually exclusive views, as a segmented control. */
const meta = {
  title: 'UI/Tabs',
  component: Tabs,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

const panel = (s: string) => (
  <div className="mt-3 rounded-md border border-border p-4 text-muted-foreground">{s}</div>
)

export const Two: Story = {
  args: {
    defaultValue: 'found',
    className: 'w-[460px]',
    children: (
      <>
        <TabsList>
          <TabsTrigger value="found">Found</TabsTrigger>
          <TabsTrigger value="missing">Missing</TabsTrigger>
        </TabsList>
        <TabsContent value="found">{panel('14 events, all with a source location.')}</TabsContent>
        <TabsContent value="missing">{panel('3 milestones with nothing bound.')}</TabsContent>
      </>
    ),
  },
}

export const Three: Story = {
  args: {
    defaultValue: 'check',
    className: 'w-[460px]',
    children: (
      <>
        <TabsList>
          <TabsTrigger value="check">Check</TabsTrigger>
          <TabsTrigger value="verify">Verify</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="check">{panel('The formula and its operands.')}</TabsContent>
        <TabsContent value="verify">{panel('The signals this evaluation depends on.')}</TabsContent>
        <TabsContent value="history">{panel('Every run, and what changed.')}</TabsContent>
      </>
    ),
  },
}

/** A disabled trigger — a tab that exists but is not available on this plan. */
export const WithDisabledTab: Story = {
  args: {
    defaultValue: 'check',
    className: 'w-[460px]',
    children: (
      <>
        <TabsList>
          <TabsTrigger value="check">Check</TabsTrigger>
          <TabsTrigger value="history" disabled>
            History
          </TabsTrigger>
        </TabsList>
        <TabsContent value="check">{panel('The formula and its operands.')}</TabsContent>
      </>
    ),
  },
}
