import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Alert, AlertDescription, AlertTitle } from '@skene/design-system/ui/alert'

/**
 * A static inline notice. Not a toast and not a modal — it sits in the page and
 * stays there, so it is the right control for a condition the reader has to
 * live with rather than dismiss.
 */
const meta = {
  title: 'UI/Alert',
  component: Alert,
  parameters: { layout: 'centered' },
  argTypes: { variant: { control: 'inline-radio', options: ['default', 'destructive'] } },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    className: 'w-[460px]',
    children: (
      <>
        <AlertTitle>Scan finished with gaps</AlertTitle>
        <AlertDescription>
          Three milestones have no event bound to them. Findings are in the workspace.
        </AlertDescription>
      </>
    ),
  },
}

export const Destructive: Story = {
  args: {
    ...Default.args,
    variant: 'destructive',
    children: (
      <>
        <AlertTitle>The scan could not read the repository</AlertTitle>
        <AlertDescription>
          The GitHub App's access was revoked. Reinstall it to run again.
        </AlertDescription>
      </>
    ),
  },
}

/** Title only. The description is optional and the spacing has to hold without it. */
export const TitleOnly: Story = {
  args: { className: 'w-[460px]', children: <AlertTitle>Scan finished with gaps</AlertTitle> },
}
