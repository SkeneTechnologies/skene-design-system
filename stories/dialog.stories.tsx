import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@skene/design-system/ui/dialog'
import { Button } from '@skene/design-system/ui/button'
import { Input } from '@skene/design-system/ui/input'
import { Label } from '@skene/design-system/ui/label'

/**
 * A modal for a task the reader may abandon. `DialogTitle` is required, not
 * decorative — Radix uses it as the dialog's accessible name and warns when it
 * is missing, so a "title-less" modal is announced as nothing at all.
 *
 * Compare `AlertDialog`, which is for a question that must be answered and has
 * no dismiss-by-clicking-outside.
 */
const meta = {
  title: 'UI/Dialog',
  component: Dialog,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const Open: Story = {
  args: {
    open: true,
    children: (
      <>
        <DialogTrigger asChild>
          <Button variant="outline">Rename workspace</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename workspace</DialogTitle>
            <DialogDescription>
              The name appears in findings and in the MCP surface.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="ws">Name</Label>
            <Input id="ws" defaultValue="skene_prod" />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button>Save</Button>
          </DialogFooter>
        </DialogContent>
      </>
    ),
  },
}

export const Closed: Story = { args: { ...Open.args, open: false } }

/** No form — a modal that only explains something. */
export const TextOnly: Story = {
  args: {
    open: true,
    children: (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>What the scan reads</DialogTitle>
          <DialogDescription>
            Source at the commit you point it at. Findings reference files and lines; source is not
            retained after a scan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Got it</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    ),
  },
}
