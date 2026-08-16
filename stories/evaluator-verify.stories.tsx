import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { EvaluatorVerify } from '@skene/design-system/sections/evaluator-verify'

/**
 * The requirements an evaluation depends on: one row per event, its verdict, and
 * the fields it must carry.
 *
 * `fields` nests inside a requirement, so a row can fail because the EVENT is
 * missing or because one field on a present event is. Those are different
 * findings and the component keeps them at different depths for that reason.
 */
const meta = {
  title: 'Sections/EvaluatorVerify',
  component: EvaluatorVerify,
  parameters: { layout: 'fullscreen' },
  argTypes: { frame: { control: 'inline-radio', options: ['gh', 'db', 'jr', false] } },
} satisfies Meta<typeof EvaluatorVerify>

export default meta
type Story = StoryObj<typeof meta>

const requirements = [
  {
    name: 'checkout_started',
    status: 'warn' as const,
    verdict: 'found, one field missing',
    tags: ['track'],
    fields: [
      { name: 'cart_value', status: 'bad' as const, verdict: 'absent', note: 'removed in #259' },
      { name: 'item_count', status: 'ok' as const, verdict: 'present' },
    ],
  },
  {
    name: 'signup_started',
    status: 'bad' as const,
    verdict: 'not found in any route',
    tags: ['track'],
  },
  {
    name: 'page_view',
    status: 'ok' as const,
    verdict: 'present',
    tags: ['page'],
    fields: [{ name: 'path', status: 'ok' as const, verdict: 'present' }],
  },
]

export const Mixed: Story = {
  args: {
    crumb: 'Workspace / Evaluations / Checkout completion',
    summary: { status: 'bad' as const, label: '2 of 5 signals' },
    title: 'Checkout completion',
    subtitle: 'What this evaluation needs before it can report a number',
    requirements,
    frame: 'db',
  },
}

export const AllPresent: Story = {
  args: {
    ...Mixed.args,
    summary: { status: 'ok' as const, label: '5 of 5 signals' },
    requirements: requirements.map((r) => ({
      ...r,
      status: 'ok' as const,
      verdict: 'present',
      fields: r.fields?.map((f) => ({ ...f, status: 'ok' as const, verdict: 'present', note: undefined })),
    })),
  },
}

/** No nested fields — event-level verdicts only. */
export const EventsOnly: Story = {
  args: {
    ...Mixed.args,
    requirements: requirements.map(({ name, status, verdict, tags }) => ({
      name,
      status,
      verdict,
      tags,
    })),
  },
}

export const Unframed: Story = { args: { ...Mixed.args, frame: false } }
