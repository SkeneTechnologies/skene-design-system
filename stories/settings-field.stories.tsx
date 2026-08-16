import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import {
  SettingsInput,
  SettingsSelect,
  SettingsSwitch,
} from '@skene/design-system/ui/settings-field'

/**
 * The workspace form row: label, control and description in one component.
 *
 * `validation` is the axis worth exercising. Colour alone does not carry a
 * verdict — a reader who cannot separate the amber from the red gets nothing
 * from the field — so the states below are here to be looked at beside their
 * copy, not on their own.
 */
const meta = {
  title: 'UI/SettingsField',
  component: SettingsInput,
  parameters: { layout: 'centered' },
  argTypes: {
    validation: {
      control: 'inline-radio',
      options: [undefined, 'success', 'warning', 'error'],
    },
    mono: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { className: 'w-[320px]' },
} satisfies Meta<typeof SettingsInput>

export default meta
type Story = StoryObj<typeof meta>

export const Input: Story = { args: { defaultValue: 'skene_prod' } }
export const Mono: Story = { args: { defaultValue: '1.5M tokens', mono: true } }
export const Success: Story = { args: { defaultValue: 'Verified', validation: 'success' } }
export const Warning: Story = { args: { defaultValue: 'Renamed field', validation: 'warning' } }
export const Error: Story = { args: { defaultValue: 'Missing table', validation: 'error' } }
export const Disabled: Story = { args: { defaultValue: 'Locked', disabled: true } }

/** All four validation states in one frame, which is the only way to judge them. */
export const ValidationScale: Story = {
  render: () => (
    <div className="grid w-[320px] gap-3">
      <SettingsInput defaultValue="No validation" />
      <SettingsInput defaultValue="Verified" validation="success" />
      <SettingsInput defaultValue="Renamed field" validation="warning" />
      <SettingsInput defaultValue="Missing table" validation="error" />
    </div>
  ),
}

export const Select: Story = {
  render: () => (
    <SettingsSelect defaultValue="main" className="w-[320px]">
      <option value="main">main</option>
      <option value="release">release/184</option>
    </SettingsSelect>
  ),
}

export const Switches: Story = {
  render: () => (
    <div className="grid w-[380px] gap-4">
      <SettingsSwitch label="Comment on every PR" description="Off means digest only." />
      <SettingsSwitch label="Block the merge" defaultChecked />
      <SettingsSwitch label="Label on the left" labelPosition="left" />
    </div>
  ),
}
