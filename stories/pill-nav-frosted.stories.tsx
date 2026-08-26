import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import {
  PILL_NAV_FROSTED_STYLE,
  PILL_NAV_POSITION,
} from '@skene/design-system/patterns/pill-nav-frosted'

/**
 * The frosted chrome recipe `PillNav` and its mobile toggle share: a dark
 * translucent wash, a blur-and-saturate backdrop filter, a hairline border.
 * It is a style object rather than a component because it lands on three
 * differently shaped elements, so the story renders it the way a consumer
 * does — spread onto its own markup.
 *
 * The ground is deliberately busy: over a flat colour the frost is
 * indistinguishable from a plain translucent fill, and the backdrop filter is
 * the whole point of the export.
 */
const meta = {
  title: 'Patterns/PillNavFrosted',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const busyGround: React.CSSProperties = {
  background:
    'repeating-linear-gradient(45deg, #2b2018 0 24px, #0a0a0a 24px 48px), ' +
    'radial-gradient(circle at 30% 20%, #fec089 0%, transparent 40%)',
}

/** The frost itself, over a ground with edges for the blur to smear. */
export const Default: Story = {
  render: () => (
    <div className="relative min-h-[240px] p-6" style={busyGround}>
      <span
        className="inline-flex items-center gap-3 rounded-[4px] px-4 py-2 text-sm text-white/90"
        style={PILL_NAV_FROSTED_STYLE}
      >
        Frosted pill over busy media
      </span>
    </div>
  ),
}

/**
 * The two positioning recipes, side by side as class strings on real bars.
 * `absolute` overlays hero media and scrolls away with it; `sticky` stays. A
 * story canvas cannot show the scroll difference, so each bar labels which
 * contract it carries.
 */
export const Positions: Story = {
  render: () => (
    <div className="flex flex-col gap-4 bg-chrome-surface-darker p-6">
      {(Object.keys(PILL_NAV_POSITION) as Array<keyof typeof PILL_NAV_POSITION>).map((key) => (
        <div key={key} className="relative min-h-[96px] overflow-hidden rounded-lg" style={busyGround}>
          <div className={`${PILL_NAV_POSITION[key]} p-3`}>
            <span
              className="inline-block rounded-[4px] px-3 py-1.5 font-mono text-xs text-white/90"
              style={PILL_NAV_FROSTED_STYLE}
            >
              {key}: {PILL_NAV_POSITION[key]}
            </span>
          </div>
        </div>
      ))}
    </div>
  ),
}
