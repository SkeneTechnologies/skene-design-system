import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@skene/design-system/ui/alert-dialog'
import { Button } from '@skene/design-system/ui/button'

/**
 * A modal that demands an answer before anything continues. The difference from
 * `Dialog` is not visual: this one cannot be dismissed by clicking outside or by
 * Escape alone, because the whole point is that the reader chooses.
 *
 * Use it for destructive and irreversible actions, and nowhere else — a
 * confirmation on a reversible action teaches people to click through them.
 */
const meta = {
  title: 'UI/AlertDialog',
  component: AlertDialog,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof AlertDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Open: Story = {
  args: {
    open: true,
    children: (
      <>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Remove workspace</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this workspace?</AlertDialogTitle>
            <AlertDialogDescription>
              Every scan, finding and journey in it goes with it. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </>
    ),
  },
}

export const Closed: Story = { args: { ...Open.args, open: false } }
