import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { GlyphBadge } from '@skene/design-system/sections/glyph-badge'

/**
 * `GlyphBadge` — the disc a section icon sits in.
 *
 * `size` and `glyphSize` are numbers and strings rather than Tailwind classes
 * on purpose: they land as inline styles, so a caller can pass a token
 * (`var(--font-size-body)`) or a one-off pixel value without either of them
 * needing to exist as a class in the scanned source.
 *
 * The glyph itself is a child, and it is a CHARACTER — never a named HTML
 * entity. `&check;` in JSX ships as six literal characters, because JSX entity
 * tables are per-compiler; `machine/rules.yaml` bans them outright for that
 * reason, and it has shipped to production here once.
 */
const meta = {
  title: 'Sections/GlyphBadge',
  component: GlyphBadge,
  parameters: { layout: 'centered' },
  argTypes: {
    tone: { control: 'inline-radio', options: ['tint', 'muted'] },
    size: { control: { type: 'range', min: 20, max: 72, step: 4 } },
    glyphSize: { control: 'text' },
  },
} satisfies Meta<typeof GlyphBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Tint: Story = { args: { tone: 'tint', size: 32, children: '◆' } }
export const Muted: Story = { args: { tone: 'muted', size: 32, children: '◆' } }

/** Both tones at the sizes that actually ship, side by side. */
export const Scale: Story = {
  args: { children: '◆' },
  render: () => (
    <div className="flex items-end gap-6">
      {[24, 32, 40, 56].map((s) => (
        <div key={s} className="grid justify-items-center gap-2">
          <GlyphBadge tone="tint" size={s} glyphSize="var(--font-size-body)">
            ◆
          </GlyphBadge>
          <span className="font-mono text-[11px] text-chrome-text-muted">{s}</span>
        </div>
      ))}
    </div>
  ),
}

/**
 * On cream. The disc's own fill is mode-aware, so this is the pair worth
 * looking at: switch the theme toolbar and both should stay legible.
 */
export const OnLight: Story = {
  args: { children: '◆' },
  render: () => (
    <div className="light rounded-xl bg-brand-light p-8">
      <div className="flex gap-4">
        <GlyphBadge tone="tint" size={40}>
          ◆
        </GlyphBadge>
        <GlyphBadge tone="muted" size={40}>
          ◆
        </GlyphBadge>
      </div>
    </div>
  ),
}
