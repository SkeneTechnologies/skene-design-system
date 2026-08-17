import type { Meta, StoryObj } from '@storybook/react-vite'

import { assetUrls } from '@skene/design-system/asset-urls'
import { SurfaceCards, type SurfaceCardItem } from '@skene/design-system/sections/surface-cards'
import { LightSectionCard } from '@skene/design-system/sections/light-section-card'

/**
 * Every state that shipped a defect, per the gallery's own rule.
 *
 * Two of these are the reason the file exists. `TheCreamCell` is the featured
 * card on `brand-light`: it carries `light` on itself, and without that class
 * `text.primary` resolves to #faf1e9 on a #faf1e9 fill — not dim, absent, and it
 * has shipped that way twice in this package. `InsideACreamCard` is the mirror
 * failure: the three ink cards carry `dark`, and without it every mode-aware
 * token in them takes its light value the moment a `light` ancestor is above
 * them, which is exactly where this grid is used.
 */
const meta = {
  title: 'Sections/SurfaceCards',
  component: SurfaceCards,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SurfaceCards>

export default meta
type Story = StoryObj<typeof meta>

/** The shipped set, and the shape the measurements were taken from. */
const FOUR: SurfaceCardItem[] = [
  {
    id: 'mcp',
    icon: '⌘',
    title: 'MCP server',
    context: 'In your coding agent',
    detail: 'Your agent calls it before it opens the pull request.',
    code: 'POST /api/mcp',
  },
  {
    id: 'github',
    icon: '⑂',
    title: 'GitHub App',
    context: 'On your pull requests',
    detail: 'Reviews every PR on the repository you link, and fails the build in CI.',
  },
  {
    id: 'cloud',
    icon: '☁',
    title: 'Cloud API',
    context: 'In the cloud',
    detail: 'The analysis that keeps a record between runs.',
  },
  {
    id: 'cli',
    icon: '›',
    title: 'Command-line tool',
    context: 'On your machine',
    detail: 'The MIT-licensed tool. No account.',
    code: 'skene analyze',
  },
]

/**
 * Four surfaces, two across, the first one lit. This is the live composition and
 * the one the 223px / 16px measurements come from — at 880px the grid is 2x2 and
 * no title wraps.
 */
export const FourSurfaces: Story = {
  args: { surfaces: FOUR, texture: assetUrls.schemaField },
  render: (args) => (
    <div className="w-[520px]">
      <SurfaceCards {...args} />
    </div>
  ),
}

/**
 * THE CASE THIS FILE IS FOR. The featured card is cream, and everything in it —
 * title, context line, detail, the chip's derived hairline — has to resolve
 * against cream rather than against the dark page. If this ever renders as a
 * blank cream rectangle, `light` has come off the article and the type is not
 * dim, it is gone.
 *
 * Two cards rather than four so the cream one is large enough that a regression
 * is unmissable instead of inferred.
 */
export const TheCreamCell: Story = {
  args: { surfaces: FOUR.slice(0, 2) },
  render: (args) => (
    <div className="w-[520px]">
      <SurfaceCards {...args} />
    </div>
  ),
}

/**
 * The mirror failure. Dropped inside a `LightSectionCard`, the grid sits under a
 * `light` ancestor — so the three ink cards need their own `dark` to stop every
 * mode-aware token in them following the cream context onto a near-black fill.
 * This is the placement the consuming site actually uses.
 */
export const InsideACreamCard: Story = {
  args: { surfaces: FOUR },
  render: (args) => (
    <LightSectionCard
      title="Four ways in"
      titleScale="section"
      visual={<SurfaceCards {...args} />}
    />
  ),
}

/**
 * `featured` is an index, not "the first one". A caller whose argument leads with
 * the third surface says so, and the other three must go back to ink cleanly.
 */
export const FeaturedIsNotTheFirst: Story = {
  args: { surfaces: FOUR, featured: 2 },
  render: (args) => (
    <div className="w-[520px]">
      <SurfaceCards {...args} />
    </div>
  ),
}

/**
 * Every optional slot omitted: no icon, no context line, no chip. The card must
 * read as finished rather than as one with holes in it — an absent chip is not a
 * gap in the design, which is the whole reason `code` is optional.
 */
export const WithoutIconsOrChips: Story = {
  args: {
    surfaces: FOUR.map(({ id, title, detail }) => ({ id, title, detail })),
  },
  render: (args) => (
    <div className="w-[520px]">
      <SurfaceCards {...args} />
    </div>
  ),
}

/**
 * One column. Below `sm` the grid collapses, and the long chip is the thing that
 * breaks here: `skene analyze` is short, but a real endpoint on a 320px card is
 * what `[overflow-wrap:anywhere]` and `max-w-full` are for.
 */
export const NarrowSingleColumn: Story = {
  args: {
    surfaces: [
      { ...FOUR[0], code: 'POST /api/mcp?workspace=demo&scope=api:full' },
      FOUR[3],
    ],
  },
  render: (args) => (
    <div className="w-[320px]">
      <SurfaceCards {...args} />
    </div>
  ),
}
