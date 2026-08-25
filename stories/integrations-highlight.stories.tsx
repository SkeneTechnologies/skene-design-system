import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { IntegrationsHighlight } from '@skene/design-system/sections/integrations-highlight'
import { Button } from '@skene/design-system/ui/button'

/** Homepage integrations band with cream copy and the GSAP card animation. */
const meta = {
  title: 'Sections/IntegrationsHighlight',
  component: IntegrationsHighlight,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof IntegrationsHighlight>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    actions: (
      <>
        <Button variant="outline" size="sm" asChild>
          <a href="/resources/docs">Read the docs</a>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href="https://github.com/SkeneTechnologies/skene">Open GitHub</a>
        </Button>
      </>
    ),
  },
}
